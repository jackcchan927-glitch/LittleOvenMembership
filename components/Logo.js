export function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-bold text-stone-900 ${className}`}>
      <span aria-hidden>🥐</span>
      Crumb &amp; Co. Rewards
    </span>
  );
}
