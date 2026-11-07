import { NextRequest, NextResponse } from 'next/server';
import { createBuyerEnquiry, getBuyers } from '@/lib/store';

export async function GET() {
  try {
    const buyers = await getBuyers();
    return NextResponse.json({ success: true, data: buyers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Full name, phone number, and property category are required.' },
        { status: 400 }
      );
    }

    const created = await createBuyerEnquiry({
      name: body.name,
      phone: body.phone,
      email: body.email || '',
      category: body.category,
      preferredLocation: body.preferredLocation || 'Any',
      alternativeLocations: body.alternativeLocations || '',
      minBudget: Number(body.minBudget || 0),
      maxBudget: Number(body.maxBudget || 0),
      requiredArea: body.requiredArea || '',
      bedrooms: body.bedrooms || '',
      bathrooms: body.bathrooms || '',
      purpose: body.purpose || 'Self-use',
      timeline: body.timeline || 'Exploring',
      fundingPreference: body.fundingPreference || 'Exploring options',
      preferences: body.preferences || '',
      propertyId: body.propertyId || undefined,
      propertyName: body.propertyName || undefined,
    });

    return NextResponse.json({ success: true, data: created, id: created.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
