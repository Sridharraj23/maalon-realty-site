import { NextRequest, NextResponse } from 'next/server';
import { createSiteVisit, getSiteVisits } from '@/lib/store';

export async function GET() {
  try {
    const visits = await getSiteVisits();
    return NextResponse.json({ success: true, data: visits });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.propertyId || !body.propertyName || !body.visitorName || !body.phone || !body.preferredDate) {
      return NextResponse.json(
        { success: false, error: 'Property ID, property name, visitor name, phone, and date are required.' },
        { status: 400 }
      );
    }

    const created = await createSiteVisit({
      propertyId: body.propertyId,
      propertyName: body.propertyName,
      visitorName: body.visitorName,
      phone: body.phone,
      email: body.email || '',
      preferredDate: body.preferredDate,
      preferredTime: body.preferredTime || '11:00 AM',
      notes: body.notes || '',
    });

    return NextResponse.json({ success: true, data: created, id: created.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
