'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ── Types ────────────────────────────────────────────────────────────── */
type Announcement = {
    id: number;
    category: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    accent: string;
    icon: string;
    urgent?: boolean;
    linkText?: string;
    linkUrl?: string;
};

interface SanityAnnouncement {
    _id: string;
    title: string;
    date: string;
    category: string;
    content: string;
    linkText?: string;
    linkUrl?: string;
}

interface AnnouncementsSectionProps {
    announcements?: SanityAnnouncement[];
}

/* ── Data Fallback ─────────────────────────────────────────────────────── */
const FALLBACK_ANNOUNCEMENTS: Announcement[] = [
    {
        id: 1,
        category: 'Registration',
        title: 'Vacation Bible School 2026',
        date: 'Jul 7 – 11',
        time: '9:00 AM – 12:30 PM',
        location: 'Church Fellowship Hall',
        description:
            'Registration is now open for VBS! This year\'s theme: "Explorers of Faith." Children ages 4–14 are welcome. Activities include Bible stories, crafts, music, and nature adventures. Sign up before spots fill.',
        accent: '#e36520',
        icon: 'child_care',
        urgent: true,
    },
    {
        id: 2,
        category: 'Church Business',
        title: 'Annual Business Meeting',
        date: 'Jul 19, Sabbath',
        time: '2:00 PM – 4:00 PM',
        location: 'Main Sanctuary',
        description:
            'All members are invited to attend the annual church business meeting. Departmental reports and officer elections for the 2026–2027 term will be presented. Your voice and vote matter.',
        accent: '#5b2d9c',
        icon: 'groups',
    },
    {
        id: 3,
        category: 'Youth',
        title: 'Youth Sabbath — Special Program',
        date: 'Aug 2, Sabbath',
        time: '8:45 AM – 12:30 PM',
        location: 'Main Sanctuary',
        description:
            'Our Ambassadors lead the entire Divine Service — from Sabbath School to the sermon. Come support and encourage our young people as they grow in leadership and faith.',
        accent: '#448d21',
        icon: 'diversity_3',
    },
    {
        id: 4,
        category: 'Health Ministry',
        title: 'Free Health Screening Camp',
        date: 'Aug 10, Sunday',
        time: '8:00 AM – 12:00 PM',
        location: 'Church Grounds',
        description:
            'Blood pressure, blood sugar, and BMI checks — open to the public. Bring your family and neighbours. Health talks on lifestyle medicine will be presented by CMC doctors.',
        accent: '#2f557f',
        icon: 'health_and_safety',
    },
];

function getAnnouncementIconAndAccent(category: string) {
    const c = category.toLowerCase();
    if (c.includes('register') || c.includes('registration') || c.includes('bible') || c.includes('vbs')) {
        return { icon: 'child_care', accent: '#e36520' };
    }
    if (c.includes('business') || c.includes('meeting') || c.includes('church')) {
        return { icon: 'groups', accent: '#5b2d9c' };
    }
    if (c.includes('youth') || c.includes('ambassadors')) {
        return { icon: 'diversity_3', accent: '#448d21' };
    }
    if (c.includes('health') || c.includes('medical') || c.includes('camp')) {
        return { icon: 'health_and_safety', accent: '#2f557f' };
    }
    return { icon: 'campaign', accent: '#5b2d9c' };
}

/* ── Component ────────────────────────────────────────────────────────── */
export default function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
    const [selected, setSelected] = useState<Announcement | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    /* Scroll navigation */
    const scroll = useCallback((dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
    }, []);

    /* Lock body scroll when modal is open */
    useEffect(() => {
        if (selected) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [selected]);

    /* Close on Escape */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const resolvedAnnouncements = announcements && announcements.length > 0
        ? announcements.map((ann, idx) => {
            const { icon, accent } = getAnnouncementIconAndAccent(ann.category);
            return {
                id: idx + 1,
                category: ann.category,
                title: ann.title,
                date: ann.date,
                time: 'Details inside',
                location: 'Church Fellowship Hall',
                description: ann.content,
                accent,
                icon,
                urgent: ann.category.toLowerCase().includes('register') || ann.category.toLowerCase().includes('urgent'),
                linkText: ann.linkText,
                linkUrl: ann.linkUrl
            };
        })
        : FALLBACK_ANNOUNCEMENTS;

    return (
        <section className="py-16 md:py-20 bg-white overflow-hidden relative">
            {/* Subtle top rule */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-[#140d23]/6" />

            <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20 relative">

                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-px w-8 bg-[#e36520]" />
                            <span className="text-[#e36520] text-[10px] font-black uppercase tracking-[0.4em] font-body">
                                Bulletin Board
                            </span>
                        </div>
                        <h2
                            className="text-[#140d23] leading-[0.92] tracking-[-0.03em]"
                            style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400 }}
                        >
                            Announcements
                        </h2>
                    </div>
                    {/* Scroll arrows — desktop */}
                    <div className="hidden sm:flex items-center gap-2">
                        <button
                            onClick={() => scroll('left')}
                            aria-label="Scroll left"
                            className="w-9 h-9 rounded-full border border-[#140d23]/10 flex items-center justify-center text-[#7a6d8e] hover:border-[#5b2d9c]/30 hover:text-[#5b2d9c] hover:bg-[#5b2d9c]/5 transition-all duration-300 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            aria-label="Scroll right"
                            className="w-9 h-9 rounded-full border border-[#140d23]/10 flex items-center justify-center text-[#7a6d8e] hover:border-[#5b2d9c]/30 hover:text-[#5b2d9c] hover:bg-[#5b2d9c]/5 transition-all duration-300 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                    </div>
                </div>

                {/* ── Horizontal scroll strip ─────────────────────────── */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2"
                >
                    {resolvedAnnouncements.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSelected(item)}
                            className="group snap-start flex-shrink-0 w-[280px] md:w-[300px] text-left cursor-pointer focus:outline-none"
                        >
                            <div
                                className="h-full rounded-2xl border border-[#140d23]/6 bg-[#f8f4ef]/40 hover:bg-[#f8f4ef] p-5 hover:border-[#140d23]/12 hover:shadow-[0_8px_24px_-6px_rgba(20,13,35,0.08)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                                style={{ borderLeft: `3px solid ${item.accent}` }}
                            >
                                {/* Category + Date */}
                                <div className="flex items-center justify-between mb-3">
                                    <span
                                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.2em]"
                                        style={{ background: item.accent + '12', color: item.accent, border: `1px solid ${item.accent}22` }}
                                    >
                                        {item.urgent && (
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: item.accent }} />
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: item.accent }} />
                                            </span>
                                        )}
                                        {item.category}
                                    </span>
                                    <span className="text-[#7a6d8e] text-[10px] font-bold font-body">{item.date}</span>
                                </div>

                                {/* Title */}
                                <h3
                                    className="text-[#140d23] font-medium leading-snug mb-1.5 group-hover:text-[#5b2d9c] transition-colors duration-300"
                                    style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: '1.05rem' }}
                                >
                                    {item.title}
                                </h3>

                                {/* Time */}
                                <p className="text-[#7a6d8e] text-[10px] font-bold font-body flex items-center gap-1 mb-2.5">
                                    <span className="material-symbols-outlined text-[11px]">schedule</span>
                                    {item.time}
                                </p>

                                {/* Description snippet */}
                                <p className="text-[#7a6d8e] text-[12px] leading-relaxed font-body line-clamp-2 flex-1">
                                    {item.description}
                                </p>

                                {/* Learn More */}
                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#5b2d9c] group-hover:gap-2.5 transition-all duration-300 font-body mt-3 pt-3 border-t border-[#140d23]/5">
                                    Learn More
                                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Modal ───────────────────────────────────────────────── */}
            <AnimatePresence>
                {selected && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-[#140d23]/50 backdrop-blur-sm z-[100]"
                            onClick={() => setSelected(null)}
                        />

                        {/* Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 16 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                            className="fixed inset-0 z-[101] flex items-center justify-center p-6 pointer-events-none"
                        >
                            <div
                                className="bg-white rounded-3xl w-full max-w-[480px] overflow-hidden shadow-2xl pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Top accent bar */}
                                <div className="h-1" style={{ background: selected.accent }} />

                                <div className="p-7 md:p-9">
                                    {/* Category + Close */}
                                    <div className="flex items-start justify-between mb-5">
                                        <span
                                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em]"
                                            style={{ background: selected.accent + '12', color: selected.accent, border: `1px solid ${selected.accent}25` }}
                                        >
                                            <span className="material-symbols-outlined text-[14px]">{selected.icon}</span>
                                            {selected.category}
                                        </span>
                                        <button
                                            onClick={() => setSelected(null)}
                                            aria-label="Close"
                                            className="w-8 h-8 rounded-full border border-[#140d23]/10 flex items-center justify-center text-[#7a6d8e] hover:text-[#140d23] hover:border-[#140d23]/20 transition-all cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className="text-[#140d23] leading-tight mb-5"
                                        style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', fontWeight: 500 }}
                                    >
                                        {selected.title}
                                    </h3>

                                    {/* Info strip */}
                                    <div className="flex flex-col gap-2.5 mb-5 pb-5 border-b border-[#140d23]/6">
                                        <div className="flex items-center gap-2 text-sm text-[#140d23] font-body">
                                            <span className="material-symbols-outlined text-[16px]" style={{ color: selected.accent }}>calendar_today</span>
                                            <span className="font-semibold">{selected.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#140d23] font-body">
                                            <span className="material-symbols-outlined text-[16px]" style={{ color: selected.accent }}>schedule</span>
                                            <span className="font-semibold">{selected.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#140d23] font-body">
                                            <span className="material-symbols-outlined text-[16px]" style={{ color: selected.accent }}>location_on</span>
                                            <span className="font-semibold">{selected.location}</span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-[#7a6d8e] text-[14px] leading-relaxed font-body mb-7">
                                        {selected.description}
                                    </p>

                                    {/* CTA */}
                                    {selected.linkUrl ? (
                                        <a
                                            href={selected.linkUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 rounded-full h-12 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 hover:-translate-y-0.5 cursor-pointer text-center leading-[48px]"
                                            style={{ background: selected.accent, boxShadow: `0 8px 20px -4px ${selected.accent}40` }}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                            {selected.linkText || 'Register / Learn More'}
                                        </a>
                                    ) : (
                                        <button
                                            className="w-full flex items-center justify-center gap-2 rounded-full h-12 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                                            style={{ background: selected.accent, boxShadow: `0 8px 20px -4px ${selected.accent}40` }}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                                            I&apos;m Interested
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
