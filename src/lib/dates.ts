const short = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const long = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
const full = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export const formatShort = (date: Date): string => short.format(date);
export const formatLong = (date: Date): string => long.format(date);
export const formatFull = (date: Date): string => full.format(date);
