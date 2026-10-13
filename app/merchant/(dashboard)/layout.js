import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentMerchant } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/merchant/dashboard", label: "Dashboard" },
  { href: "/merchant/customers", label: "Customers" },
  { href: "/merchant/merchandise", label: "Merchandise" },
  { href: "/merchant/redemptions", label: "Redemptions" },
  { href: "/merchant/events", label: "Events" },
  { href: "/merchant/promos", label: "Promos" },
  { href: "/merchant/vouchers", label: "Birthday vouchers" },
];

export default async function MerchantDashboardLayout({ children }) {
  const merchant = await getCurrentMerchant();
  if (!merchant) redirect("/merchant/login");

  return (
    <div className="flex min-h-screen bg-amber-50">
      <aside className="w-60 shrink-0 border-r border-stone-200 bg-white p-5">
        <Link href="/" className="mb-6 block">
          <Logo />
        </Link>
        <p className="mb-4 truncate text-sm font-medium text-stone-500">{merchant.name}</p>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-stone-200 pt-4">
          <LogoutButton scope="merchant" />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
