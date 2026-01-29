import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout : 10000,
      validateStatus : (status)=> status < 500
    });

    if(response.status >= 200 && response.status<300){
      const res = NextResponse.json(response.data, { status: response.status });
      res.cookies.set('email', body.email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 5 * 60,
        path: '/',
      });
      return res;
    }

    return NextResponse.json(response.data, {status : response.status})
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
