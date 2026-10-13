import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/session";
import { readJson } from "@/lib/readJson";

export async function POST(request) {
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, relationship, dateOfBirth, favouriteFlavor, notes } = await readJson(request);
  if (!name || !dateOfBirth) {
    return NextResponse.json({ error: "Name and date of birth are required." }, { status: 400 });
  }

  const lovedOne = await prisma.lovedOne.create({
    data: {
      customerId: customer.id,
      name: name.trim(),
      relationship: relationship?.trim() || null,
      dateOfBirth: new Date(dateOfBirth),
      favouriteFlavor: favouriteFlavor?.trim() || null,
      notes: notes?.trim() || null,
    },
  });

  return NextResponse.json({ lovedOne }, { status: 201 });
}
