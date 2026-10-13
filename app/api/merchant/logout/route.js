import { NextResponse } from "next/server";
import { clearSessionCookie, MERCHANT_COOKIE } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response, MERCHANT_COOKIE);
  return response;
}
