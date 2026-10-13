import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CustomerDetail from "./CustomerDetail";

export default async function CustomerDetailPage({ params }) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      transactions: { orderBy: { createdAt: "desc" }, take: 20 },
      redemptions: { include: { merchandise: true }, orderBy: { createdAt: "desc" }, take: 20 },
      vouchers: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!customer) notFound();

  return <CustomerDetail customer={customer} />;
}
