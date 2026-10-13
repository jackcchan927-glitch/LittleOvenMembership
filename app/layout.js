import "./globals.css";

export const metadata = {
  title: "Crumb & Co. Rewards",
  description:
    "Crumb & Co.'s customer rewards hub — check your points, redeem merchandise, and see the latest events and promos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-amber-50 text-stone-900">{children}</body>
    </html>
  );
}
