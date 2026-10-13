"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Card, EmptyState } from "@/components/ui";

const EMPTY_FORM = { name: "", relationship: "", dateOfBirth: "", favouriteFlavor: "", notes: "" };

export default function LovedOneManager({ lovedOnes }) {
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
      const res = await fetch("/api/customer/loved-ones", {
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

  async function deleteLovedOne(id) {
    if (!confirm("Remove this birthday from your list?")) return;
    await fetch(`/api/customer/loved-ones/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Loved ones&apos; birthdays</h1>
          <p className="mt-1 text-sm text-stone-500">
            Keep track of the people you want to remember with a cake or treat.
          </p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "Add birthday"}</Button>
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
              label="Relationship"
              placeholder="e.g. Spouse, Mom, Best friend"
              value={form.relationship}
              onChange={(e) => setForm({ ...form, relationship: e.target.value })}
            />
            <Input
              label="Date of birth"
              type="date"
              required
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            />
            <Input
              label="Favourite flavour"
              placeholder="e.g. Chocolate, Red velvet"
              value={form.favouriteFlavor}
              onChange={(e) => setForm({ ...form, favouriteFlavor: e.target.value })}
            />
            <Textarea
              label="Notes"
              className="sm:col-span-2"
              placeholder="Allergies, preferred size, past orders they loved…"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving…" : "Save birthday"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lovedOnes.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState
              title="No birthdays saved yet"
              body="Add someone you care about so you never miss their special day."
            />
          </div>
        ) : (
          lovedOnes.map((p) => (
            <Card key={p.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-stone-900">{p.name}</h2>
                  {p.relationship && <p className="text-xs text-stone-500">{p.relationship}</p>}
                </div>
                <button
                  className="text-xs font-medium text-red-700"
                  onClick={() => deleteLovedOne(p.id)}
                >
                  Remove
                </button>
              </div>
              <p className="mt-2 text-sm text-stone-600">
                {new Date(p.dateOfBirth).toLocaleDateString()}
              </p>
              {p.favouriteFlavor && (
                <p className="mt-1 text-sm text-amber-700">Loves: {p.favouriteFlavor}</p>
              )}
              {p.notes && <p className="mt-2 text-sm text-stone-500">{p.notes}</p>}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
