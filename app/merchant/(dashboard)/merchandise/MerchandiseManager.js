"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Card, Badge, EmptyState } from "@/components/ui";

const EMPTY_FORM = { name: "", description: "", imageUrl: "", pointCost: "", stock: "" };

export default function MerchandiseManager({ merchandise }) {
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
      const res = await fetch("/api/merchant/merchandise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

  async function toggleActive(item) {
    await fetch(`/api/merchant/merchandise/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    router.refresh();
  }

  async function deleteItem(id) {
    if (!confirm("Delete this merchandise item?")) return;
    await fetch(`/api/merchant/merchandise/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Merchandise</h1>
          <p className="mt-1 text-sm text-stone-500">What customers can redeem with points.</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "Add item"}</Button>
      </div>

      {showForm && (
        <Card className="mt-4">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            {error && (
              <p className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            <Input
              label="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Image URL (optional)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <Input
              label="Point cost"
              type="number"
              min="1"
              required
              value={form.pointCost}
              onChange={(e) => setForm({ ...form, pointCost: e.target.value })}
            />
            <Input
              label="Stock"
              type="number"
              min="0"
              required
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <Textarea
              label="Description"
              className="sm:col-span-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Adding…" : "Add item"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Point cost</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {merchandise.map((item) => (
              <tr key={item.id} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-2 font-medium text-stone-900">{item.name}</td>
                <td className="px-4 py-2 text-stone-600">{item.pointCost}</td>
                <td className="px-4 py-2 text-stone-600">{item.stock}</td>
                <td className="px-4 py-2">
                  <Badge tone={item.active ? "active" : "past"}>{item.active ? "active" : "inactive"}</Badge>
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => toggleActive(item)}>
                      {item.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button variant="danger" onClick={() => deleteItem(item.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {merchandise.length === 0 && (
          <div className="p-6">
            <EmptyState title="No merchandise yet" body="Add the first item customers can redeem." />
          </div>
        )}
      </div>
    </div>
  );
}
