export function Button({ as: Tag = "button", className = "", variant = "primary", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-amber-600 text-white hover:bg-amber-700",
    secondary: "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-stone-600 hover:bg-stone-100",
  };
  return <Tag className={`${base} ${variants[variant] || ""} ${className}`} {...props} />;
}

export function Input({ label, className = "", ...props }) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1 block font-medium text-stone-700">{label}</span>}
      <input
        className={`w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({ label, className = "", children, ...props }) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1 block font-medium text-stone-700">{label}</span>}
      <select
        className={`w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Textarea({ label, className = "", ...props }) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1 block font-medium text-stone-700">{label}</span>}
      <textarea
        className={`w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 ${className}`}
        {...props}
      />
    </label>
  );
}

export function Card({ className = "", children }) {
  return (
    <div className={`rounded-xl border border-stone-200 bg-white p-5 ${className}`}>
      {children}
    </div>
  );
}

const BADGE_COLORS = {
  active: "bg-emerald-100 text-emerald-700",
  upcoming: "bg-blue-100 text-blue-700",
  past: "bg-stone-100 text-stone-500",
  pending: "bg-amber-100 text-amber-700",
  fulfilled: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  redeemed: "bg-stone-100 text-stone-500",
};

export function Badge({ tone = "active", children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        BADGE_COLORS[tone] || BADGE_COLORS.active
      }`}
    >
      {children}
    </span>
  );
}

export function StatTile({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="text-sm text-stone-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-stone-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-stone-400">{hint}</div>}
    </div>
  );
}

export function EmptyState({ title, body }) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 p-10 text-center">
      <p className="font-medium text-stone-700">{title}</p>
      {body && <p className="mt-1 text-sm text-stone-500">{body}</p>}
    </div>
  );
}
