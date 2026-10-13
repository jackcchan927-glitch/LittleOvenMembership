import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchant } from "@/lib/session";
import { readJson } from "@/lib/readJson";

const VALID_STATUSES = ["pending", "fulfilled", "cancelled"];

export async function PATCH(request, { params }) {
  const merchant = await getCurrentMerchant();
  if (!merchant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await readJson(request);
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    const redemption = await tx.redemption.findUnique({ where: { id } });
    if (!redemption) throw new Error("Redemption not found.");

    // Cancelling refunds the points and restocks the item; this only happens once,
    // on the pending -> cancelled transition.
    if (status === "cancelled" && redemption.status !== "cancelled") {
      await tx.customer.update({
        where: { id: redemption.customerId },
        data: { points: { increment: redemption.pointsSpent } },
      });
      await tx.merchandise.update({
        where: { id: redemption.merchandiseId },
        data: { stock: { increment: 1 } },
      });
      await tx.pointTransaction.create({
        data: {
          customerId: redemption.customerId,
          amount: redemption.pointsSpent,
          reason: "Redemption cancelled — points refunded",
        },
      });
    }

    await tx.redemption.update({ where: { id }, data: { status } });
  });

  return NextResponse.json({ ok: true });
}
