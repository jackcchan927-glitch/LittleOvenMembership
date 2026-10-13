// Status of an Event or Promo is derived from its dates at read time, not stored.
export function statusOf({ startDate, endDate }, now = new Date()) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  if (now < start) return "upcoming";
  if (end && now > end) return "past";
  return "active";
}
