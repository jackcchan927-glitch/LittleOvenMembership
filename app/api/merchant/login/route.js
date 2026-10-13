import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";
import { setSessionCookie, MERCHANT_COOKIE } from "@/lib/session";
import { readJson } from "@/lib/readJson";

export async function POST(request) {
  const { email, password } = await readJson(request);
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const merchant = await prisma.merchant.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!merchant || !(await verifyPassword(password, merchant.passwordHash))) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const token = signToken({ merchantId: merchant.id });
  const response = NextResponse.json({
    merchant: { id: merchant.id, name: merchant.name, email: merchant.email },
  });
  setSessionCookie(response, MERCHANT_COOKIE, token);
  return response;
}
