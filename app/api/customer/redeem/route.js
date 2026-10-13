import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/session";
import { readJson } from "@/lib/readJson";

export async function POST(request) {
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { merchandiseId } = await readJson(request);
  if (!merchandiseId) {
    return NextResponse.json({ error: "merchandiseId is required." }, { status: 400 });
  }

  try {
    const redemption = await prisma.$transaction(async (tx) => {
      const item = await tx.merchandise.findUnique({ where: { id: merchandiseId } });
      if (!item || !item.active) throw new Error("This item is not available.");
      if (item.stock <= 0) throw new Error("This item is out of stock.");

      const freshCustomer = await tx.customer.findUnique({ where: { id: customer.id } });
      if (freshCustomer.points < item.pointCost) throw new Error("Not enough points.");

      await tx.customer.update({
        where: { id: customer.id },
        data: { points: { decrement: item.pointCost } },
      });
      await tx.merchandise.update({ where: { id: item.id }, data: { stock: { decrement: 1 } } });
      await tx.pointTransaction.create({
        data: {
          customerId: customer.id,
          amount: -item.pointCost,
          reason: `Redeemed: ${item.name}`,
        },
      });

      return tx.redemption.create({
        data: {
          customerId: customer.id,
          merchandiseId: item.id,
          pointsSpent: item.pointCost,
        },
      });
    });

    return NextResponse.json({ redemption }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 400 });
  }
}
