"use client";

import { useRouter } from "next/navigation";
import { Badge, EmptyState } from "@/components/ui";

export default function RedemptionManager({ redemptions }) {
  const router = useRouter();

  async function updateStatus(id, status) {
    await fetch(`/api/merchant/redemptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Redemptions</h1>
      <p className="mt-1 text-sm text-stone-500">Merchandise customers have redeemed with points.</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Points</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {redemptions.map((r) => (
              <tr key={r.id} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-2 font-medium text-stone-900">{r.customer.name}</td>
                <td className="px-4 py-2 text-stone-600">{r.merchandise.name}</td>
                <td className="px-4 py-2 text-stone-600">{r.pointsSpent}</td>
                <td className="px-4 py-2 text-stone-600">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <Badge tone={r.status}>{r.status}</Badge>
                </td>
                <td className="px-4 py-2 text-right">
                  {r.status === "pending" && (
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-xs font-medium text-emerald-700"
                        onClick={() => updateStatus(r.id, "fulfilled")}
                      >
                        Fulfil
                      </button>
                      <button
                        className="text-xs font-medium text-red-700"
                        onClick={() => updateStatus(r.id, "cancelled")}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {redemptions.length === 0 && (
          <div className="p-6">
            <EmptyState title="No redemptions yet" />
          </div>
        )}
      </div>
    </div>
  );
}
