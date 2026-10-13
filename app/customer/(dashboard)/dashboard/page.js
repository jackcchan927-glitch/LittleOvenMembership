import { getCurrentCustomer } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { statusOf } from "@/lib/eventStatus";
import { Card, StatTile, Badge, EmptyState } from "@/components/ui";

function formatDateRange(startDate, endDate) {
  const start = new Date(startDate).toLocaleDateString();
  if (!endDate) return start;
  return `${start} – ${new Date(endDate).toLocaleDateString()}`;
}

export default async function CustomerDashboardPage() {
  const customer = await getCurrentCustomer();

  const [promos, events, vouchers] = await Promise.all([
    prisma.promo.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.event.findMany({ orderBy: { startDate: "asc" } }),
    prisma.voucher.findMany({
      where: { customerId: customer.id, redeemed: false },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const activePromo = promos.find((p) => statusOf(p) === "active");
  const upcomingEvents = events.filter((e) => statusOf(e) === "upcoming").slice(0, 3);
  const activeEvent = events.find((e) => statusOf(e) === "active");

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Welcome back, {customer.name}</h1>
      <p className="mt-1 text-sm text-stone-500">Here&apos;s what&apos;s happening at the bakery.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatTile label="Your points" value={customer.points} hint="Redeem them for merchandise" />
        <StatTile label="Active vouchers" value={vouchers.length} hint="Check My vouchers" />
        <StatTile label="Upcoming events" value={upcomingEvents.length} />
      </div>

      {vouchers.length > 0 && (
        <Card className="mt-6 border-amber-300 bg-amber-50">
          <h2 className="font-semibold text-stone-900">🎉 You have a special voucher!</h2>
          {vouchers.map((v) => (
            <div key={v.id} className="mt-2 text-sm text-stone-700">
              <span className="font-medium">{v.title}</span> — code{" "}
              <span className="font-mono">{v.code}</span>
              {v.message && <span className="block text-stone-500">{v.message}</span>}
            </div>
          ))}
        </Card>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-stone-900">Latest promo</h2>
          {activePromo ? (
            <div className="mt-2">
              <p className="font-medium text-stone-900">{activePromo.title}</p>
              {activePromo.description && (
                <p className="mt-1 text-sm text-stone-500">{activePromo.description}</p>
              )}
              {activePromo.code && (
                <p className="mt-2 text-sm">
                  Code: <span className="font-mono font-medium">{activePromo.code}</span>
                </p>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-stone-400">No active promo right now.</p>
          )}
        </Card>

        <Card>
          <h2 className="font-semibold text-stone-900">Happening now</h2>
          {activeEvent ? (
            <div className="mt-2">
              <p className="font-medium text-stone-900">{activeEvent.title}</p>
              <p className="mt-1 text-sm text-stone-500">
                {formatDateRange(activeEvent.startDate, activeEvent.endDate)}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-stone-400">No event running right now.</p>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-semibold text-stone-900">Coming soon</h2>
        {upcomingEvents.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Nothing scheduled yet" />
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {upcomingEvents.map((e) => (
              <li key={e.id} className="flex items-center justify-between rounded-md border border-stone-100 px-3 py-2">
                <div>
                  <p className="font-medium text-stone-900">{e.title}</p>
                  <p className="text-xs text-stone-500">{formatDateRange(e.startDate, e.endDate)}</p>
                </div>
                <Badge tone="upcoming">upcoming</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
