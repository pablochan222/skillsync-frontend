import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;
    const body = await request.json();
    const { courseId } = body;
    
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/enrollments/enroll/${courseId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000
    });

    return NextResponse.json({ message: "Successfully enrolled" });
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
