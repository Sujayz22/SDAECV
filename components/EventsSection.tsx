'use client';

import AddToCalendar from './AddToCalendar';

const MONTHS_MAP: Record<string, number> = {
    "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
    "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
};

interface SanityEvent {
    _id: string;
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

interface EventsSectionProps {
    events?: SanityEvent[];
}

const FALLBACK_EVENTS = [
    {
        title: "Youth Night",
        category: "Youth",
        date: "12",
        month: "Aug",
        time: "Friday · 7:00 PM",
        description: "A night of games, music, and community for high school students.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4jeqr1sDzk3tp6PALjfRiGMG0vWauNwdHCmol8ZmWfLYBgJ5o_tE30Er2vqCQ42YvCXLGMKZjPThcYMjpd4ARBOutLP75GlDvq6kUy1jYsh5ZANf3JHz3jWNG-BYoxkChUp3BSRTjiLyrwlh0LNFYwbZTnuuOXkd0RnPRfts2DFu621Misc8YxKtHfUEQCRdaDlvWViAvStKCYpodhFI3MxM9xCP2LL6BYeaAb8j4TvCHXronWUt2jZB05k20VREdXfoL6uKddZI"
    },
    {
        title: "Community Potluck",
        category: "Community",
        date: "14",
        month: "Aug",
        time: "Sunday · 12:30 PM",
        description: "Join us after the second service for food and fellowship.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDX4PDC9zg8Hs15l8wWnBeCp_jDWgFB0YGBAhoF6JBFX7tHL07dE9D_OdT8xMhVw3yRC9hGZHy7cea-bW9RQFAcxZfHRWdS1OoFfCRfcHN7ku2t1D3fu3N6xImrc2PUcuqL3bArNQJ9ASnxUKW6oBVBc6IrlyZXcE3-giqpNVqcNgnA2OLIdHG7ejqdb5gROsNQJDxs6YjQN741FC2mZwjxDyy1l-vvbEVZbf0T8dCZQmu2foSElOL1aQkSLgV8CsUSsk4l9sQoz8w"
    },
    {
        title: "City Serve Day",
        category: "Outreach",
        date: "20",
        month: "Aug",
        time: "Saturday · 9:00 AM",
        description: "We're heading out into the city to serve our neighbors.",
        image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&q=80"
    },
    {
        title: "Men's Breakfast",
        category: "Men",
        date: "24",
        month: "Aug",
        time: "Wednesday · 7:00 AM",
        description: "A time for men to gather, eat, and encourage one another.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn_qsRAj0xLppIyYr5F-vCpCNSL9Dt59WrXQn_XtvUW2wuFUS81czcDjymI0J2z2pM5H6_2Fgcy0IycJKkSShyX0a7aCGUgp4ujnWKst8kN0AN76Z07dB-H4IdhfOilUWyrHX1LYur2INaTBrLG5EoWEK-oRTAKUnNWEaGzvSSjsQDmYEdecp6DfosAKZ6815_3GLlbPhh49pa4pF7Aj8ieM0q0dTMKvi6ljIAHI_zosp7in9f4TZoDPEnDyUWjGKD709kB8wVfEY"
    }
];

export default function EventsSection({ events: propEvents }: EventsSectionProps) {
    const events = propEvents && propEvents.length > 0
        ? propEvents.map(e => ({
            title: e.title,
            category: e.category,
            date: String(e.day),
            month: e.month,
            time: e.time,
            description: e.description,
            image: e.image?.asset?.url || "/church.jpg"
        }))
        : FALLBACK_EVENTS;

    return (
        <section className="py-32 md:py-44 bg-[#140d23] overflow-hidden relative">

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
                            <span className="text-[#e36520] text-[10px] font-black uppercase tracking-[0.4em] font-body">What&apos;s On</span>
                        </div>
                        <h2
                            className="text-white leading-[0.85] tracking-[-0.04em]"
                            style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(3rem, 7vw, 7rem)', fontWeight: 400 }}
                        >
                            Upcoming<br />
                            <span className="text-white/25 font-light italic">Events</span>
                        </h2>
                    </div>
                    <a
                        href="#"
                        className="group inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white font-body transition-all duration-300 self-end mb-3 hover:gap-3"
                    >
                        View Calendar
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </a>
                </div>

                {/* Bento layout: tall featured card left + 3-card grid right */}
                <div className="flex flex-col lg:flex-row gap-5" style={{ minHeight: '700px' }}>

                    {/* Featured card — tall, left column */}
                    {events[0] && (
                        <div className="group relative overflow-hidden rounded-[1.75rem] cursor-pointer lg:w-[30%] flex-shrink-0" style={{ minHeight: '420px' }}>
                            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" style={{ backgroundImage: `url("${events[0].image}")` }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0814] via-[#140d23]/40 to-transparent" />
                            <div className="absolute inset-0 bg-[#5b2d9c]/0 group-hover:bg-[#5b2d9c]/15 transition-colors duration-700" />
                            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#140d23]/70 to-transparent" />

                            <div className="absolute top-6 left-6 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 text-center min-w-[56px]">
                                <p className="text-[#e36520] text-[9px] font-black uppercase tracking-widest leading-none font-body">{events[0].month}</p>
                                <p className="text-white text-[1.75rem] font-bold leading-none mt-1.5 font-display tabular-nums">{events[0].date}</p>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <p className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.35em] mb-3 font-body">{events[0].category}</p>
                                <h3 className="text-white font-medium leading-tight mb-3" style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: '2.2rem' }}>
                                    {events[0].title}
                                </h3>
                                <div className="flex items-center gap-1.5 text-[11px] text-white/45 mb-4 font-body">
                                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                                    <span>{events[0].time}</span>
                                </div>
                                <p className="text-[13px] text-white/50 font-body leading-relaxed mb-6">{events[0].description}</p>
                                <div className="flex items-center justify-between gap-4 mt-6">
                                    <AddToCalendar
                                        event={{
                                            title: events[0].title,
                                            description: events[0].description,
                                            location: 'Youth Room',
                                            monthIndex: MONTHS_MAP[events[0].month] ?? 7,
                                            day: parseInt(events[0].date, 10) || 12,
                                            year: 2026,
                                            time: events[0].time
                                        }}
                                        variant="light"
                                    />
                                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#e36520] font-body cursor-pointer">
                                        Register <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Right 3 cards: wide/narrow bento */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5" style={{ gridTemplateRows: 'repeat(2, 1fr)' }}>
                        {/* Community Potluck — wide top left */}
                        {events[1] && (
                            <div className="group relative overflow-hidden rounded-[1.75rem] cursor-pointer sm:col-span-2" style={{ minHeight: '220px' }}>
                                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" style={{ backgroundImage: `url("${events[1].image}")` }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0814] via-[#140d23]/45 to-transparent" />
                                <div className="absolute inset-0 bg-[#5b2d9c]/0 group-hover:bg-[#5b2d9c]/15 transition-colors duration-700" />
                                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#140d23]/60 to-transparent" />
                                <div className="absolute top-5 left-5 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl px-3.5 py-2.5 text-center min-w-[48px]">
                                    <p className="text-[#e36520] text-[8px] font-black uppercase tracking-widest leading-none font-body">{events[1].month}</p>
                                    <p className="text-white text-[1.4rem] font-bold leading-none mt-1 font-display tabular-nums">{events[1].date}</p>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <p className="text-[#e36520] text-[8px] font-black uppercase tracking-[0.35em] mb-2 font-body">{events[1].category}</p>
                                    <h3 className="text-white font-medium leading-tight mb-2.5" style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: '1.3rem' }}>{events[1].title}</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-body mb-4">
                                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                                        <span>{events[1].time}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 mt-2">
                                        <AddToCalendar
                                            event={{
                                                title: events[1].title,
                                                description: events[1].description,
                                                location: 'Fellowship Hall',
                                                monthIndex: MONTHS_MAP[events[1].month] ?? 7,
                                                day: parseInt(events[1].date, 10) || 14,
                                                year: 2026,
                                                time: events[1].time
                                            }}
                                            variant="light"
                                        />
                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#e36520] font-body cursor-pointer">
                                            Register <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* City Serve Day — narrow tall right column, spans 2 rows */}
                        {events[2] && (
                            <div className="group relative overflow-hidden rounded-[1.75rem] cursor-pointer sm:row-span-2" style={{ minHeight: '220px' }}>
                                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" style={{ backgroundImage: `url("${events[2].image}")` }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0814] via-[#140d23]/45 to-transparent" />
                                <div className="absolute inset-0 bg-[#5b2d9c]/0 group-hover:bg-[#5b2d9c]/15 transition-colors duration-700" />
                                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#140d23]/60 to-transparent" />
                                <div className="absolute top-5 left-5 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl px-3.5 py-2.5 text-center min-w-[48px]">
                                    <p className="text-[#e36520] text-[8px] font-black uppercase tracking-widest leading-none font-body">{events[2].month}</p>
                                    <p className="text-white text-[1.4rem] font-bold leading-none mt-1 font-display tabular-nums">{events[2].date}</p>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <p className="text-[#e36520] text-[8px] font-black uppercase tracking-[0.35em] mb-2 font-body">{events[2].category}</p>
                                    <h3 className="text-white font-medium leading-tight mb-2.5" style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: '1.3rem' }}>{events[2].title}</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-body mb-4">
                                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                                        <span>{events[2].time}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 mt-2">
                                        <AddToCalendar
                                            event={{
                                                title: events[2].title,
                                                description: events[2].description,
                                                location: 'Vellore City',
                                                monthIndex: MONTHS_MAP[events[2].month] ?? 7,
                                                day: parseInt(events[2].date, 10) || 20,
                                                year: 2026,
                                                time: events[2].time
                                            }}
                                            variant="light"
                                        />
                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#e36520] font-body cursor-pointer">
                                            Register <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Men's Breakfast — wide bottom left */}
                        {events[3] && (
                            <div className="group relative overflow-hidden rounded-[1.75rem] cursor-pointer sm:col-span-2" style={{ minHeight: '220px' }}>
                                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" style={{ backgroundImage: `url("${events[3].image}")` }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0814] via-[#140d23]/45 to-transparent" />
                                <div className="absolute inset-0 bg-[#5b2d9c]/0 group-hover:bg-[#5b2d9c]/15 transition-colors duration-700" />
                                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#140d23]/60 to-transparent" />
                                <div className="absolute top-5 left-5 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl px-3.5 py-2.5 text-center min-w-[48px]">
                                    <p className="text-[#e36520] text-[8px] font-black uppercase tracking-widest leading-none font-body">{events[3].month}</p>
                                    <p className="text-white text-[1.4rem] font-bold leading-none mt-1 font-display tabular-nums">{events[3].date}</p>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <p className="text-[#e36520] text-[8px] font-black uppercase tracking-[0.35em] mb-2 font-body">{events[3].category}</p>
                                    <h3 className="text-white font-medium leading-tight mb-2.5" style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: '1.3rem' }}>{events[3].title}</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-body mb-4">
                                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                                        <span>{events[3].time}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 mt-2">
                                        <AddToCalendar
                                            event={{
                                                title: events[3].title,
                                                description: events[3].description,
                                                location: 'Chapel',
                                                monthIndex: MONTHS_MAP[events[3].month] ?? 7,
                                                day: parseInt(events[3].date, 10) || 24,
                                                year: 2026,
                                                time: events[3].time
                                            }}
                                            variant="light"
                                        />
                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#e36520] font-body cursor-pointer">
                                            Register <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                        </div>
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
