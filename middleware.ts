import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  const { pathname } = req.nextUrl;

  if (req.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Protect authenticated routes
  if (!token && (pathname.startsWith("/profile") || pathname.startsWith("/dashboard") || pathname.startsWith("/notifications") || pathname.startsWith("/enrolled-courses"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learner/test`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        if(!response.ok){
            response.headers.append(
                "Set-Cookie",
                `access_token=''; HttpOnly; path=/; Max-Age=0; SameSite=Strict; ""`
            );
        }
        const data = await response.json();
        if(data.isOkay === true){
            return NextResponse.redirect(new URL("/profile", req.url));
        }
    }
    catch(error : any){
        const response = NextResponse.next();
        response.cookies.set({
        name: "access_token",
        value: "",
        path: "/",
        maxAge: 0,
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/|favicon.ico).*)',
  ],
};
