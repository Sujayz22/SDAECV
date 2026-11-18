/**
 * Calendar Integration Utilities
 * ---------------------------------
 * Generates Google Calendar and Apple Calendar (.ics) links for SDAECV events.
 * All event times in the data are in Indian Standard Time (IST, UTC+5:30).
 * We convert to UTC before building the calendar URLs.
 */

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  /** 0-based month index (Jan = 0) */
  monthIndex: number;
  day: number;
  year: number;
  /** Time string like "9:15 AM – 10:30 AM" or "7:00 PM – 9:00 PM" */
  time: string;
}

/** Parse a 12-hour time string like "9:15 AM" or "7 PM" → { hours, minutes } (24-hr values) */
function parse12h(t: string): { h: number; m: number } {
  const parts = t.trim().split(/\s+/);
  const timePart = parts[0] || '12:00';
  const period = (parts[1] || 'AM').toUpperCase();
  
  const [hStr, mStr] = timePart.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr ? parseInt(mStr, 10) : 0;
  
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return { h, m };
}

/**
 * Convert a local IST date/time to UTC and return a Date object.
 * IST = UTC + 5:30, so UTC = IST − 5 h 30 min.
 */
function istToUtc(year: number, month: number, day: number, h: number, m: number): Date {
  // Build the date in UTC, subtracting the IST offset
  return new Date(Date.UTC(year, month, day, h - 5, m - 30));
}

/** Format a Date as a Google Calendar / .ics timestamp: YYYYMMDDTHHmmssZ */
function toStamp(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/**
 * Parse the time range string from an event and return UTC start + end Date objects.
 * Falls back to a 1-hour block from the start time when no end is present.
 */
function parseDates(ev: CalendarEvent): { start: Date; end: Date } {
  // Clean "Friday · 7:00 PM" -> "7:00 PM" by stripping day name prefixes
  const cleanTime = ev.time.replace(/^[A-Za-z]+\s*·\s*/, '').trim();
  
  // Split start/end using either en-dash (–), em-dash (—), or normal hyphen (-)
  const parts = cleanTime.split(/[–—-]/).map(s => s.trim());
  const startRaw = parts[0];
  const endRaw = parts[1] || null;

  const { h: sh, m: sm } = parse12h(startRaw);
  const start = istToUtc(ev.year, ev.monthIndex, ev.day, sh, sm);

  let end: Date;
  if (endRaw) {
    const { h: eh, m: em } = parse12h(endRaw);
    end = istToUtc(ev.year, ev.monthIndex, ev.day, eh, em);
  } else {
    end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour fallback
  }
  return { start, end };
}

/** Generate a Google Calendar "Add event" URL for the given event. */
export function googleCalendarUrl(ev: CalendarEvent): string {
  const { start, end } = parseDates(ev);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title,
    dates: `${toStamp(start)}/${toStamp(end)}`,
    details: ev.description,
    location: `${ev.location}, SDAECV Vellore, Tamil Nadu, India`,
    ctz: 'Asia/Kolkata',
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

/** Generate a data URI for an .ics file (Apple/Outlook calendar import). */
export function icsDataUri(ev: CalendarEvent): string {
  const { start, end } = parseDates(ev);
  const now = toStamp(new Date());
  const uid = `${now}-${ev.title.replace(/\s+/g, '-').toLowerCase()}@sdaecv.in`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SDAECV//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${toStamp(start)}`,
    `DTEND:${toStamp(end)}`,
    `SUMMARY:${ev.title}`,
    `DESCRIPTION:${ev.description.replace(/,/g, '\\,')}`,
    `LOCATION:${ev.location}\\, SDAECV Vellore\\, Tamil Nadu\\, India`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
