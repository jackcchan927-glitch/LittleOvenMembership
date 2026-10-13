// A customer is in their birthday month when their birthday's calendar month matches "now".
// The stored birth year is irrelevant — only month/day repeat annually.
export function isBirthdayMonth(birthday, now = new Date()) {
  if (!birthday) return false;
  return new Date(birthday).getMonth() === now.getMonth();
}

export function generateVoucherCode() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BDAY-${random}`;
}
