import { NextResponse } from "next/server";
import { clearSessionCookie, CUSTOMER_COOKIE } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response, CUSTOMER_COOKIE);
  return response;
}
