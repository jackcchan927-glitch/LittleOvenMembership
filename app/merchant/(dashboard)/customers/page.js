import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/ui";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Customers</h1>
      <p className="mt-1 text-sm text-stone-500">{customers.length} total</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Birthday</th>
              <th className="px-4 py-2">Points</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-2 font-medium text-stone-900">{c.name}</td>
                <td className="px-4 py-2 text-stone-600">{c.email}</td>
                <td className="px-4 py-2 text-stone-600">{c.phone || "—"}</td>
                <td className="px-4 py-2 text-stone-600">
                  {c.birthday ? new Date(c.birthday).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-2 font-medium text-amber-700">{c.points}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/merchant/customers/${c.id}`} className="text-sm font-medium text-amber-700">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <div className="p-6">
            <EmptyState title="No customers yet" body="They'll show up here once they sign up." />
          </div>
        )}
      </div>
    </div>
  );
}
