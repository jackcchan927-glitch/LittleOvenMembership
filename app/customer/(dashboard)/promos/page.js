import { prisma } from "@/lib/prisma";
import { statusOf } from "@/lib/eventStatus";
import { Card, Badge, EmptyState } from "@/components/ui";

function formatDateRange(startDate, endDate) {
  const start = new Date(startDate).toLocaleDateString();
  if (!endDate) return `From ${start}`;
  return `${start} – ${new Date(endDate).toLocaleDateString()}`;
}

export default async function PromosPage() {
  const promos = await prisma.promo.findMany({ orderBy: { startDate: "asc" } });
  const relevant = promos.filter((p) => statusOf(p) !== "past");

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Promos</h1>
      <p className="mt-1 text-sm text-stone-500">Current and upcoming promotions.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {relevant.length === 0 ? (
          <EmptyState title="No promos right now" body="Check back soon!" />
        ) : (
          relevant.map((p) => {
            const status = statusOf(p);
            return (
              <Card key={p.id}>
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.title} className="mb-3 h-32 w-full rounded-md object-cover" />
                )}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-stone-900">{p.title}</h3>
                  <Badge tone={status}>{status === "active" ? "active" : "upcoming"}</Badge>
                </div>
                <p className="mt-1 text-sm text-stone-500">{formatDateRange(p.startDate, p.endDate)}</p>
                {p.description && <p className="mt-2 text-sm text-stone-600">{p.description}</p>}
                {p.code && (
                  <p className="mt-2 text-sm">
                    Code: <span className="font-mono font-medium">{p.code}</span>
                  </p>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
