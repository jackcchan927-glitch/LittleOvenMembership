import { getCurrentCustomer } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, Badge, EmptyState } from "@/components/ui";

function formatDiscount(v) {
  return v.discountType === "percent" ? `${v.discountValue}% off` : `$${v.discountValue} off`;
}

export default async function VouchersPage() {
  const customer = await getCurrentCustomer();
  const vouchers = await prisma.voucher.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">My vouchers</h1>
      <p className="mt-1 text-sm text-stone-500">Special vouchers sent to you by the bakery.</p>

      <div className="mt-6 space-y-3">
        {vouchers.length === 0 ? (
          <EmptyState title="No vouchers yet" body="Birthday-month vouchers will show up here." />
        ) : (
          vouchers.map((v) => {
            const expired = v.expiresAt && new Date(v.expiresAt) < new Date();
            const tone = v.redeemed ? "redeemed" : expired ? "past" : "active";
            return (
              <Card key={v.id} className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-stone-900">{v.title}</h3>
                    <Badge tone={tone}>
                      {v.redeemed ? "used" : expired ? "expired" : "active"}
                    </Badge>
                  </div>
                  {v.message && <p className="mt-1 text-sm text-stone-500">{v.message}</p>}
                  <p className="mt-1 text-sm text-stone-600">{formatDiscount(v)}</p>
                  {v.expiresAt && (
                    <p className="mt-1 text-xs text-stone-400">
                      Expires {new Date(v.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span className="rounded-md bg-stone-100 px-3 py-1.5 font-mono text-sm font-medium text-stone-800">
                  {v.code}
                </span>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
