import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify token with backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learner/test`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const data = await response.json();
    
    if (data.isOkay === true) {
      return NextResponse.json({ authenticated: true });
    } else {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Auth verify error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}