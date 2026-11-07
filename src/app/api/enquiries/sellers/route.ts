import { NextRequest, NextResponse } from 'next/server';
import { createSellerEnquiry, getSellers } from '@/lib/store';

export async function GET() {
  try {
    const sellers = await getSellers();
    return NextResponse.json({ success: true, data: sellers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.propertyType || !body.location || !body.expectedPrice) {
      return NextResponse.json(
        { success: false, error: 'Full name, phone, property type, location, and expected price are required.' },
        { status: 400 }
      );
    }

    const created = await createSellerEnquiry({
      posterType: body.posterType || 'Owner',
      listingType: body.listingType || 'Sale',
      name: body.name,
      phone: body.phone,
      email: body.email || '',
      preferredContact: body.preferredContact || 'Phone Call',
      propertyType: body.propertyType,
      location: body.location,
      fullAddress: body.fullAddress || body.location,
      area: Number(body.area || 0),
      areaUnit: body.areaUnit || 'sq.ft',
      expectedPrice: Number(body.expectedPrice),
      bedrooms: body.bedrooms ? Number(body.bedrooms) : undefined,
      description: body.description || '',
      ownershipStatus: body.ownershipStatus || 'Sole Owner',
      documentAvailability: Array.isArray(body.documentAvailability) ? body.documentAvailability : [],
      isListedElsewhere: body.isListedElsewhere || 'No',
      timeline: body.timeline || 'Flexible',
      remarks: body.remarks || '',
      images: Array.isArray(body.images) ? body.images : [],
    });

    return NextResponse.json({ success: true, data: created, id: created.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
