import { getCurrentCustomer } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import LovedOneManager from "./LovedOneManager";

export default async function LovedOnesPage() {
  const customer = await getCurrentCustomer();

  const lovedOnes = await prisma.lovedOne.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
  });

  const plain = lovedOnes.map((p) => ({
    ...p,
    dateOfBirth: p.dateOfBirth.toISOString().slice(0, 10),
  }));

  return <LovedOneManager lovedOnes={plain} />;
}
