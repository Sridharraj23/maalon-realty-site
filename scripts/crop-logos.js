const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Standard CRC32 for PNG chunks
const crcTable = new Int32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function decodePng(filePath) {
  const buf = fs.readFileSync(filePath);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf[24];
  const colorType = buf[25];

  if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2)) {
    throw new Error(`Unsupported PNG: bitDepth=${bitDepth}, colorType=${colorType}`);
  }

  const bpp = colorType === 6 ? 4 : 3;
  let idatList = [];
  let pos = 8;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IDAT') idatList.push(buf.subarray(pos + 8, pos + 8 + len));
    pos += 12 + len;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(idatList));

  // Unfilter all scanlines into raw RGBA
  const rawData = Buffer.alloc(width * height * 4);
  const inStride = 1 + width * bpp;
  let prevRow = Buffer.alloc(width * bpp);

  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * inStride];
    const inRow = decompressed.subarray(y * inStride + 1, y * inStride + 1 + width * bpp);
    const unRow = Buffer.alloc(width * bpp);

    for (let i = 0; i < width * bpp; i++) {
      const raw = inRow[i];
      const a = i >= bpp ? unRow[i - bpp] : 0;
      const b = prevRow[i];
      const c = i >= bpp ? prevRow[i - bpp] : 0;

      let val = 0;
      if (filter === 0) val = raw;
      else if (filter === 1) val = (raw + a) & 0xff;
      else if (filter === 2) val = (raw + b) & 0xff;
      else if (filter === 3) val = (raw + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) val = (raw + paethPredictor(a, b, c)) & 0xff;
      else throw new Error(`Unknown filter ${filter}`);

      unRow[i] = val;
    }

    prevRow = unRow;

    // Convert to RGBA
    for (let x = 0; x < width; x++) {
      const outIdx = (y * width + x) * 4;
      const inIdx = x * bpp;
      if (bpp === 4) {
        rawData[outIdx] = unRow[inIdx];
        rawData[outIdx + 1] = unRow[inIdx + 1];
        rawData[outIdx + 2] = unRow[inIdx + 2];
        rawData[outIdx + 3] = unRow[inIdx + 3];
      } else {
        rawData[outIdx] = unRow[inIdx];
        rawData[outIdx + 1] = unRow[inIdx + 1];
        rawData[outIdx + 2] = unRow[inIdx + 2];
        rawData[outIdx + 3] = 255;
      }
    }
  }

  return { width, height, rawData };
}

function findBounds(rgba, width, height, alphaThreshold = 5) {
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alpha = rgba[idx + 3];
      if (alpha > alphaThreshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, maxX, minY, maxY };
}

function encodePng(rgba, width, height) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: 13 bytes
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines with filter byte 0 (None)
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const scanlineOffset = y * (1 + width * 4);
    scanlines[scanlineOffset] = 0; // Filter 0
    const srcOffset = y * width * 4;
    rgba.copy(scanlines, scanlineOffset + 1, srcOffset, srcOffset + width * 4);
  }

  const idatData = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function cropPng(inputFile, outputFile, padding = 4) {
  const { width, height, rawData } = decodePng(inputFile);
  const bounds = findBounds(rawData, width, height);

  if (bounds.minX > bounds.maxX || bounds.minY > bounds.maxY) {
    console.log(`Skipping ${inputFile}: no non-transparent pixels found`);
    return;
  }

  const cropX = Math.max(0, bounds.minX - padding);
  const cropY = Math.max(0, bounds.minY - padding);
  const cropMaxX = Math.min(width - 1, bounds.maxX + padding);
  const cropMaxY = Math.min(height - 1, bounds.maxY + padding);

  const croppedWidth = cropMaxX - cropX + 1;
  const croppedHeight = cropMaxY - cropY + 1;

  const croppedRgba = Buffer.alloc(croppedWidth * croppedHeight * 4);
  for (let y = 0; y < croppedHeight; y++) {
    const srcY = cropY + y;
    const srcOffset = (srcY * width + cropX) * 4;
    const destOffset = (y * croppedWidth) * 4;
    rawData.copy(croppedRgba, destOffset, srcOffset, srcOffset + croppedWidth * 4);
  }

  const pngBuf = encodePng(croppedRgba, croppedWidth, croppedHeight);
  fs.writeFileSync(outputFile, pngBuf);
  console.log(`Cropped ${path.basename(inputFile)}: [${width}x${height}] -> [${croppedWidth}x${croppedHeight}] (saved to ${path.basename(outputFile)})`);
}

// Crop horizontal logo, emblem, wordmark, and vertical logo
cropPng('public/brand/_raw_square_backup/maalon-logo-horizontal.png', 'public/brand/maalon-logo-horizontal.png', 4);
cropPng('public/brand/_raw_square_backup/maalon-logo-vertical.png', 'public/brand/maalon-logo-vertical.png', 6);
cropPng('public/brand/_raw_square_backup/maalon-emblem.png', 'public/brand/maalon-emblem.png', 4);
cropPng('public/brand/_raw_square_backup/maalon-wordmark.png', 'public/brand/maalon-wordmark.png', 4);
