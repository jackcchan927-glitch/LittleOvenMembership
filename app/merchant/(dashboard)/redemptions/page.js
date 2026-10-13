import { prisma } from "@/lib/prisma";
import RedemptionManager from "./RedemptionManager";

export default async function RedemptionsPage() {
  const redemptions = await prisma.redemption.findMany({
    include: { customer: true, merchandise: true },
    orderBy: { createdAt: "desc" },
  });

  return <RedemptionManager redemptions={redemptions} />;
}
