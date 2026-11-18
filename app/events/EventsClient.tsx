'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import AddToCalendar from '@/components/AddToCalendar';
import type { CalendarEvent } from '@/lib/calendar';

/* ── Types ──────────────────────────────────────────────────────────────── */
type Category = 'All' | 'Worship' | 'Community' | 'Kids & Youth' | 'Outreach' | 'Study';

interface Event {
  id: number;
  title: string;
  category: Exclude<Category, 'All'>;
  day: number;
  month: string;
  monthIndex: number; // 0-based
  year: number;
  time: string;
  location: string;
  description: string;
  image: string;
  featured?: boolean;
}

/* ── Event data ─────────────────────────────────────────────────────────── */
const EVENTS: Event[] = [
  {
    id: 1,
    title: 'Sabbath School',
    category: 'Worship',
    day: 7,
    month: 'Jun',
    monthIndex: 5,
    year: 2026,
    time: '8:45 AM – 10:15 AM',
    location: 'Main Sanctuary',
    description:
      'A time of interactive Bible study for all ages before the Divine Service. Classes available for every age group.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC6QjG-uoF5tAnJyBrZ229c47c4Jtd-Ymjp3R2vfxNnXsbQPIyZSBcSCdoAA04FbmRITLnS8-idTrEbuVv2NYw8STDOLKjI8wG7NCXt_dFx7W0Dx_G9t-Xs1QJn9onza5RgkdRvvm3tadNxGEHsAjPF4FEcIy3cn1t49tLwTiWn04H4IicCIM2SrnLi9-pC5OE2tGLxYs_BMOAhsEyug5S4zmG5m4Fp41CQoKVBK2NcblH_ci6t6NgkkAGnw9QYFVSmbVNwLDbHDzQ',
    featured: true,
  },
  {
    id: 2,
    title: 'Divine Service',
    category: 'Worship',
    day: 7,
    month: 'Jun',
    monthIndex: 5,
    year: 2026,
    time: '10:30 AM – 12:00 PM',
    location: 'Main Sanctuary',
    description:
      'Our main weekly worship service with sermon, praise, and Holy Communion on the fifth Sabbath.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDzr4tT75Cimgi2-_IWpq3xSoNGF2Xv5jOXikuYq2aTR_rJIo9zKMf_sjqCCrmexcLSRelEIspgL8Wn8QcKnM3q0SYk0-xk_mfSMjpKkO6kid3AywGcASuYqF4OLzo34MmdqNHl45iFXenK00rZQz43aPc0pZ_oBjHZzq30LHid9tJYNazvZlYtJranXrgNAfSbeSf4HX66CV9g65NuQVHMbLXcaCZjGIndq1myQYIhY2kCdVwLRg8cbIGrOjNFyGs5CLfs0osIuGo',
    featured: true,
  },
  {
    id: 3,
    title: 'Community Potluck',
    category: 'Community',
    day: 7,
    month: 'Jun',
    monthIndex: 5,
    year: 2026,
    time: '12:30 PM – 2:00 PM',
    location: 'Fellowship Hall',
    description:
      'Share a meal together after the service. Everyone is welcome — just bring a dish if you can!',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDX4PDC9zg8Hs15l8wWnBeCp_jDWgFB0YGBAhoF6JBFX7tHL07dE9D_OdT8xMhVw3yRC9hGZHy7cea-bW9RQFAcxZfHRWdS1OoFfCRfcHN7ku2t1D3fu3N6xImrc2PUcuqL3bArNQJ9ASnxUKW6oBVBc6IrlyZXcE3-giqpNVqcNgnA2OLIdHG7ejqdb5gROsNQJDxs6YjQN741FC2mZwjxDyy1l-vvbEVZbf0T8dCZQmu2foSElOL1aQkSLgV8CsUSsk4l9sQoz8w',
  },
  {
    id: 4,
    title: 'Mid-Week Bible Study',
    category: 'Study',
    day: 11,
    month: 'Jun',
    monthIndex: 5,
    year: 2026,
    time: '6:30 PM – 8:00 PM',
    location: 'Fellowship Hall',
    description:
      'Deep dive into the Book of Revelation. Coffee and light refreshments served. Come ready to learn and discuss.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBi4pu4koMgsVbz2sRTm7NZedPW2jnR1Et-eWeFsfNzC9vpgFejcVb1OqlTcFIZp5QXJtwFN7drtIe2yOXpFz0phwjUC2YvU1YwhSjT27Hk8a0uZFwjkSyxYa7eOm1KjuLaNFRNllQMW88U5vChvaSy6Ma3mjerEVV121aaRf-Mm1c1Yq-_VYqkuRkfnqFBnpter4sHTWYFuUhi6ADzmEC43n2axkU_YtPXOX0pRuFKLV6mf-o4yanpGDWKlg_RgXFTvnljxH1u_IU',
  },
  {
    id: 5,
    title: 'Youth Night',
    category: 'Kids & Youth',
    day: 13,
    month: 'Jun',
    monthIndex: 5,
    year: 2026,
    time: '7:00 PM – 9:00 PM',
    location: 'Youth Room',
    description:
      'A night of games, music, and community for teens and young adults. Come as you are!',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB4jeqr1sDzk3tp6PALjfRiGMG0vWauNwdHCmol8ZmWfLYBgJ5o_tE30Er2vqCQ42YvCXLGMKZjPThcYMjpd4ARBOutLP75GlDvq6kUy1jYsh5ZANf3JHz3jWNG-BYoxkChUp3BSRTjiLyrwlh0LNFYwbZTnuuOXkd0RnPRfts2DFu621Misc8YxKtHfUEQCRdaDlvWViAvStKCYpodhFI3MxM9xCP2LL6BYeaAb8j4TvCHXronWUt2jZB05k20VREdXfoL6uKddZI',
  },
  {
    id: 6,
    title: 'City Serve Day',
    category: 'Outreach',
    day: 21,
    month: 'Jun',
    monthIndex: 5,
    year: 2026,
    time: '9:00 AM – 1:00 PM',
    location: 'Vellore City',
    description:
      "We're heading out into the community to serve our neighbors. Join us for this monthly outreach.",
    image: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&q=80',
    featured: true,
  },
  {
    id: 7,
    title: 'Sabbath School',
    category: 'Worship',
    day: 14,
    month: 'Jun',
    monthIndex: 5,
    year: 2026,
    time: '8:45 AM – 10:15 AM',
    location: 'Main Sanctuary',
    description: 'Weekly interactive Bible study for all age groups.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC6QjG-uoF5tAnJyBrZ229c47c4Jtd-Ymjp3R2vfxNnXsbQPIyZSBcSCdoAA04FbmRITLnS8-idTrEbuVv2NYw8STDOLKjI8wG7NCXt_dFx7W0Dx_G9t-Xs1QJn9onza5RgkdRvvm3tadNxGEHsAjPF4FEcIy3cn1t49tLwTiWn04H4IicCIM2SrnLi9-pC5OE2tGLxYs_BMOAhsEyug5S4zmG5m4Fp41CQoKVBK2NcblH_ci6t6NgkkAGnw9QYFVSmbVNwLDbHDzQ',
  },
  {
    id: 8,
    title: 'Prayer Meeting',
    category: 'Worship',
    day: 18,
    month: 'Jun',
    monthIndex: 5,
    year: 2026,
    time: '7:00 PM – 8:00 PM',
    location: 'Chapel',
    description:
      'A mid-week gathering for corporate prayer and intercession. All are welcome to bring their requests.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBn_qsRAj0xLppIyYr5F-vCpCNSL9Dt59WrXQn_XtvUW2wuFUS81czcDjymI0J2z2pM5H6_2Fgcy0IycJKkSShyX0a7aCGUgp4ujnWKst8kN0AN76Z07dB-H4IdhfOilUWyrHX1LYur2INaTBrLG5EoWEJ-zSSjsQDmYEdecp6DfosAKZ6815_3GLlbPhh49pa4pF7Aj8ieM0q0dTMKvi6ljIAHI_zosp7in9f4TZoDPEnDyUWjGKD709kB8wVfEY',
  },
  {
    id: 9,
    title: "Women's Ministry Meeting",
    category: 'Community',
    day: 20,
    month: 'Jun',
    monthIndex: 5,
    year: 2026,
    time: '10:00 AM – 12:00 PM',
    location: 'Fellowship Hall',
    description: 'Monthly gathering for the women of SDAECV — devotion, sharing, and fellowship.',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  },
];

/* ── Calendar helpers ───────────────────────────────────────────────────── */
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const CATEGORY_COLORS: Record<Exclude<Category, 'All'>, string> = {
  Worship: 'bg-[#5b2d9c]/10 border-[#5b2d9c] text-[#5b2d9c]',
  Community: 'bg-[#3e8391]/10 border-[#3e8391] text-[#3e8391]',
  'Kids & Youth': 'bg-[#448d21]/10 border-[#448d21] text-[#448d21]',
  Outreach: 'bg-[#e36520]/10 border-[#e36520] text-[#e36520]',
  Study: 'bg-[#2f557f]/10 border-[#2f557f] text-[#2f557f]',
};

const CATEGORY_BADGE: Record<Exclude<Category, 'All'>, string> = {
  Worship: 'bg-[#5b2d9c]/10 text-[#5b2d9c] ring-[#5b2d9c]/20',
  Community: 'bg-[#3e8391]/10 text-[#3e8391] ring-[#3e8391]/20',
  'Kids & Youth': 'bg-[#448d21]/10 text-[#448d21] ring-[#448d21]/20',
  Outreach: 'bg-[#e36520]/10 text-[#e36520] ring-[#e36520]/20',
  Study: 'bg-[#2f557f]/10 text-[#2f557f] ring-[#2f557f]/20',
};

const FILTERS: Category[] = ['All', 'Worship', 'Community', 'Kids & Youth', 'Outreach', 'Study'];

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
};

interface SanityEvent {
  title: string;
  category: string;
  day: number;
  month: string;
  year: number;
  time: string;
  location: string;
  description: string;
  image?: any;
  featured?: boolean;
}

interface EventsClientProps {
  events?: SanityEvent[];
}

/* ── Component ──────────────────────────────────────────────────────────── */
export default function EventsClient({ events: propEvents }: EventsClientProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-based
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [activeFilter, setActiveFilter] = useState<Category>('All');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const resolvedEvents = useMemo(() => {
    if (!propEvents || propEvents.length === 0) return EVENTS;
    return propEvents.map((e, idx) => ({
      id: idx + 1,
      title: e.title,
      category: e.category as Exclude<Category, 'All'>,
      day: e.day,
      month: e.month,
      monthIndex: MONTH_MAP[e.month] ?? 0,
      year: e.year,
      time: e.time,
      location: e.location,
      description: e.description,
      image: e.image?.asset?.url || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
      featured: e.featured
    }));
  }, [propEvents]);

  /* navigate months */
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };
  const jumpToToday = () => {
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
    setSelectedDay(today.getDate());
  };

  /* filtered events */
  const filteredEvents = useMemo(
    () => resolvedEvents.filter(e => activeFilter === 'All' || e.category === activeFilter),
    [activeFilter, resolvedEvents]
  );

  /* events in current month view */
  const monthEvents = useMemo(
    () => filteredEvents.filter(e => e.monthIndex === viewMonth && e.year === viewYear),
    [filteredEvents, viewMonth, viewYear]
  );

  /* events on a given calendar day */
  const eventsForDay = (day: number) =>
    monthEvents.filter(e => e.day === day).slice(0, 2);

  /* calendar grid */
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  /* featured + upcoming for list section */
  const featuredEvents = useMemo(
    () => resolvedEvents.filter(e => e.featured).slice(0, 3),
    [resolvedEvents]
  );
  const upcomingFiltered = filteredEvents.slice(0, 6);

  /* day detail popover events */
  const dayDetailEvents = selectedDay !== null ? monthEvents.filter(e => e.day === selectedDay) : [];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[82vh] min-h-[560px] flex items-center justify-center overflow-hidden bg-[#140d23]">
        {/* background image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-35 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6QjG-uoF5tAnJyBrZ229c47c4Jtd-Ymjp3R2vfxNnXsbQPIyZSBcSCdoAA04FbmRITLnS8-idTrEbuVv2NYw8STDOLKjI8wG7NCXt_dFx7W0Dx_G9t-Xs1QJn9onza5RgkdRvvm3tadNxGEHsAjPF4FEcIy3cn1t49tLwTiWn04H4IicCIM2SrnLi9-pC5OE2tGLxYs_BMOAhsEyug5S4zmG5m4Fp41CQoKVBK2NcblH_ci6t6NgkkAGnw9QYFVSmbVNwLDbHDzQ')`,
          }}
        />
        {/* purple gradient overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#5b2d9c]/60 via-[#5b2d9c]/20 to-[#140d23]" />
        {/* radial vignette */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(11,8,20,0.70) 100%)' }}
        />

        {/* content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto pt-24">
          <span className="inline-block py-1.5 px-5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white/90 text-xs font-bold tracking-widest uppercase mb-8">
            Community Life
          </span>
          <h1
            className="text-white text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight mb-8 drop-shadow-sm"
            style={{ fontFamily: 'var(--font-newsreader)' }}
          >
            Events &{' '}
            <em className="italic text-[#e36520]">Gatherings</em>.
          </h1>
          <p className="text-slate-200 text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-14">
            Join us in fellowship and community. Find your place at SDAECV.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#events-calendar"
              className="group flex items-center justify-center gap-2 bg-[#e36520] hover:bg-[#c9571a] text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-[#e36520]/30 transition-all hover:-translate-y-1"
            >
              View Calendar
              <span className="material-symbols-outlined text-lg">calendar_month</span>
            </a>
            <a
              href="#upcoming-events"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium py-4 px-10 rounded-full transition-all hover:-translate-y-1"
            >
              Upcoming Events
              <span className="material-symbols-outlined text-lg">event</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NEXT SERVICE BANNER
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-6 -mt-6 relative z-20 mb-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl border border-[#140d23]/6 bg-white p-6 md:p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden group">
          {/* decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5b2d9c]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#5b2d9c]/10 transition-colors pointer-events-none" />

          <div className="flex items-center gap-6 relative z-10">
            <div className="h-16 w-16 rounded-2xl bg-[#5b2d9c]/10 flex items-center justify-center text-[#5b2d9c] shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-3xl">upcoming</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-700 ring-1 ring-inset ring-red-600/10 animate-pulse">
                  This Saturday
                </span>
                <span className="text-[#7a6d8e] text-sm font-medium">Sabbath Service</span>
              </div>
              <h3 className="text-[#140d23] text-2xl font-bold leading-tight tracking-tight">
                Divine Service — Weekly Worship
              </h3>
              <p className="text-[#7a6d8e] text-sm flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                Main Sanctuary · Sabbath School 8:45 AM · Service 10:30 AM
              </p>
            </div>
          </div>

          <Link
            href="/connect"
            className="flex shrink-0 items-center justify-center gap-2 rounded-full h-12 px-6 bg-[#5b2d9c] hover:bg-[#4a2480] text-white text-sm font-bold transition-all hover:shadow-lg hover:shadow-[#5b2d9c]/30 relative z-10 w-full md:w-auto"
          >
            <span className="material-symbols-outlined text-[18px]">directions</span>
            Plan a Visit
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FILTER TABS + VIEW TOGGLE
      ═══════════════════════════════════════════════════════════ */}
      <div
        id="events-calendar"
        className="sticky top-[72px] z-40 bg-[#f8f4ef]/95 backdrop-blur-md py-4 border-b border-[#140d23]/6 transition-all"
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Category filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 hide-scrollbar">
            {FILTERS.map(cat => (
              <button
                key={cat}
                id={`filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => { setActiveFilter(cat); setSelectedDay(null); }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  activeFilter === cat
                    ? 'bg-[#5b2d9c] text-white shadow-md ring-2 ring-[#5b2d9c] ring-offset-2 ring-offset-[#f8f4ef]'
                    : 'bg-white border border-[#140d23]/10 text-[#7a6d8e] hover:text-[#5b2d9c] hover:border-[#5b2d9c]/30 hover:bg-[#5b2d9c]/5 hover:-translate-y-0.5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex shrink-0 p-1 bg-white rounded-full border border-[#140d23]/10 shadow-sm">
            <button
              id="view-calendar"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-[#5b2d9c] text-white shadow-sm'
                  : 'text-[#7a6d8e] hover:text-[#140d23]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span className="hidden sm:inline">Calendar</span>
            </button>
            <button
              id="view-list"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-[#5b2d9c] text-white shadow-sm'
                  : 'text-[#7a6d8e] hover:text-[#140d23]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          CALENDAR / LIST VIEW
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-6 py-10">
        {viewMode === 'calendar' ? (
          /* ── CALENDAR ── */
          <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(20,13,35,0.08)] border border-[#140d23]/5 overflow-hidden ring-1 ring-black/5">
            {/* Calendar header */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 border-b border-[#140d23]/6 bg-white">
              <div className="flex items-center gap-6">
                <h2
                  className="text-3xl font-bold text-[#140d23] tracking-tight"
                  style={{ fontFamily: 'var(--font-newsreader)' }}
                >
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </h2>
                <div className="flex gap-2">
                  <button
                    id="prev-month"
                    onClick={prevMonth}
                    className="size-9 flex items-center justify-center rounded-full border border-[#140d23]/10 hover:border-[#5b2d9c] hover:text-[#5b2d9c] transition-all text-[#7a6d8e]"
                    aria-label="Previous month"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                  <button
                    id="next-month"
                    onClick={nextMonth}
                    className="size-9 flex items-center justify-center rounded-full border border-[#140d23]/10 hover:border-[#5b2d9c] hover:text-[#5b2d9c] transition-all text-[#7a6d8e]"
                    aria-label="Next month"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>
              </div>
              <button
                id="jump-to-today"
                onClick={jumpToToday}
                className="mt-4 sm:mt-0 text-sm font-bold text-[#5b2d9c] px-4 py-2 rounded-lg bg-[#5b2d9c]/5 hover:bg-[#5b2d9c]/10 transition-colors"
              >
                Today
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 border-b border-[#140d23]/6 bg-[#f8f4ef]/40">
              {DAY_LABELS.map(d => (
                <div key={d} className="py-4 text-center text-[11px] font-bold text-[#7a6d8e] uppercase tracking-widest">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 auto-rows-[120px] md:auto-rows-[150px] divide-x divide-y divide-[#140d23]/5 bg-white">
              {Array.from({ length: totalCells }).map((_, idx) => {
                const dayNum = idx - firstDay + 1;
                const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
                const isToday =
                  isCurrentMonth &&
                  dayNum === today.getDate() &&
                  viewMonth === today.getMonth() &&
                  viewYear === today.getFullYear();
                const isSelected = isCurrentMonth && dayNum === selectedDay;
                const dayEvts = isCurrentMonth ? eventsForDay(dayNum) : [];

                return (
                  <div
                    key={idx}
                    onClick={() => isCurrentMonth && setSelectedDay(isSelected ? null : dayNum)}
                    className={`relative p-2 md:p-3 transition-colors ${
                      !isCurrentMonth
                        ? 'bg-[#f8f4ef]/30 text-[#140d23]/20'
                        : isToday
                        ? 'bg-[#5b2d9c]/5 ring-inset ring-2 ring-[#5b2d9c]/20 cursor-pointer hover:bg-[#5b2d9c]/10'
                        : isSelected
                        ? 'bg-[#e36520]/5 ring-inset ring-2 ring-[#e36520]/20 cursor-pointer'
                        : 'hover:bg-[#f8f4ef]/70 cursor-pointer'
                    }`}
                  >
                    {isCurrentMonth ? (
                      <span
                        className={`inline-flex size-7 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                          isToday
                            ? 'bg-[#5b2d9c] text-white shadow-md scale-110'
                            : isSelected
                            ? 'bg-[#e36520] text-white shadow-md'
                            : 'text-[#140d23] hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        {dayNum}
                      </span>
                    ) : (
                      <span className="text-sm font-medium">{dayNum > 0 && dayNum <= daysInMonth + 6 ? '' : ''}</span>
                    )}

                    {dayEvts.length > 0 && (
                      <div className="mt-1 flex flex-col gap-1">
                        {dayEvts.map(evt => (
                          <div
                            key={evt.id}
                            className={`border-l-2 text-[10px] px-1.5 py-0.5 rounded-r-sm truncate font-semibold hover:opacity-80 transition-opacity ${CATEGORY_COLORS[evt.category]}`}
                          >
                            {evt.time.split(' ')[0]} {evt.title}
                          </div>
                        ))}
                        {monthEvents.filter(e => e.day === dayNum).length > 2 && (
                          <span className="text-[9px] text-[#7a6d8e] font-bold px-1">
                            +{monthEvents.filter(e => e.day === dayNum).length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected day detail panel */}
            {selectedDay !== null && dayDetailEvents.length > 0 && (
              <div className="border-t border-[#140d23]/6 px-8 py-6 bg-[#f8f4ef]/40 animate-fade-in-up">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#7a6d8e] mb-4">
                  {MONTH_NAMES[viewMonth]} {selectedDay} — {dayDetailEvents.length} event{dayDetailEvents.length > 1 ? 's' : ''}
                </h3>
                <div className="flex flex-col gap-3">
                  {dayDetailEvents.map(evt => (
                    <div
                      key={evt.id}
                      className="flex items-start gap-4 bg-white rounded-2xl border border-[#140d23]/5 p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${CATEGORY_COLORS[evt.category]} border`}>
                        <span className="material-symbols-outlined text-sm">
                          {evt.category === 'Worship' ? 'auto_stories' : evt.category === 'Community' ? 'groups' : evt.category === 'Kids & Youth' ? 'child_care' : evt.category === 'Outreach' ? 'volunteer_activism' : 'menu_book'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${CATEGORY_BADGE[evt.category]}`}>
                            {evt.category.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-bold text-[#140d23] text-base leading-tight">{evt.title}</h4>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-[#7a6d8e] font-medium">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-[#5b2d9c]">schedule</span>
                            {evt.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-[#5b2d9c]">location_on</span>
                            {evt.location}
                          </span>
                        </div>
                        <p className="text-xs text-[#7a6d8e] mt-1.5 leading-relaxed line-clamp-2">{evt.description}</p>
                        <div className="mt-3">
                          <AddToCalendar
                            event={{
                              title: evt.title,
                              description: evt.description,
                              location: evt.location,
                              monthIndex: evt.monthIndex,
                              day: evt.day,
                              year: evt.year,
                              time: evt.time,
                            } as CalendarEvent}
                            variant="dark"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedDay !== null && dayDetailEvents.length === 0 && (
              <div className="border-t border-[#140d23]/6 px-8 py-6 text-center text-[#7a6d8e] text-sm animate-fade-in bg-[#f8f4ef]/40">
                No events on {MONTH_NAMES[viewMonth]} {selectedDay}.
              </div>
            )}
          </div>
        ) : (
          /* ── LIST VIEW ── */
          <div className="flex flex-col gap-4 animate-fade-in-up">
            {upcomingFiltered.length === 0 ? (
              <div className="text-center py-20 text-[#7a6d8e]">No events found for this filter.</div>
            ) : (
              upcomingFiltered.map(evt => (
                <div
                  key={evt.id}
                  className="group flex flex-col md:flex-row items-stretch bg-white rounded-2xl border border-[#140d23]/5 shadow-[0_4px_20px_-4px_rgba(20,13,35,0.06)] overflow-hidden hover:shadow-[0_12px_40px_-8px_rgba(91,45,156,0.12)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* image thumbnail */}
                  <div
                    className="w-full md:w-56 h-48 md:h-auto bg-cover bg-center shrink-0 relative overflow-hidden"
                    style={{ backgroundImage: `url("${evt.image}")` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl text-center shadow-md border border-white/20">
                      <div className="text-[9px] font-black uppercase tracking-wider text-[#7a6d8e]">{evt.month}</div>
                      <div className="text-xl font-black text-[#140d23] leading-none">{evt.day}</div>
                    </div>
                  </div>

                  {/* content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${CATEGORY_BADGE[evt.category]}`}>
                          {evt.category.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-[#140d23] text-xl font-bold leading-tight group-hover:text-[#5b2d9c] transition-colors">
                        {evt.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-[#7a6d8e] font-medium">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#5b2d9c]">schedule</span>
                          {evt.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#5b2d9c]">location_on</span>
                          {evt.location}
                        </span>
                      </div>
                      <p className="text-[#7a6d8e] text-sm leading-relaxed mt-1">{evt.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#140d23]/5 flex-wrap gap-3">
                      <AddToCalendar
                        event={{
                          title: evt.title,
                          description: evt.description,
                          location: evt.location,
                          monthIndex: evt.monthIndex,
                          day: evt.day,
                          year: evt.year,
                          time: evt.time,
                        } as CalendarEvent}
                        variant="dark"
                      />
                      <Link
                        href="/connect"
                        className="flex items-center gap-1.5 text-sm font-bold text-[#5b2d9c] hover:text-[#e36520] transition-colors"
                      >
                        Register / Learn More
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURED UPCOMING EVENTS — bento card layout
      ═══════════════════════════════════════════════════════════ */}
      <section id="upcoming-events" className="py-32 md:py-44 bg-[#140d23] overflow-hidden relative">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#5b2d9c]/[0.07] blur-[140px]" />
        </div>

        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20 relative">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-[#e36520]" />
                <span className="text-[#e36520] text-[10px] font-black uppercase tracking-[0.4em]">
                  What&apos;s On
                </span>
              </div>
              <h2
                className="text-white leading-[0.85] tracking-[-0.04em]"
                style={{
                  fontFamily: 'var(--font-newsreader), serif',
                  fontSize: 'clamp(3rem, 7vw, 7rem)',
                  fontWeight: 400,
                }}
              >
                Featured<br />
                <span className="text-white/25 font-light italic">Gatherings</span>
              </h2>
            </div>
            <button
              onClick={() => setViewMode('list')}
              className="group inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-all duration-300 self-end mb-3 hover:gap-3"
            >
              View All Events
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          {/* Bento grid */}
          <div className="flex flex-col lg:flex-row gap-5" style={{ minHeight: '680px' }}>
            {/* Featured left tall card */}
            {featuredEvents[0] && (
              <div
                className="group relative overflow-hidden rounded-[1.75rem] cursor-pointer lg:w-[30%] flex-shrink-0"
                style={{ minHeight: '420px' }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  style={{ backgroundImage: `url("${featuredEvents[0].image}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0814] via-[#140d23]/40 to-transparent" />
                <div className="absolute inset-0 bg-[#5b2d9c]/0 group-hover:bg-[#5b2d9c]/15 transition-colors duration-700" />
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#140d23]/70 to-transparent" />

                {/* date badge */}
                <div className="absolute top-6 left-6 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 text-center min-w-[56px]">
                  <p className="text-[#e36520] text-[9px] font-black uppercase tracking-widest leading-none">{featuredEvents[0].month}</p>
                  <p className="text-white text-[1.75rem] font-bold leading-none mt-1.5 tabular-nums">{featuredEvents[0].day}</p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.35em] mb-3">
                    {featuredEvents[0].category}
                  </p>
                  <h3
                    className="text-white font-medium leading-tight mb-3"
                    style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: '2.2rem' }}
                  >
                    {featuredEvents[0].title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/45 mb-4">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    <span>{featuredEvents[0].time}</span>
                  </div>
                  <p className="text-[13px] text-white/50 leading-relaxed mb-6">
                    {featuredEvents[0].description}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-white/0 group-hover:text-[#e36520] translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </div>
            )}

            {/* Right grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5" style={{ gridTemplateRows: 'repeat(2, 1fr)' }}>
              {/* Wide top card */}
              {featuredEvents[1] && (
                <div
                  className="group relative overflow-hidden rounded-[1.75rem] cursor-pointer sm:col-span-2"
                  style={{ minHeight: '220px' }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url("${featuredEvents[1].image}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0814] via-[#140d23]/45 to-transparent" />
                  <div className="absolute inset-0 bg-[#5b2d9c]/0 group-hover:bg-[#5b2d9c]/15 transition-colors duration-700" />
                  <div className="absolute top-5 left-5 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl px-3.5 py-2.5 text-center min-w-[48px]">
                    <p className="text-[#e36520] text-[8px] font-black uppercase tracking-widest leading-none">{featuredEvents[1].month}</p>
                    <p className="text-white text-[1.4rem] font-bold leading-none mt-1 tabular-nums">{featuredEvents[1].day}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[#e36520] text-[8px] font-black uppercase tracking-[0.35em] mb-2">{featuredEvents[1].category}</p>
                    <h3
                      className="text-white font-medium leading-tight mb-2.5"
                      style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: '1.3rem' }}
                    >
                      {featuredEvents[1].title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      <span>{featuredEvents[1].time}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/0 group-hover:text-[#e36520] translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      Learn More <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Narrow tall right spanning 2 rows */}
              {featuredEvents[2] && (
                <div
                  className="group relative overflow-hidden rounded-[1.75rem] cursor-pointer sm:row-span-2"
                  style={{ minHeight: '220px' }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url("${featuredEvents[2].image}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0814] via-[#140d23]/45 to-transparent" />
                  <div className="absolute inset-0 bg-[#5b2d9c]/0 group-hover:bg-[#5b2d9c]/15 transition-colors duration-700" />
                  <div className="absolute top-5 left-5 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl px-3.5 py-2.5 text-center min-w-[48px]">
                    <p className="text-[#e36520] text-[8px] font-black uppercase tracking-widest leading-none">{featuredEvents[2].month}</p>
                    <p className="text-white text-[1.4rem] font-bold leading-none mt-1 tabular-nums">{featuredEvents[2].day}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[#e36520] text-[8px] font-black uppercase tracking-[0.35em] mb-2">{featuredEvents[2].category}</p>
                    <h3
                      className="text-white font-medium leading-tight mb-2.5"
                      style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: '1.3rem' }}
                    >
                      {featuredEvents[2].title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      <span>{featuredEvents[2].time}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/0 group-hover:text-[#e36520] translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      Learn More <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Wide bottom card — weekly service highlight */}
              <div
                className="group relative overflow-hidden rounded-[1.75rem] cursor-pointer sm:col-span-2 bg-gradient-to-br from-[#5b2d9c] to-[#3a1a6b] flex flex-col justify-between p-6 md:p-8"
                style={{ minHeight: '220px' }}
              >
                <div className="absolute inset-0 bg-[#e36520]/5 group-hover:bg-[#e36520]/10 transition-colors duration-700 pointer-events-none" />
                <div>
                  <p className="text-[#e36520] text-[8px] font-black uppercase tracking-[0.35em] mb-3">Weekly · Every Saturday</p>
                  <h3
                    className="text-white font-medium leading-tight"
                    style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: '1.5rem' }}
                  >
                    Sabbath Services
                  </h3>
                  <p className="text-white/50 text-sm mt-2 leading-relaxed">
                    Sabbath School 8:45 AM · Divine Service 10:30 AM
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                    <span className="material-symbols-outlined text-[12px]">location_on</span>
                    <span>Main Sanctuary, SDAECV Vellore</span>
                  </div>
                  <Link
                    href="/connect"
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#e36520] hover:gap-2 transition-all duration-300"
                  >
                    Plan Visit <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA BOTTOM
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-32 px-6 bg-[#f8f4ef] relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#5b2d9c]/4 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#e36520]/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-5xl mx-auto z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white rounded-3xl border border-[#140d23]/5 p-10 md:p-14 shadow-[0_20px_60px_-15px_rgba(20,13,35,0.10)]">
            <div className="flex flex-col gap-4 max-w-lg">
              <span className="text-[#e36520] font-bold tracking-widest uppercase text-xs">You&apos;re Welcome Here</span>
              <h2
                className="text-4xl md:text-5xl text-[#140d23] leading-tight tracking-tight"
                style={{ fontFamily: 'var(--font-newsreader)' }}
              >
                Join us this{' '}
                <em className="italic text-[#5b2d9c]">Saturday</em>.
              </h2>
              <p className="text-[#7a6d8e] text-lg leading-relaxed">
                Every soul is welcome. Worship with us at the Seventh-day Adventist English Church
                in Vellore — a community built on grace, fellowship, and service.
              </p>
            </div>
            <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
              <Link
                href="/connect"
                className="flex items-center justify-center gap-2 bg-[#5b2d9c] text-white hover:bg-[#4a2480] font-bold py-4 px-10 rounded-full shadow-lg shadow-[#5b2d9c]/30 transition-all hover:-translate-y-1 hover:scale-105"
              >
                <span className="material-symbols-outlined">favorite</span>
                Plan a Visit
              </Link>
              <Link
                href="/connect"
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-[#140d23]/10 text-[#140d23] hover:border-[#5b2d9c] hover:text-[#5b2d9c] font-bold py-4 px-10 rounded-full transition-all hover:-translate-y-1"
              >
                <span className="material-symbols-outlined">mail</span>
                Send a Prayer Request
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
