import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { verifyToken } from "./auth";

export const MERCHANT_COOKIE = "bakery_merchant_session";
export const CUSTOMER_COOKIE = "bakery_customer_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function setSessionCookie(response, cookieName, token) {
  response.cookies.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie(response, cookieName) {
  response.cookies.set(cookieName, "", { path: "/", maxAge: 0 });
}

// Session is verified fresh against the DB on every call (not just the JWT signature)
// so a password change or deactivation takes effect without re-login.
export async function getCurrentMerchant() {
  const cookieStore = await cookies();
  const token = cookieStore.get(MERCHANT_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload?.merchantId) return null;
  const merchant = await prisma.merchant.findUnique({ where: { id: payload.merchantId } });
  if (!merchant) return null;
  const { passwordHash, ...safe } = merchant;
  return safe;
}

export async function getCurrentCustomer() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload?.customerId) return null;
  const customer = await prisma.customer.findUnique({ where: { id: payload.customerId } });
  if (!customer) return null;
  const { passwordHash, ...safe } = customer;
  return safe;
}
