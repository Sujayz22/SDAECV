/**
 * Recurrence Expansion Utility for Events
 * -----------------------------------------
 * Automatically generates future occurrences for recurring events (weekly, bi-weekly, monthly)
 * without requiring content managers to duplicate or manually re-enter each event.
 */

export interface RawEvent {
  _id?: string;
  id?: number | string;
  title: string;
  category: string;
  eventType?: string; // 'one_time' | 'recurring_weekly' | 'recurring_biweekly' | 'recurring_monthly'
  recurrenceRule?: string;
  date?: string; // 'YYYY-MM-DD'
  day: number;
  month: string; // 3-letter e.g. 'Nov'
  year: number;
  time: string;
  location?: string;
  description: string;
  image?: any;
  featured?: boolean;
}

export interface ExpandedEvent {
  id: string | number;
  originalId?: string;
  title: string;
  category: string;
  eventType: string;
  recurrenceRule?: string;
  day: number;
  month: string;
  monthIndex: number;
  year: number;
  dateStr: string; // 'YYYY-MM-DD'
  time: string;
  location: string;
  description: string;
  image: string;
  featured?: boolean;
  eventDate: Date;
}

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
};

/**
 * Expand a list of events so that recurring events automatically appear on all their future dates
 * within a given window (default: next 12 weeks / ~3 months).
 */
export function expandRecurringEvents(
  events: RawEvent[],
  options?: {
    weeksAhead?: number;
    referenceDate?: Date;
  }
): ExpandedEvent[] {
  const weeksAhead = options?.weeksAhead ?? 12;
  const now = options?.referenceDate ? new Date(options.referenceDate) : new Date();
  now.setHours(0, 0, 0, 0);

  const horizon = new Date(now);
  horizon.setDate(horizon.getDate() + weeksAhead * 7);

  const results: ExpandedEvent[] = [];

  for (let idx = 0; idx < events.length; idx++) {
    const e = events[idx];
    const monthIndex = MONTH_MAP[e.month] ?? 0;
    const year = e.year || now.getFullYear();
    const day = e.day || 1;

    // Determine initial base date
    let baseDate: Date;
    if (e.date) {
      const [y, m, d] = e.date.split('-').map(Number);
      baseDate = new Date(y, m - 1, d, 23, 59, 59);
    } else {
      baseDate = new Date(year, monthIndex, day, 23, 59, 59);
    }

    const imageUrl = e.image?.asset?.url || (typeof e.image === 'string' ? e.image : '/church.jpg');
    const location = e.location || 'Church Campus';
    const eventType = e.eventType || 'one_time';

    const createOccurrence = (occurrenceDate: Date, occIdx: number): ExpandedEvent => {
      const occMonthIndex = occurrenceDate.getMonth();
      const occMonth = MONTH_NAMES_SHORT[occMonthIndex];
      const occDay = occurrenceDate.getDate();
      const occYear = occurrenceDate.getFullYear();
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${occYear}-${pad(occMonthIndex + 1)}-${pad(occDay)}`;

      return {
        id: `${e._id || e.id || idx}_occ_${occIdx}_${dateStr}`,
        originalId: e._id ? String(e._id) : undefined,
        title: e.title,
        category: e.category,
        eventType,
        recurrenceRule: e.recurrenceRule,
        day: occDay,
        month: occMonth,
        monthIndex: occMonthIndex,
        year: occYear,
        dateStr,
        time: e.time,
        location,
        description: e.description,
        image: imageUrl,
        featured: e.featured,
        eventDate: new Date(occYear, occMonthIndex, occDay, 23, 59, 59),
      };
    };

    if (eventType === 'one_time') {
      // One-time event: include if it's upcoming (today or future)
      if (baseDate.getTime() >= now.getTime()) {
        results.push(createOccurrence(baseDate, 0));
      }
    } else if (eventType === 'recurring_weekly') {
      // Weekly: generate next occurrences every 7 days from base date up to horizon
      const current = new Date(baseDate);
      let occ = 0;
      // Fast-forward to the first upcoming occurrence if baseDate is in the past
      while (current.getTime() < now.getTime()) {
        current.setDate(current.getDate() + 7);
      }
      while (current.getTime() <= horizon.getTime() && occ < 20) {
        results.push(createOccurrence(new Date(current), occ));
        current.setDate(current.getDate() + 7);
        occ++;
      }
    } else if (eventType === 'recurring_biweekly') {
      // Bi-weekly: every 14 days
      const current = new Date(baseDate);
      let occ = 0;
      while (current.getTime() < now.getTime()) {
        current.setDate(current.getDate() + 14);
      }
      while (current.getTime() <= horizon.getTime() && occ < 10) {
        results.push(createOccurrence(new Date(current), occ));
        current.setDate(current.getDate() + 14);
        occ++;
      }
    } else if (eventType === 'recurring_monthly') {
      // Monthly: same day of next months
      const current = new Date(baseDate);
      let occ = 0;
      while (current.getTime() < now.getTime()) {
        current.setMonth(current.getMonth() + 1);
      }
      while (current.getTime() <= horizon.getTime() && occ < 6) {
        results.push(createOccurrence(new Date(current), occ));
        current.setMonth(current.getMonth() + 1);
        occ++;
      }
    }
  }

  // Sort all expanded occurrences chronologically by date
  return results.sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
}
