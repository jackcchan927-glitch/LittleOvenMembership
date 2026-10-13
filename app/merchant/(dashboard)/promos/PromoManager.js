"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Card, Badge, EmptyState } from "@/components/ui";
import { statusOf } from "@/lib/eventStatus";

const EMPTY_FORM = { title: "", description: "", imageUrl: "", code: "", startDate: "", endDate: "" };

export default function PromoManager({ promos }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/merchant/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          startDate: new Date(form.startDate).toISOString(),
          endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setForm(EMPTY_FORM);
      setShowForm(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function deletePromo(id) {
    if (!confirm("Delete this promo?")) return;
    await fetch(`/api/merchant/promos/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Promos</h1>
          <p className="mt-1 text-sm text-stone-500">Discounts and campaigns shown to customers.</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "Add promo"}</Button>
      </div>

      {showForm && (
        <Card className="mt-4">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            {error && (
              <p className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            <Input
              label="Title"
              required
              className="sm:col-span-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              label="Code (optional)"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
            <Input
              label="Image URL (optional)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <Input
              label="Starts"
              type="datetime-local"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
            <Input
              label="Ends (optional)"
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
            <Textarea
              label="Description"
              className="sm:col-span-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Adding…" : "Add promo"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Starts</th>
              <th className="px-4 py-2">Ends</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => {
              const status = statusOf(p);
              return (
                <tr key={p.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-2 font-medium text-stone-900">{p.title}</td>
                  <td className="px-4 py-2 font-mono text-stone-600">{p.code || "—"}</td>
                  <td className="px-4 py-2 text-stone-600">{new Date(p.startDate).toLocaleString()}</td>
                  <td className="px-4 py-2 text-stone-600">
                    {p.endDate ? new Date(p.endDate).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-2">
                    <Badge tone={status}>{status}</Badge>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button variant="danger" onClick={() => deletePromo(p.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {promos.length === 0 && (
          <div className="p-6">
            <EmptyState title="No promos yet" />
          </div>
        )}
      </div>
    </div>
  );
}
