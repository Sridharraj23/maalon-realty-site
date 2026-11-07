import { NextRequest, NextResponse } from 'next/server';
import { addBuyerNote, updateBuyerStatus } from '@/lib/store';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    if (body.action === 'addNote') {
      const updated = await addBuyerNote(
        params.id,
        body.noteText,
        body.author || 'Admin'
      );
      return NextResponse.json({ success: true, data: updated });
    }

    if (body.status !== undefined || body.assignedTo !== undefined) {
      const updated = await updateBuyerStatus(
        params.id,
        body.status,
        body.assignedTo
      );
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid update payload' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
