import { NextRequest, NextResponse } from 'next/server';
import { getProperties, saveProperty } from '@/lib/store';
import { Property } from '@/lib/types';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const location = searchParams.get('location') || undefined;
    const status = searchParams.get('status') || undefined;
    const listingType = searchParams.get('listingType') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const featured = searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined;

    const properties = await getProperties({
      category,
      location,
      status,
      listingType,
      minPrice,
      maxPrice,
      featured,
    });

    return NextResponse.json({ success: true, data: properties });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.category || !body.price || !body.location) {
      return NextResponse.json(
        { success: false, error: 'Title, category, price, and location are required.' },
        { status: 400 }
      );
    }

    const generatedSlug = slugify(`${body.title}-${body.location}`);
    const nextId = body.id || `MAG-${Math.floor(100 + Math.random() * 900)}`;

    const newProperty: Property = {
      id: nextId,
      title: body.title,
      slug: body.slug || generatedSlug,
      category: body.category,
      listingType: body.listingType || 'Sale',
      status: body.status || 'Available',
      price: Number(body.price),
      pricePerSqFt: body.pricePerSqFt ? Number(body.pricePerSqFt) : undefined,
      area: Number(body.area || 0),
      areaUnit: body.areaUnit || 'sq.ft',
      city: body.city || 'Chennai',
      location: body.location,
      address: body.address || body.location,
      bedrooms: body.bedrooms ? Number(body.bedrooms) : undefined,
      bathrooms: body.bathrooms ? Number(body.bathrooms) : undefined,
      parking: body.parking,
      facing: body.facing,
      furnishing: body.furnishing,
      possession: body.possession,
      featured: Boolean(body.featured),
      verified: body.verified !== undefined ? Boolean(body.verified) : true,
      primaryImage: body.primaryImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [body.primaryImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80'],
      description: body.description || '',
      features: Array.isArray(body.features) ? body.features : [],
      nearbyFacilities: body.nearbyFacilities || [],
      reraId: body.reraId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveProperty(newProperty);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
