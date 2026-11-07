import { NextRequest, NextResponse } from 'next/server';
import { deleteProperty, getPropertyById, getPropertyBySlug, saveProperty } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    let property = await getPropertyBySlug(id);
    if (!property) {
      property = await getPropertyById(id);
    }

    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await getPropertyById(params.id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    const body = await request.json();
    const updated = await saveProperty({
      ...existing,
      ...body,
      id: params.id,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteProperty(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Property deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
