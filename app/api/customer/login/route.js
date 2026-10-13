import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";
import { setSessionCookie, CUSTOMER_COOKIE } from "@/lib/session";
import { readJson } from "@/lib/readJson";

export async function POST(request) {
  const { email, password } = await readJson(request);
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const customer = await prisma.customer.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!customer || !(await verifyPassword(password, customer.passwordHash))) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const token = signToken({ customerId: customer.id });
  const response = NextResponse.json({
    customer: { id: customer.id, name: customer.name, email: customer.email },
  });
  setSessionCookie(response, CUSTOMER_COOKIE, token);
  return response;
}
