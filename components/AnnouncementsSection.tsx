'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NotificationPrompt from './NotificationPrompt';

/* ── Types ────────────────────────────────────────────────────────────── */
export interface SanityAnnouncement {
    _id: string;
    title: string;
    date?: string;
    time?: string;
    location?: string;
    category?: string;
    content?: string;
    image?: {
        asset?: {
            _id?: string;
            url?: string;
        };
    };
    urgent?: boolean;
    linkText?: string;
    linkUrl?: string;
}

interface AnnouncementItem {
    id: string;
    title: string;
    date?: string;
    time?: string;
    location?: string;
    category?: string;
    description?: string;
    imageUrl?: string;
    accent: string;
    icon: string;
    urgent?: boolean;
    linkText?: string;
    linkUrl?: string;
}

interface AnnouncementsSectionProps {
    announcements?: SanityAnnouncement[];
}

/* ── Fallback Announcements ────────────────────────────────────────────── */
const FALLBACK_ANNOUNCEMENTS: AnnouncementItem[] = [
    {
        id: '1',
        category: 'Registration',
        title: 'Vacation Bible School 2026',
        date: 'Jul 7 – 11',
        time: '9:00 AM – 12:30 PM',
        location: 'Church Fellowship Hall',
        description:
            'Registration is now open for VBS! This year\'s theme: "Explorers of Faith." Children ages 4–14 are welcome. Activities include Bible stories, crafts, music, and nature adventures.',
        accent: '#e36520',
        icon: 'child_care',
        urgent: true,
        linkText: 'Register Now',
        linkUrl: '/connect',
    },
    {
        id: '2',
        category: 'Church Notice',
        title: 'Annual Church Business Meeting',
        date: 'Jul 19, Sabbath',
        time: '2:00 PM – 4:00 PM',
        location: 'Main Sanctuary',
        description:
            'All church members are warmly invited to attend our annual business meeting. Departmental reports and officer elections will be presented. Your presence matters.',
        accent: '#5b2d9c',
        icon: 'groups',
    },
    {
        id: '3',
        category: 'Youth Ministry',
        title: 'Youth Sabbath — Special Program',
        date: 'Aug 2, Sabbath',
        time: '8:30 AM – 12:30 PM',
        location: 'Main Sanctuary',
        description:
            'Our youth lead the entire Sabbath service — from Sabbath School to the Divine Service sermon. Come support and encourage our young people in faith.',
        accent: '#448d21',
        icon: 'diversity_3',
    },
    {
        id: '4',
        category: 'Health Ministry',
        title: 'Free Health Screening Camp',
        date: 'Aug 10, Sunday',
        time: '8:00 AM – 12:00 PM',
        location: 'Church Grounds',
        description:
            'Free blood pressure, blood sugar, and BMI checks open to the entire Vellore community. Health talks on lifestyle medicine will be presented by CMC doctors.',
        accent: '#2f557f',
        icon: 'health_and_safety',
    },
];

function getCategoryTheme(category?: string) {
    if (!category) return { icon: 'campaign', accent: '#5b2d9c' };
    const c = category.toLowerCase();
    if (c.includes('register') || c.includes('registration') || c.includes('bible') || c.includes('vbs') || c.includes('child')) {
        return { icon: 'child_care', accent: '#e36520' };
    }
    if (c.includes('business') || c.includes('meeting') || c.includes('church') || c.includes('notice')) {
        return { icon: 'groups', accent: '#5b2d9c' };
    }
    if (c.includes('youth') || c.includes('ambassador')) {
        return { icon: 'diversity_3', accent: '#448d21' };
    }
    if (c.includes('health') || c.includes('medical') || c.includes('camp')) {
        return { icon: 'health_and_safety', accent: '#2f557f' };
    }
    if (c.includes('worship') || c.includes('prayer') || c.includes('spiritual')) {
        return { icon: 'volunteer_activism', accent: '#5b2d9c' };
    }
    return { icon: 'campaign', accent: '#5b2d9c' };
}

/* ── Main Component ────────────────────────────────────────────────────── */
export default function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
    const [selected, setSelected] = useState<AnnouncementItem | null>(null);
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
        return () => {
            document.body.style.overflow = '';
        };
    }, [selected]);

    /* Close on Escape */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelected(null);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const resolvedAnnouncements: AnnouncementItem[] = announcements && announcements.length > 0
        ? announcements.map((ann, idx) => {
            const { icon, accent } = getCategoryTheme(ann.category);
            return {
                id: ann._id || String(idx + 1),
                title: ann.title,
                date: ann.date?.trim() || undefined,
                time: ann.time?.trim() || undefined,
                location: ann.location?.trim() || undefined,
                category: ann.category?.trim() || undefined,
                description: ann.content?.trim() || undefined,
                imageUrl: ann.image?.asset?.url || undefined,
                accent,
                icon,
                urgent: Boolean(ann.urgent),
                linkText: ann.linkText?.trim() || undefined,
                linkUrl: ann.linkUrl?.trim() || undefined,
            };
        })
        : FALLBACK_ANNOUNCEMENTS;

    return (
        <section className="py-16 md:py-20 bg-white overflow-hidden relative">
            {/* Subtle top divider */}
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

                    {/* Notification bell and scroll arrows */}
                    <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
                        {/* Browser Push Notification subscribe button */}
                        <NotificationPrompt compact={true} />

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
                </div>

                {/* ── Horizontal scroll strip ─────────────────────────── */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2"
                >
                    {resolvedAnnouncements.map((item) => {
                        const hasHeader = item.category || item.date;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setSelected(item)}
                                className="group snap-start flex-shrink-0 w-[280px] md:w-[310px] text-left cursor-pointer focus:outline-none"
                            >
                                <div
                                    className="h-full rounded-2xl border border-[#140d23]/6 bg-[#f8f4ef]/40 hover:bg-[#f8f4ef] p-5 hover:border-[#140d23]/12 hover:shadow-[0_8px_24px_-6px_rgba(20,13,35,0.08)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                                    style={{ borderLeft: `3px solid ${item.accent}` }}
                                >
                                    <div>
                                        {/* Category Badge & Date Row (Only if at least one exists) */}
                                        {hasHeader && (
                                            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                                                {item.category ? (
                                                    <span
                                                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8.5px] font-black uppercase tracking-[0.18em]"
                                                        style={{
                                                            background: item.accent + '12',
                                                            color: item.accent,
                                                            border: `1px solid ${item.accent}22`,
                                                        }}
                                                    >
                                                        {item.urgent && (
                                                            <span className="relative flex h-1.5 w-1.5">
                                                                <span
                                                                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                                                    style={{ background: item.accent }}
                                                                />
                                                                <span
                                                                    className="relative inline-flex rounded-full h-1.5 w-1.5"
                                                                    style={{ background: item.accent }}
                                                                />
                                                            </span>
                                                        )}
                                                        {item.category}
                                                    </span>
                                                ) : item.urgent ? (
                                                    <span
                                                        className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#e36520] bg-[#e36520]/10 border border-[#e36520]/20"
                                                    >
                                                        Priority
                                                    </span>
                                                ) : <span />}

                                                {/* Date (Only if present) */}
                                                {item.date && (
                                                    <span className="text-[#7a6d8e] text-[10px] font-bold font-body">
                                                        {item.date}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Title */}
                                        <h3
                                            className="text-[#140d23] font-medium leading-snug mb-2 group-hover:text-[#5b2d9c] transition-colors duration-300"
                                            style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: '1.08rem' }}
                                        >
                                            {item.title}
                                        </h3>

                                        {/* Optional Time Row (Only if present) */}
                                        {item.time && (
                                            <p className="text-[#7a6d8e] text-[10.5px] font-semibold font-body flex items-center gap-1 mb-2">
                                                <span className="material-symbols-outlined text-[13px]">schedule</span>
                                                {item.time}
                                            </p>
                                        )}

                                        {/* Optional Description snippet (Only if present) */}
                                        {item.description && (
                                            <p className="text-[#7a6d8e] text-[12px] leading-relaxed font-body line-clamp-2 mb-2">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Card Footer: View Details / Action */}
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#5b2d9c] group-hover:gap-2 transition-all duration-300 font-body pt-3 mt-2 border-t border-[#140d23]/5">
                                        <span>View Details</span>
                                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
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

                        {/* Modal Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 16 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                            className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
                        >
                            <div
                                data-lenis-prevent="true"
                                onWheel={(e) => e.stopPropagation()}
                                className="bg-white rounded-3xl w-full max-w-[520px] max-h-[88vh] overflow-y-auto hide-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shadow-2xl pointer-events-auto flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Top accent bar */}
                                <div className="h-1 flex-shrink-0" style={{ background: selected.accent }} />

                                <div className="p-6 sm:p-8 flex flex-col gap-4">
                                    {/* Category + Close button */}
                                    <div className="flex items-center justify-between gap-3">
                                        {selected.category ? (
                                            <span
                                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em]"
                                                style={{
                                                    background: selected.accent + '12',
                                                    color: selected.accent,
                                                    border: `1px solid ${selected.accent}25`,
                                                }}
                                            >
                                                <span className="material-symbols-outlined text-[13px]">{selected.icon}</span>
                                                {selected.category}
                                            </span>
                                        ) : selected.urgent ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#e36520] bg-[#e36520]/10 border border-[#e36520]/20">
                                                ⚡ Priority Alert
                                            </span>
                                        ) : (
                                            <span />
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => setSelected(null)}
                                            aria-label="Close"
                                            className="w-8 h-8 rounded-full border border-[#140d23]/10 flex items-center justify-center text-[#7a6d8e] hover:text-[#140d23] hover:border-[#140d23]/20 transition-all cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                    </div>

                                    {/* Optional Image */}
                                    {selected.imageUrl && (
                                        <div className="relative w-full rounded-2xl overflow-hidden bg-[#140d23]/5 border border-[#140d23]/8 flex items-center justify-center group/img">
                                            <img
                                                src={selected.imageUrl}
                                                alt={selected.title}
                                                className="w-full h-auto max-h-[380px] object-contain rounded-2xl"
                                            />
                                            <a
                                                href={selected.imageUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[10px] font-bold backdrop-blur-sm transition-all"
                                                title="View full poster"
                                            >
                                                <span className="material-symbols-outlined text-[13px]">fullscreen</span>
                                                Full Poster
                                            </a>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h3
                                        className="text-[#140d23] leading-tight"
                                        style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', fontWeight: 500 }}
                                    >
                                        {selected.title}
                                    </h3>

                                    {/* Optional Info Strip (Rendered ONLY if at least one field is present) */}
                                    {(selected.date || selected.time || selected.location) && (
                                        <div className="flex flex-col gap-2 py-3 px-3.5 rounded-xl bg-[#f8f4ef]/60 border border-[#140d23]/6">
                                            {/* Date */}
                                            {selected.date && (
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#140d23] font-body">
                                                    <span className="material-symbols-outlined text-[16px]" style={{ color: selected.accent }}>
                                                        calendar_today
                                                    </span>
                                                    <span className="font-semibold">{selected.date}</span>
                                                </div>
                                            )}

                                            {/* Time */}
                                            {selected.time && (
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#140d23] font-body">
                                                    <span className="material-symbols-outlined text-[16px]" style={{ color: selected.accent }}>
                                                        schedule
                                                    </span>
                                                    <span className="font-semibold">{selected.time}</span>
                                                </div>
                                            )}

                                            {/* Location */}
                                            {selected.location && (
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#140d23] font-body">
                                                    <span className="material-symbols-outlined text-[16px]" style={{ color: selected.accent }}>
                                                        location_on
                                                    </span>
                                                    <span className="font-semibold">{selected.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Description (Only if present) */}
                                    {selected.description && (
                                        <p className="text-[#7a6d8e] text-[13.5px] leading-relaxed font-body whitespace-pre-wrap">
                                            {selected.description}
                                        </p>
                                    )}

                                    {/* Optional Action Button Link (ONLY if linkUrl is present; NO fake "I'm interested" button!) */}
                                    {selected.linkUrl && (
                                        <div className="pt-2">
                                            <a
                                                href={selected.linkUrl}
                                                target={selected.linkUrl.startsWith('http') ? '_blank' : undefined}
                                                rel={selected.linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                className="w-full flex items-center justify-center gap-2 rounded-full h-12 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-md"
                                                style={{ background: selected.accent, boxShadow: `0 8px 20px -4px ${selected.accent}40` }}
                                            >
                                                <span>{selected.linkText || 'Learn More'}</span>
                                                <span className="material-symbols-outlined text-[16px]">
                                                    {selected.linkUrl.startsWith('http') ? 'open_in_new' : 'arrow_forward'}
                                                </span>
                                            </a>
                                        </div>
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
