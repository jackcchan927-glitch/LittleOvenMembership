import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchant } from "@/lib/session";
import { readJson } from "@/lib/readJson";

export async function POST(request) {
  const merchant = await getCurrentMerchant();
  if (!merchant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, imageUrl, startDate, endDate } = await readJson(request);
  if (!title || !startDate) {
    return NextResponse.json({ error: "Title and start date are required." }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  return NextResponse.json({ event }, { status: 201 });
}
