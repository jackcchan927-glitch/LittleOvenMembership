import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/session";
import { readJson } from "@/lib/readJson";

export async function PATCH(request) {
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, phone, birthday } = await readJson(request);
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const updated = await prisma.customer.update({
    where: { id: customer.id },
    data: {
      name: name.trim(),
      phone: phone?.trim() || null,
      birthday: birthday ? new Date(birthday) : null,
    },
  });

  return NextResponse.json({ customer: { id: updated.id, name: updated.name } });
}
