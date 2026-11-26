'use client';

import { useMemo } from 'react';
import AddToCalendar from './AddToCalendar';
import ReminderButton from './ReminderButton';
import { expandRecurringEvents, RawEvent } from '@/lib/eventRecurrence';

interface SanityEvent extends RawEvent {
    _id: string;
}

interface EventsSectionProps {
    events?: SanityEvent[];
}

const FALLBACK_EVENTS: RawEvent[] = [
    {
        title: "Youth Night",
        category: "Youth",
        eventType: "recurring_weekly",
        recurrenceRule: "Every Friday",
        date: "2026-11-27",
        day: 27,
        month: "Nov",
        year: 2026,
        time: "Friday · 7:00 PM",
        description: "A night of games, music, and community for high school students.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4jeqr1sDzk3tp6PALjfRiGMG0vWauNwdHCmol8ZmWfLYBgJ5o_tE30Er2vqCQ42YvCXLGMKZjPThcYMjpd4ARBOutLP75GlDvq6kUy1jYsh5ZANf3JHz3jWNG-BYoxkChUp3BSRTjiLyrwlh0LNFYwbZTnuuOXkd0RnPRfts2DFu621Misc8YxKtHfUEQCRdaDlvWViAvStKCYpodhFI3MxM9xCP2LL6BYeaAb8j4TvCHXronWUt2jZB05k20VREdXfoL6uKddZI"
    },
    {
        title: "Community Potluck",
        category: "Community",
        eventType: "recurring_monthly",
        recurrenceRule: "Last Sabbath",
        date: "2026-11-28",
        day: 28,
        month: "Nov",
        year: 2026,
        time: "Sunday · 12:30 PM",
        description: "Join us after the second service for food and fellowship.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDX4PDC9zg8Hs15l8wWnBeCp_jDWgFB0YGBAhoF6JBFX7tHL07dE9D_OdT8xMhVw3yRC9hGZHy7cea-bW9RQFAcxZfHRWdS1OoFfCRfcHN7ku2t1D3fu3N6xImrc2PUcuqL3bArNQJ9ASnxUKW6oBVBc6IrlyZXcE3-giqpNVqcNgnA2OLIdHG7ejqdb5gROsNQJDxs6YjQN741FC2mZwjxDyy1l-vvbEVZbf0T8dCZQmu2foSElOL1aQkSLgV8CsUSsk4l9sQoz8w"
    },
    {
        title: "City Serve Day",
        category: "Outreach",
        eventType: "recurring_monthly",
        recurrenceRule: "2nd Saturday",
        date: "2026-12-12",
        day: 12,
        month: "Dec",
        year: 2026,
        time: "Saturday · 9:00 AM",
        description: "We're heading out into the city to serve our neighbors.",
        image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&q=80"
    },
    {
        title: "Men's Breakfast",
        category: "Men",
        eventType: "recurring_monthly",
        recurrenceRule: "Monthly",
        date: "2026-12-16",
        day: 16,
        month: "Dec",
        year: 2026,
        time: "Wednesday · 7:00 AM",
        description: "A time for men to gather, eat, and encourage one another.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn_qsRAj0xLppIyYr5F-vCpCNSL9Dt59WrXQn_XtvUW2wuFUS81czcDjymI0J2z2pM5H6_2Fgcy0IycJKkSShyX0a7aCGUgp4ujnWKst8kN0AN76Z07dB-H4IdhfOilUWyrHX1LYur2INaTBrLG5EoWEK-oRTAKUnNWEaGzvSSjsQDmYEdecp6DfosAKZ6815_3GLlbPhh49pa4pF7Aj8ieM0q0dTMKvi6ljIAHI_zosp7in9f4TZoDPEnDyUWjGKD709kB8wVfEY"
    }
];

export default function EventsSection({ events: propEvents }: EventsSectionProps) {
    const events = useMemo(() => {
        const rawList: RawEvent[] = propEvents && propEvents.length > 0 ? propEvents : FALLBACK_EVENTS;
        const expanded = expandRecurringEvents(rawList, { weeksAhead: 12 });
        return expanded.map(e => ({
            ...e,
            date: String(e.day),
        }));
    }, [propEvents]);

    if (!events || events.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-[#140d23] overflow-hidden relative">

            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#5b2d9c]/[0.07] blur-[120px]" />
            </div>

            <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20 relative">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 md:mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-px w-8 bg-[#e36520]" />
                            <span className="text-[#e36520] text-[10px] font-black uppercase tracking-[0.4em] font-body">What&apos;s On</span>
                        </div>
                        <h2
                            className="text-white leading-[0.9] tracking-[-0.03em]"
                            style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 400 }}
                        >
                            Upcoming <span className="text-white/25 font-light italic">Events</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-3 self-start sm:self-end">
                        <a
                            href="/events"
                            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white/50 hover:text-white font-body transition-all duration-300 hover:gap-3"
                        >
                            View Calendar
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </a>
                    </div>
                </div>

                {/* Bento layout: featured card left + 3-card grid right */}
                <div className="flex flex-col lg:flex-row gap-5">

                    {/* Featured card — left column */}
                    {events[0] && (
                        <div className="group relative overflow-hidden rounded-[1.5rem] lg:w-[32%] flex-shrink-0 flex flex-col justify-between p-6 sm:p-7 min-h-[380px] sm:min-h-[420px] lg:min-h-0">
                            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" style={{ backgroundImage: `url("${events[0].image}")` }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0814] via-[#140d23]/50 to-transparent" />
                            <div className="absolute inset-0 bg-[#5b2d9c]/0 group-hover:bg-[#5b2d9c]/15 transition-colors duration-700" />
                            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#140d23]/70 to-transparent" />

                            <div className="relative z-10 self-start bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 text-center min-w-[48px]">
                                <p className="text-[#e36520] text-[8px] font-black uppercase tracking-widest leading-none font-body">{events[0].month}</p>
                                <p className="text-white text-[1.4rem] font-bold leading-none mt-1 font-display tabular-nums">{events[0].date}</p>
                            </div>

                            <div className="relative z-10 pt-12">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <p className="text-[#e36520] text-[8px] font-black uppercase tracking-[0.35em] font-body">{events[0].category}</p>
                                    {events[0].eventType && events[0].eventType !== 'one_time' && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-bold text-white/80 border border-white/15 uppercase tracking-wider">
                                            <span className="material-symbols-outlined text-[10px]">repeat</span>
                                            {events[0].recurrenceRule || 'Recurring'}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-white font-medium leading-tight mb-2 text-xl sm:text-2xl" style={{ fontFamily: 'var(--font-newsreader), serif' }}>
                                    {events[0].title}
                                </h3>
                                <div className="flex items-center gap-1.5 text-[11px] text-white/50 mb-3 font-body">
                                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                                    <span>{events[0].time}</span>
                                </div>
                                <p className="text-[12px] text-white/50 font-body leading-relaxed mb-5 line-clamp-2">{events[0].description}</p>
                                <div className="flex items-center gap-3">
                                    <AddToCalendar
                                        event={{
                                            title: events[0].title,
                                            description: events[0].description,
                                            location: events[0].location || 'Church Campus',
                                            monthIndex: events[0].monthIndex,
                                            day: events[0].day,
                                            year: events[0].year,
                                            time: events[0].time
                                        }}
                                        variant="light"
                                    />
                                    <ReminderButton
                                        event={{
                                            title: events[0].title,
                                            description: events[0].description,
                                            location: events[0].location,
                                            time: events[0].time,
                                            eventDate: events[0].eventDate,
                                        }}
                                        variant="light"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Right 3 cards: wide/narrow bento */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {/* Community Potluck — wide top left */}
                        {events[1] && (
                            <div className="group relative overflow-hidden rounded-[1.5rem] sm:col-span-2 min-h-[190px] flex flex-col justify-between p-5 sm:p-6">
                                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" style={{ backgroundImage: `url("${events[1].image}")` }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0814] via-[#140d23]/50 to-transparent" />
                                <div className="absolute inset-0 bg-[#5b2d9c]/0 group-hover:bg-[#5b2d9c]/15 transition-colors duration-700" />
                                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#140d23]/60 to-transparent" />
                                
                                <div className="relative z-10 self-start bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 text-center min-w-[44px]">
                                    <p className="text-[#e36520] text-[8px] font-black uppercase tracking-widest leading-none font-body">{events[1].month}</p>
                                    <p className="text-white text-[1.25rem] font-bold leading-none mt-1 font-display tabular-nums">{events[1].date}</p>
                                </div>

                                <div className="relative z-10 pt-8">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <p className="text-[#e36520] text-[8px] font-black uppercase tracking-[0.35em] font-body">{events[1].category}</p>
                                        {events[1].eventType && events[1].eventType !== 'one_time' && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-bold text-white/80 border border-white/15 uppercase tracking-wider">
                                                <span className="material-symbols-outlined text-[9px]">repeat</span>
                                                {events[1].recurrenceRule || 'Recurring'}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-white font-medium leading-tight mb-2 text-lg sm:text-xl" style={{ fontFamily: 'var(--font-newsreader), serif' }}>{events[1].title}</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-body mb-3">
                                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                                        <span>{events[1].time}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <AddToCalendar
                                            event={{
                                                title: events[1].title,
                                                description: events[1].description,
                                                location: events[1].location || 'Church Campus',
                                                monthIndex: events[1].monthIndex,
                                                day: events[1].day,
                                                year: events[1].year,
                                                time: events[1].time
                                            }}
                                            variant="light"
                                        />
                                        <ReminderButton
                                            event={{
                                                title: events[1].title,
                                                description: events[1].description,
                                                location: events[1].location,
                                                time: events[1].time,
                                                eventDate: events[1].eventDate,
                                            }}
                                            variant="light"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* City Serve Day — narrow tall right column, spans 2 rows */}
                        {events[2] && (
                            <div className="group relative overflow-hidden rounded-[1.5rem] sm:row-span-2 min-h-[220px] flex flex-col justify-between p-5 sm:p-6">
                                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" style={{ backgroundImage: `url("${events[2].image}")` }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0814] via-[#140d23]/50 to-transparent" />
                                <div className="absolute inset-0 bg-[#5b2d9c]/0 group-hover:bg-[#5b2d9c]/15 transition-colors duration-700" />
                                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#140d23]/60 to-transparent" />
                                
                                <div className="relative z-10 self-start bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 text-center min-w-[44px]">
                                    <p className="text-[#e36520] text-[8px] font-black uppercase tracking-widest leading-none font-body">{events[2].month}</p>
                                    <p className="text-white text-[1.25rem] font-bold leading-none mt-1 font-display tabular-nums">{events[2].date}</p>
                                </div>

                                <div className="relative z-10 pt-8">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <p className="text-[#e36520] text-[8px] font-black uppercase tracking-[0.35em] font-body">{events[2].category}</p>
                                        {events[2].eventType && events[2].eventType !== 'one_time' && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-bold text-white/80 border border-white/15 uppercase tracking-wider">
                                                <span className="material-symbols-outlined text-[9px]">repeat</span>
                                                {events[2].recurrenceRule || 'Recurring'}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-white font-medium leading-tight mb-2 text-lg sm:text-xl" style={{ fontFamily: 'var(--font-newsreader), serif' }}>{events[2].title}</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-body mb-3">
                                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                                        <span>{events[2].time}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <AddToCalendar
                                            event={{
                                                title: events[2].title,
                                                description: events[2].description,
                                                location: events[2].location || 'Church Campus',
                                                monthIndex: events[2].monthIndex,
                                                day: events[2].day,
                                                year: events[2].year,
                                                time: events[2].time
                                            }}
                                            variant="light"
                                        />
                                        <ReminderButton
                                            event={{
                                                title: events[2].title,
                                                description: events[2].description,
                                                location: events[2].location,
                                                time: events[2].time,
                                                eventDate: events[2].eventDate,
                                            }}
                                            variant="light"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Men's Breakfast — wide bottom left */}
                        {events[3] && (
                            <div className="group relative overflow-hidden rounded-[1.5rem] sm:col-span-2 min-h-[190px] flex flex-col justify-between p-5 sm:p-6">
                                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" style={{ backgroundImage: `url("${events[3].image}")` }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0814] via-[#140d23]/50 to-transparent" />
                                <div className="absolute inset-0 bg-[#5b2d9c]/0 group-hover:bg-[#5b2d9c]/15 transition-colors duration-700" />
                                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#140d23]/60 to-transparent" />
                                
                                <div className="relative z-10 self-start bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 text-center min-w-[44px]">
                                    <p className="text-[#e36520] text-[8px] font-black uppercase tracking-widest leading-none font-body">{events[3].month}</p>
                                    <p className="text-white text-[1.25rem] font-bold leading-none mt-1 font-display tabular-nums">{events[3].date}</p>
                                </div>

                                <div className="relative z-10 pt-8">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <p className="text-[#e36520] text-[8px] font-black uppercase tracking-[0.35em] mb-1 font-body">{events[3].category}</p>
                                        {events[3].eventType && events[3].eventType !== 'one_time' && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-bold text-white/80 border border-white/15 uppercase tracking-wider">
                                                <span className="material-symbols-outlined text-[9px]">repeat</span>
                                                {events[3].recurrenceRule || 'Recurring'}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-white font-medium leading-tight mb-2 text-lg sm:text-xl" style={{ fontFamily: 'var(--font-newsreader), serif' }}>{events[3].title}</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-body mb-3">
                                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                                        <span>{events[3].time}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <AddToCalendar
                                            event={{
                                                title: events[3].title,
                                                description: events[3].description,
                                                location: events[3].location || 'Church Campus',
                                                monthIndex: events[3].monthIndex,
                                                day: events[3].day,
                                                year: events[3].year,
                                                time: events[3].time
                                            }}
                                            variant="light"
                                        />
                                        <ReminderButton
                                            event={{
                                                title: events[3].title,
                                                description: events[3].description,
                                                location: events[3].location,
                                                time: events[3].time,
                                                eventDate: events[3].eventDate,
                                            }}
                                            variant="light"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}
