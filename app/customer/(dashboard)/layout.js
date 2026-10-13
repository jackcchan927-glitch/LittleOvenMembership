import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentCustomer } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/customer/dashboard", label: "Dashboard" },
  { href: "/customer/redeem", label: "Redeem" },
  { href: "/customer/events", label: "Events" },
  { href: "/customer/promos", label: "Promos" },
  { href: "/customer/vouchers", label: "My vouchers" },
  { href: "/customer/loved-ones", label: "Loved ones' birthdays" },
  { href: "/customer/profile", label: "Profile" },
];

export default async function CustomerDashboardLayout({ children }) {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/customer/login");

  return (
    <div className="flex min-h-screen bg-amber-50">
      <aside className="w-60 shrink-0 border-r border-stone-200 bg-white p-5">
        <Link href="/" className="mb-6 block">
          <Logo />
        </Link>
        <p className="mb-4 truncate text-sm font-medium text-stone-500">{customer.name}</p>
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
          <LogoutButton scope="customer" />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
