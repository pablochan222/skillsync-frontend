import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/learner/verify`,
      body,
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      }
    );
    // Clear the email cookie on successful verification
    const res = NextResponse.json(response.data, { status: response.status });
    res.cookies.set('email', '', { maxAge: 0, path: '/' });
    return res;
  } 
  catch (error: any) {
    if (error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    } else if (error.request) {
      return NextResponse.json(
        { message: "Backend server is not responding" },
        { status: 503 }
      );
    } else {
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
