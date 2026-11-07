import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers into Indian Rupee notation (Lakhs and Crores)
 * Supports Sale prices (₹1.50 Cr) and Monthly Rent (₹45,000 / mo)
 */
export function formatIndianCurrency(
  amount: number,
  listingType: 'Sale' | 'Rent' = 'Sale'
): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  if (amount === 0) return 'Price on Request';

  if (listingType === 'Rent') {
    if (amount >= 100000) {
      const lakhs = amount / 100000;
      return `₹${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 2)} L / month`;
    }
    return `₹${amount.toLocaleString('en-IN')} / month`;
  }

  // Sale format
  if (amount >= 10000000) {
    const crores = amount / 10000000;
    return `₹${crores.toFixed(crores % 1 === 0 ? 0 : 2)} Cr`;
  }
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 2)} L`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format full numbers with Indian commas (e.g. 1,00,000)
 */
export function formatIndianNumber(val: number): string {
  if (!val && val !== 0) return '0';
  return new Intl.NumberFormat('en-IN').format(val);
}

/**
 * Format property area with appropriate unit
 */
export function formatArea(area: number, unit: string = 'sq.ft'): string {
  if (!area) return 'Area on Request';
  return `${formatIndianNumber(area)} ${unit}`;
}

/**
 * Slugify a string for clean SEO URLs
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generate formatted WhatsApp link with prefilled message
 */
export function createWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

/**
 * Format ISO date string into readable Indian format
 */
export function formatDate(isoString: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}
