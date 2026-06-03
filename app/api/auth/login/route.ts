import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, signToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const teamPassword = process.env.TEAM_PASSWORD;
  const secret = process.env.AUTH_SECRET;
  if (!teamPassword || !secret) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }
  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (typeof body.password !== "string" || body.password !== teamPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const { value, maxAge } = await signToken(secret);
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return NextResponse.json({ ok: true });
}
