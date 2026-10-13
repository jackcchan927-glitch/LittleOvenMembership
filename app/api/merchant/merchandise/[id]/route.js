import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchant } from "@/lib/session";
import { readJson } from "@/lib/readJson";

export async function PATCH(request, { params }) {
  const merchant = await getCurrentMerchant();
  if (!merchant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await readJson(request);
  const data = {};
  if (typeof body.active === "boolean") data.active = body.active;
  if (body.stock !== undefined) data.stock = Math.round(Number(body.stock));

  const item = await prisma.merchandise.update({ where: { id }, data });
  return NextResponse.json({ merchandise: item });
}

export async function DELETE(_request, { params }) {
  const merchant = await getCurrentMerchant();
  if (!merchant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.merchandise.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
