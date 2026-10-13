import { prisma } from "@/lib/prisma";
import MerchandiseManager from "./MerchandiseManager";

export default async function MerchandisePage() {
  const merchandise = await prisma.merchandise.findMany({ orderBy: { createdAt: "desc" } });
  return <MerchandiseManager merchandise={merchandise} />;
}
