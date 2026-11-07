import { NextRequest, NextResponse } from 'next/server';
import { getFounders, getSettings, updateFounder, updateSettings } from '@/lib/store';

export async function GET() {
  try {
    const settings = await getSettings();
    const founders = await getFounders();
    return NextResponse.json({ success: true, settings, founders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === 'founder') {
      const updated = await updateFounder(body.id, body.data);
      return NextResponse.json({ success: true, founder: updated });
    }

    const updated = await updateSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
