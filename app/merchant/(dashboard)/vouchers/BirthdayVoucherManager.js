"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Card, Badge, EmptyState } from "@/components/ui";

export default function BirthdayVoucherManager({ eligible, sentVouchers }) {
  const router = useRouter();
  const [form, setForm] = useState({
    discountValue: "15",
    message: "Happy birthday from all of us at the bakery! Enjoy a treat on us this month.",
    expiresInDays: "30",
  });
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendVouchers(e) {
    e.preventDefault();
    setError("");
    setResult("");
    setLoading(true);
    try {
      const res = await fetch("/api/merchant/vouchers/birthday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setResult(`Sent ${data.count} birthday voucher${data.count === 1 ? "" : "s"}.`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Birthday vouchers</h1>
      <p className="mt-1 text-sm text-stone-500">
        Send a special discount voucher to every customer whose birthday falls this month.
      </p>

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-900">
            {eligible.length} customer{eligible.length === 1 ? "" : "s"} eligible this month
          </h2>
        </div>
        {eligible.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2 text-sm text-stone-600">
            {eligible.map((c) => (
              <li key={c.id} className="rounded-full bg-stone-100 px-3 py-1">
                {c.name}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={sendVouchers} className="mt-4 grid gap-4 sm:grid-cols-2">
          {error && (
            <p className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          {result && (
            <p className="sm:col-span-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {result}
            </p>
          )}
          <Input
            label="Discount (%)"
            type="number"
            min="1"
            max="100"
            required
            value={form.discountValue}
            onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
          />
          <Input
            label="Expires in (days)"
            type="number"
            min="1"
            required
            value={form.expiresInDays}
            onChange={(e) => setForm({ ...form, expiresInDays: e.target.value })}
          />
          <Textarea
            label="Message"
            className="sm:col-span-2"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <div className="sm:col-span-2">
            <Button type="submit" disabled={loading || eligible.length === 0}>
              {loading
                ? "Sending…"
                : eligible.length === 0
                  ? "No one eligible right now"
                  : `Send to ${eligible.length} customer${eligible.length === 1 ? "" : "s"}`}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="mt-6">
        <h2 className="font-semibold text-stone-900">Recently sent</h2>
        {sentVouchers.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="No birthday vouchers sent yet" />
          </div>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {sentVouchers.map((v) => (
              <li key={v.id} className="flex items-center justify-between border-b border-stone-100 pb-2 last:border-0">
                <span className="text-stone-700">
                  {v.customer.name} — <span className="font-mono text-stone-400">{v.code}</span>
                </span>
                <div className="flex items-center gap-2 text-stone-500">
                  <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                  <Badge tone={v.redeemed ? "redeemed" : "active"}>{v.redeemed ? "used" : "active"}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
