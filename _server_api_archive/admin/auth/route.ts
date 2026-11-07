import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@maalonrealty.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Maalon@2026';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isValid =
      (normalizedEmail === ADMIN_EMAIL.toLowerCase() ||
       normalizedEmail === 'sridhar@maalonrealty.in' ||
       normalizedEmail === 'karthik@maalonrealty.in' ||
       normalizedEmail === 'arun@maalonrealty.in') &&
      password === ADMIN_PASSWORD;

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid administrative credentials' }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        email: normalizedEmail,
        role: 'Founding Partner',
        name: normalizedEmail.split('@')[0].toUpperCase(),
      },
    });

    // Set secure admin session cookie
    response.cookies.set({
      name: 'maalon_admin_session',
      value: `auth_${Buffer.from(normalizedEmail).toString('base64')}_${Date.now()}`,
      httpOnly: false, // Accessible to client-side auth state
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = request.cookies.get('maalon_admin_session');
  if (!session || !session.value) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      role: 'Founding Partner',
      name: 'Partner',
    },
  });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('maalon_admin_session');
  return response;
}
