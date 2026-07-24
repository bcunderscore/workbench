// Frontmatter dates parse as UTC midnight; format in UTC too, or every date
// renders one day early in western timezones.
const short = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});
const long = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const full = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatShort = (date: Date): string => short.format(date);
export const formatLong = (date: Date): string => long.format(date);
export const formatFull = (date: Date): string => full.format(date);
