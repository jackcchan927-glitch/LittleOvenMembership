import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { setSessionCookie, CUSTOMER_COOKIE } from "@/lib/session";
import { readJson } from "@/lib/readJson";

export async function POST(request) {
  const { name, email, phone, birthday, password } = await readJson(request);

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await prisma.customer.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const customer = await prisma.customer.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || null,
      birthday: birthday ? new Date(birthday) : null,
      passwordHash: await hashPassword(password),
    },
  });

  const token = signToken({ customerId: customer.id });
  const response = NextResponse.json(
    { customer: { id: customer.id, name: customer.name, email: customer.email } },
    { status: 201 }
  );
  setSessionCookie(response, CUSTOMER_COOKIE, token);
  return response;
}
