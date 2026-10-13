import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchant } from "@/lib/session";
import { readJson } from "@/lib/readJson";
import { isBirthdayMonth, generateVoucherCode } from "@/lib/birthday";

export async function POST(request) {
  const merchant = await getCurrentMerchant();
  if (!merchant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { discountValue, message, expiresInDays } = await readJson(request);
  const discount = Number(discountValue);
  const days = Number(expiresInDays);
  if (!Number.isFinite(discount) || discount <= 0 || discount > 100) {
    return NextResponse.json({ error: "Discount must be between 1 and 100." }, { status: 400 });
  }
  if (!Number.isFinite(days) || days <= 0) {
    return NextResponse.json({ error: "Expiry must be a positive number of days." }, { status: 400 });
  }

  const currentYear = new Date().getFullYear();
  const customers = await prisma.customer.findMany({ where: { birthday: { not: null } } });
  const eligible = customers.filter(
    (c) => isBirthdayMonth(c.birthday) && c.lastBirthdayVoucherYear !== currentYear
  );

  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await prisma.$transaction(
    eligible.flatMap((customer) => [
      prisma.voucher.create({
        data: {
          customerId: customer.id,
          title: "Happy Birthday! 🎉",
          message: message?.trim() || null,
          code: generateVoucherCode(),
          discountType: "percent",
          discountValue: discount,
          reason: "birthday",
          expiresAt,
        },
      }),
      prisma.customer.update({
        where: { id: customer.id },
        data: { lastBirthdayVoucherYear: currentYear },
      }),
    ])
  );

  return NextResponse.json({ count: eligible.length });
}
