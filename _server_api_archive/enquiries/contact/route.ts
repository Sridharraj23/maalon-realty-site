import { NextRequest, NextResponse } from 'next/server';
import { createContact, getContacts, updateContactStatus } from '@/lib/store';

export async function GET() {
  try {
    const contacts = await getContacts();
    return NextResponse.json({ success: true, data: contacts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Name, phone number, and message are required.' },
        { status: 400 }
      );
    }

    const created = await createContact({
      name: body.name,
      phone: body.phone,
      email: body.email || '',
      category: body.category || 'General Enquiry',
      message: body.message,
    });

    return NextResponse.json({ success: true, data: created, id: created.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ success: false, error: 'ID and status required' }, { status: 400 });
    }
    const updated = await updateContactStatus(body.id, body.status);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
