import { prisma } from "@/lib/prisma";
import { statusOf } from "@/lib/eventStatus";
import { Card, Badge, EmptyState } from "@/components/ui";

function formatDateRange(startDate, endDate) {
  const start = new Date(startDate).toLocaleDateString();
  if (!endDate) return start;
  return `${start} – ${new Date(endDate).toLocaleDateString()}`;
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({ orderBy: { startDate: "asc" } });

  const happeningNow = events.filter((e) => statusOf(e) === "active");
  const comingSoon = events.filter((e) => statusOf(e) === "upcoming");

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Events</h1>
      <p className="mt-1 text-sm text-stone-500">What&apos;s on at the bakery.</p>

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Happening now
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {happeningNow.length === 0 ? (
            <EmptyState title="Nothing happening right now" />
          ) : (
            happeningNow.map((e) => (
              <Card key={e.id}>
                {e.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.imageUrl} alt={e.title} className="mb-3 h-32 w-full rounded-md object-cover" />
                )}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-stone-900">{e.title}</h3>
                  <Badge tone="active">now</Badge>
                </div>
                <p className="mt-1 text-sm text-stone-500">{formatDateRange(e.startDate, e.endDate)}</p>
                {e.description && <p className="mt-2 text-sm text-stone-600">{e.description}</p>}
              </Card>
            ))
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Coming soon</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {comingSoon.length === 0 ? (
            <EmptyState title="Nothing scheduled yet" />
          ) : (
            comingSoon.map((e) => (
              <Card key={e.id}>
                {e.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.imageUrl} alt={e.title} className="mb-3 h-32 w-full rounded-md object-cover" />
                )}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-stone-900">{e.title}</h3>
                  <Badge tone="upcoming">upcoming</Badge>
                </div>
                <p className="mt-1 text-sm text-stone-500">{formatDateRange(e.startDate, e.endDate)}</p>
                {e.description && <p className="mt-2 text-sm text-stone-600">{e.description}</p>}
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
