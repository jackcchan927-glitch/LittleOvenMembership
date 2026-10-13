import { prisma } from "@/lib/prisma";
import { statusOf } from "@/lib/eventStatus";
import { isBirthdayMonth } from "@/lib/birthday";
import { StatTile } from "@/components/ui";

export default async function MerchantDashboardPage() {
  const [customerCount, pendingRedemptions, events, promos, birthdayCustomers] = await Promise.all([
    prisma.customer.count(),
    prisma.redemption.count({ where: { status: "pending" } }),
    prisma.event.findMany(),
    prisma.promo.findMany(),
    prisma.customer.findMany({ where: { birthday: { not: null } } }),
  ]);

  const upcomingEvents = events.filter((e) => statusOf(e) === "upcoming").length;
  const activePromos = promos.filter((p) => statusOf(p) === "active").length;
  const eligibleThisMonth = birthdayCustomers.filter(
    (c) => isBirthdayMonth(c.birthday) && c.lastBirthdayVoucherYear !== new Date().getFullYear()
  ).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
      <p className="mt-1 text-sm text-stone-500">Overview of your rewards program.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total customers" value={customerCount} />
        <StatTile label="Pending redemptions" value={pendingRedemptions} hint="Needs fulfilment" />
        <StatTile label="Active promos" value={activePromos} />
        <StatTile label="Upcoming events" value={upcomingEvents} />
      </div>

      <div className="mt-4">
        <StatTile
          label="Birthday vouchers ready to send"
          value={eligibleThisMonth}
          hint="Go to Birthday vouchers to send them"
        />
      </div>
    </div>
  );
}
