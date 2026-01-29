import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/enrollments/my-enrollments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000
    });

    return NextResponse.json(response.data);
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