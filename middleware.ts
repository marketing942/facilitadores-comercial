import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|login|api/auth).*)"],
};

export async function middleware(req: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("err", "config");
    return NextResponse.redirect(url);
  }
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token || !(await verifyToken(token, secret))) {
    const url = req.nextUrl.clone();
    const next = req.nextUrl.pathname + req.nextUrl.search;
    url.pathname = "/login";
    if (next && next !== "/") url.searchParams.set("next", next);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
