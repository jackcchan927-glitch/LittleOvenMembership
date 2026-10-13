"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card, Badge } from "@/components/ui";

export default function CustomerDetail({ customer }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function adjustPoints(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/merchant/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setAmount("");
      setReason("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function updateRedemptionStatus(id, status) {
    await fetch(`/api/merchant/redemptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div>
      <Link href="/merchant/customers" className="text-sm text-amber-700">
        ← Back to customers
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{customer.name}</h1>
          <p className="text-sm text-stone-500">
            {customer.email} {customer.phone ? `· ${customer.phone}` : ""}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-stone-500">Current points</div>
          <div className="text-2xl font-bold text-amber-700">{customer.points}</div>
        </div>
      </div>

      <Card className="mt-6">
        <h2 className="font-semibold text-stone-900">Adjust points</h2>
        <form onSubmit={adjustPoints} className="mt-3 flex flex-wrap items-end gap-3">
          {error && <p className="w-full rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <Input
            label="Amount (use negative to deduct)"
            type="number"
            required
            className="w-48"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            label="Reason"
            required
            className="w-64"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Apply"}
          </Button>
        </form>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-stone-900">Points history</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {customer.transactions.length === 0 && <p className="text-stone-400">No activity yet.</p>}
            {customer.transactions.map((t) => (
              <li key={t.id} className="flex items-center justify-between border-b border-stone-100 pb-2 last:border-0">
                <span className="text-stone-600">{t.reason}</span>
                <span className={t.amount >= 0 ? "font-medium text-emerald-700" : "font-medium text-red-700"}>
                  {t.amount >= 0 ? `+${t.amount}` : t.amount}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="font-semibold text-stone-900">Redemptions</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {customer.redemptions.length === 0 && <p className="text-stone-400">No redemptions yet.</p>}
            {customer.redemptions.map((r) => (
              <li key={r.id} className="flex items-center justify-between border-b border-stone-100 pb-2 last:border-0">
                <span className="text-stone-700">
                  {r.merchandise.name} <span className="text-stone-400">({r.pointsSpent} pts)</span>
                </span>
                <div className="flex items-center gap-2">
                  <Badge tone={r.status}>{r.status}</Badge>
                  {r.status === "pending" && (
                    <>
                      <button
                        className="text-xs font-medium text-emerald-700"
                        onClick={() => updateRedemptionStatus(r.id, "fulfilled")}
                      >
                        Fulfil
                      </button>
                      <button
                        className="text-xs font-medium text-red-700"
                        onClick={() => updateRedemptionStatus(r.id, "cancelled")}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-semibold text-stone-900">Vouchers</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {customer.vouchers.length === 0 && <p className="text-stone-400">No vouchers sent yet.</p>}
          {customer.vouchers.map((v) => (
            <li key={v.id} className="flex items-center justify-between border-b border-stone-100 pb-2 last:border-0">
              <span className="text-stone-700">
                {v.title} <span className="font-mono text-stone-400">{v.code}</span>
              </span>
              <Badge tone={v.redeemed ? "redeemed" : "active"}>{v.redeemed ? "used" : "active"}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
