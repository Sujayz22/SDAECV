export interface ServiceTimeSlot {
  label: string;
  time: string;
  detail?: string;
  day?: string;
  icon?: string;
}

export const DEFAULT_SERVICE_TIMES: ServiceTimeSlot[] = [
  { label: 'AY Service', time: 'Friday · 7:30 PM', detail: 'Vibrant youth fellowship and spiritual growth.' },
  { label: 'Sabbath School', time: 'Saturday · 8:45 AM', detail: 'Bible study for all age groups. Interactive discussions.' },
  { label: 'Divine Service', time: 'Saturday · 10:30 AM', detail: 'Our main worship service. Music, Scripture, and sermon.' },
  { label: 'Singing Band/Outreach', time: 'Saturday · 3:30 PM', detail: 'Elevating worship through song and active outreach.' },
  { label: 'Vespers', time: 'Saturday · 5:00 PM', detail: 'Closing the Sabbath with songs and devotion.' },
  { label: 'Prayer Meeting', time: 'Wednesday · 7:00 PM', detail: 'Midweek prayer and intercessory chain.' },
];

/**
 * Parses a slot's time string (e.g. "Saturday · 8:45 AM" or "8:45 AM (Saturday)" or "7:30 PM")
 * into { day, timeOnly, fullTime }
 */
export function parseServiceTime(slot?: ServiceTimeSlot | null): { day: string; timeOnly: string; fullTime: string } {
  if (!slot || !slot.time) {
    return { day: 'Saturday', timeOnly: '', fullTime: '' };
  }

  const raw = slot.time.trim();
  // Format: "Saturday · 8:45 AM"
  if (raw.includes('·')) {
    const [d, t] = raw.split('·').map(s => s.trim());
    return { day: d || 'Saturday', timeOnly: t || raw, fullTime: raw };
  }

  // Format: "8:45 AM (Saturday)"
  const parenMatch = raw.match(/^(.*?)\s*\((.*?)\)$/);
  if (parenMatch) {
    return { day: parenMatch[2].trim(), timeOnly: parenMatch[1].trim(), fullTime: raw };
  }

  // Format: "Friday 7:30 PM"
  const spaceMatch = raw.match(/^(Friday|Saturday|Sunday|Wednesday|Thursday|Monday|Tuesday)\s+(.*)$/i);
  if (spaceMatch) {
    return { day: spaceMatch[1].trim(), timeOnly: spaceMatch[2].trim(), fullTime: raw };
  }

  return { day: 'Saturday', timeOnly: raw, fullTime: raw };
}

/**
 * Finds a service slot matching any candidate keywords (case-insensitive)
 */
export function findServiceSlot(slots: ServiceTimeSlot[], keywords: string[]): ServiceTimeSlot | undefined {
  if (!slots || slots.length === 0) return undefined;
  for (const kw of keywords) {
    const lower = kw.toLowerCase();
    const found = slots.find(s => s.label.toLowerCase().includes(lower));
    if (found) return found;
  }
  return undefined;
}

/**
 * Returns structured summary timings commonly needed across headers, footers, and cards
 */
export function getTimingsSummary(slots: ServiceTimeSlot[] = []) {
  const effectiveSlots = slots && slots.length > 0 ? slots : DEFAULT_SERVICE_TIMES;

  const aySlot = findServiceSlot(effectiveSlots, ['ay service', 'ay', 'youth']) || DEFAULT_SERVICE_TIMES[0];
  const ssSlot = findServiceSlot(effectiveSlots, ['sabbath school', 'school']) || DEFAULT_SERVICE_TIMES[1];
  const dsSlot = findServiceSlot(effectiveSlots, ['divine service', 'divine worship', 'divine', 'worship']) || DEFAULT_SERVICE_TIMES[2];
  const singingSlot = findServiceSlot(effectiveSlots, ['singing band', 'singing', 'outreach']) || DEFAULT_SERVICE_TIMES[3];
  const vespersSlot = findServiceSlot(effectiveSlots, ['vespers']) || DEFAULT_SERVICE_TIMES[4];
  const prayerSlot = findServiceSlot(effectiveSlots, ['prayer meeting', 'prayer']) || DEFAULT_SERVICE_TIMES[5];

  const ay = parseServiceTime(aySlot);
  const ss = parseServiceTime(ssSlot);
  const ds = parseServiceTime(dsSlot);
  const singing = parseServiceTime(singingSlot);
  const vespers = parseServiceTime(vespersSlot);
  const prayer = parseServiceTime(prayerSlot);

  // Hero string e.g. "Friday 7:30 PM · Saturday 8:45 AM"
  const heroString = `${ay.day} ${ay.timeOnly} · ${ss.day} ${ss.timeOnly}`;

  return {
    slots: effectiveSlots,
    ay: { slot: aySlot, ...ay },
    sabbathSchool: { slot: ssSlot, ...ss },
    divineService: { slot: dsSlot, ...ds },
    singingBand: { slot: singingSlot, ...singing },
    vespers: { slot: vespersSlot, ...vespers },
    prayerMeeting: { slot: prayerSlot, ...prayer },
    heroString,
  };
}
