import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
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