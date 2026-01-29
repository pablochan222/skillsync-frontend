import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    
    // Get the JWT token from cookies
    const token = request.cookies.get('access_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Make the request to the backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enrollments/unenroll/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status >= 200 && response.status <= 299) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Failed to unenroll' }, { status: response.status });
    }
  } catch (error) {
    console.error('Unenroll proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}