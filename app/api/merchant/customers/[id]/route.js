import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchant } from "@/lib/session";
import { readJson } from "@/lib/readJson";

export async function PATCH(request, { params }) {
  const merchant = await getCurrentMerchant();
  if (!merchant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { amount, reason } = await readJson(request);

  const amountNum = Number(amount);
  if (!Number.isFinite(amountNum) || amountNum === 0) {
    return NextResponse.json({ error: "Amount must be a non-zero number." }, { status: 400 });
  }
  if (!reason) {
    return NextResponse.json({ error: "Reason is required." }, { status: 400 });
  }

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      points: { increment: Math.round(amountNum) },
      transactions: { create: { amount: Math.round(amountNum), reason: reason.trim() } },
    },
  });

  return NextResponse.json({ customer: { id: customer.id, points: customer.points } });
}
