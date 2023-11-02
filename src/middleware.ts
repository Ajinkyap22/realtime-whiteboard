import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.rewrite(url);
  } else {
    if (request.nextUrl.pathname === "/") {
      return NextResponse.rewrite(new URL("/board", request.url));
    }
  }
}

export const config = {
  matcher: [],
};
