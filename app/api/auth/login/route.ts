import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout : 10000
    });
    const data = response.data;

    const res = NextResponse.json({user : data.user});
    (await cookies())
    .set("access_token", data.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: data.expires_in, 
      path: "/",
    });

    return res;
  } catch (error: any) {
    console.error('Proxy error:', error);
    
    if (error.response) {
      return NextResponse.json(
        error.response.data,
        { status: error.response.status }
      );
    } else if (error.request) {
      return NextResponse.json(
        { message: 'Backend server is not responding' },
        { status: 503 }
      );
    } else {
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
