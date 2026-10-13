import { getCurrentCustomer } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import RedeemManager from "./RedeemManager";

export default async function RedeemPage() {
  const customer = await getCurrentCustomer();

  const merchandise = await prisma.merchandise.findMany({
    where: { active: true },
    orderBy: { pointCost: "asc" },
  });

  return <RedeemManager merchandise={merchandise} points={customer.points} />;
}
