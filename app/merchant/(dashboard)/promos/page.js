import { prisma } from "@/lib/prisma";
import PromoManager from "./PromoManager";

export default async function MerchantPromosPage() {
  const promos = await prisma.promo.findMany({ orderBy: { startDate: "desc" } });
  return <PromoManager promos={promos} />;
}
