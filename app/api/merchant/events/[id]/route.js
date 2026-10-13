import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchant } from "@/lib/session";

export async function DELETE(_request, { params }) {
  const merchant = await getCurrentMerchant();
  if (!merchant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
