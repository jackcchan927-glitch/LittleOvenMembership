"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, EmptyState } from "@/components/ui";

export default function RedeemManager({ merchandise, points }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function redeem(item) {
    if (!confirm(`Redeem "${item.name}" for ${item.pointCost} points?`)) return;
    setError("");
    setMessage("");
    setBusyId(item.id);
    try {
      const res = await fetch("/api/customer/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId: item.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setMessage(`Redeemed "${item.name}"! We'll have it ready for you at the counter.`);
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Redeem merchandise</h1>
          <p className="mt-1 text-sm text-stone-500">You have {points} points to spend.</p>
        </div>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {message && (
        <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
      )}

      {merchandise.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No merchandise available yet" body="Check back soon!" />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {merchandise.map((item) => {
            const canAfford = points >= item.pointCost;
            const inStock = item.stock > 0;
            return (
              <Card key={item.id} className="flex flex-col">
                {item.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="mb-3 h-32 w-full rounded-md object-cover"
                  />
                )}
                <h2 className="font-semibold text-stone-900">{item.name}</h2>
                {item.description && (
                  <p className="mt-1 flex-1 text-sm text-stone-500">{item.description}</p>
                )}
                <p className="mt-2 text-sm font-medium text-amber-700">{item.pointCost} points</p>
                <p className="text-xs text-stone-400">{inStock ? `${item.stock} in stock` : "Out of stock"}</p>
                <Button
                  className="mt-3"
                  disabled={!canAfford || !inStock || busyId === item.id}
                  onClick={() => redeem(item)}
                >
                  {busyId === item.id
                    ? "Redeeming…"
                    : !inStock
                      ? "Out of stock"
                      : !canAfford
                        ? "Not enough points"
                        : "Redeem"}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
