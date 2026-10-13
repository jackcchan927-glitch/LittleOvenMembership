import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchant } from "@/lib/session";
import { readJson } from "@/lib/readJson";

export async function POST(request) {
  const merchant = await getCurrentMerchant();
  if (!merchant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, imageUrl, pointCost, stock } = await readJson(request);
  if (!name || !pointCost || stock === undefined || stock === "") {
    return NextResponse.json({ error: "Name, point cost, and stock are required." }, { status: 400 });
  }

  const pointCostNum = Number(pointCost);
  const stockNum = Number(stock);
  if (!Number.isFinite(pointCostNum) || pointCostNum <= 0) {
    return NextResponse.json({ error: "Point cost must be a positive number." }, { status: 400 });
  }
  if (!Number.isFinite(stockNum) || stockNum < 0) {
    return NextResponse.json({ error: "Stock must be a non-negative number." }, { status: 400 });
  }

  const item = await prisma.merchandise.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
      pointCost: Math.round(pointCostNum),
      stock: Math.round(stockNum),
    },
  });

  return NextResponse.json({ merchandise: item }, { status: 201 });
}
