import { NextRequest, NextResponse } from 'next/server';
import { createTestimonial, getTestimonials } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true'; // Admin can view all including pending
    const testimonials = await getTestimonials(!all);
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.content || !body.rating) {
      return NextResponse.json(
        { success: false, error: 'Name, review text, and star rating are required.' },
        { status: 400 }
      );
    }

    const created = await createTestimonial({
      name: body.name,
      email: body.email,
      phone: body.phone,
      transactionType: body.transactionType || 'Buyer',
      propertyLocation: body.propertyLocation || 'Chennai, Tamil Nadu',
      rating: Math.min(5, Math.max(1, Number(body.rating))),
      content: body.content,
      photoUrl: body.photoUrl,
      videoUrl: body.videoUrl,
      featured: false,
    });

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Thank you! Your testimonial has been submitted and will appear after review by our advisory team.',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
