/** Formats an ISO date string (YYYY-MM-DD) as e.g. "Thu, 28 Aug" — matches the reference's payout-date style. */
export function formatShortDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return date.toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}
