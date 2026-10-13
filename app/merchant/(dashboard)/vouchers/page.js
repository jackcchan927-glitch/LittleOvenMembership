import { prisma } from "@/lib/prisma";
import { isBirthdayMonth } from "@/lib/birthday";
import BirthdayVoucherManager from "./BirthdayVoucherManager";

export default async function BirthdayVouchersPage() {
  const currentYear = new Date().getFullYear();

  const [customers, sentVouchers] = await Promise.all([
    prisma.customer.findMany({ where: { birthday: { not: null } } }),
    prisma.voucher.findMany({
      where: { reason: "birthday" },
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const eligible = customers.filter(
    (c) => isBirthdayMonth(c.birthday) && c.lastBirthdayVoucherYear !== currentYear
  );

  return <BirthdayVoucherManager eligible={eligible} sentVouchers={sentVouchers} />;
}
