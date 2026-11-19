'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ── Prayer data ──────────────────────────────────────────────────────── */
export interface SanityPrayerRequest {
    _id: string;
    name: string;
    date: string;
    request: string;
    answer?: string;
    status?: 'active' | 'answered' | string;
    likes?: number;
    pinned?: boolean;
}

interface PrayerWallSectionProps {
    prayers?: SanityPrayerRequest[];
    ctaHref?: string;
}

/* ── Prayer fallback data ─────────────────────────────────────────── */
const FALLBACK_PRAYERS: SanityPrayerRequest[] = [
    {
        _id: '1',
        request: 'Please pray for my mother\'s recovery from surgery. We trust in God\'s healing power.',
        name: 'A Church Member',
        date: '2 days ago',
        status: 'active',
        likes: 8,
        answer: 'Praise God for answering our prayers. She is doing well now.',
    },
    {
        _id: '2',
        request: 'Pray for the youth as they prepare for Youth Sabbath. May God give them wisdom and courage.',
        name: 'Youth Ministry',
        date: '3 days ago',
        status: 'active',
        likes: 12,
    },
    {
        _id: '3',
        request: 'Lifting up our community in Vellore — for peace, health, and spiritual renewal in every home.',
        name: 'Prayer Ministry',
        date: '5 days ago',
        status: 'active',
        likes: 24,
        pinned: true,
    },
    {
        _id: '4',
        request: 'Pray for safe travels for our missionaries serving in Northeast India this month.',
        name: 'Mission Committee',
        date: '1 week ago',
        status: 'answered',
        likes: 15,
        answer: 'They have reached safely by God\'s grace and started their outreach.',
    },
];

/* ── Individual Prayer Card Component ───────────────────────────────── */
function PrayerCard({ prayer }: { prayer: SanityPrayerRequest }) {
    const [prayed, setPrayed] = useState(false);
    const [count, setCount] = useState(prayer.likes ?? 0);
    const [isUpdating, setIsUpdating] = useState(false);

    // Sync count if prop updates
    useEffect(() => {
        if (typeof prayer.likes === 'number') {
            setCount(prayer.likes);
        }
    }, [prayer.likes]);

    // Read stored "prayed" state from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('sdaecv_prayed_prayers');
            if (stored) {
                const prayedIds: string[] = JSON.parse(stored);
                if (Array.isArray(prayedIds) && prayedIds.includes(prayer._id)) {
                    setPrayed(true);
                }
            }
        } catch {
            // Ignore localStorage errors (e.g., privacy/incognito mode)
        }
    }, [prayer._id]);

    const handlePrayClick = async () => {
        if (isUpdating) return;
        const nextPrayed = !prayed;
        const action = nextPrayed ? 'pray' : 'unpray';

        // 1. Optimistic UI update
        setPrayed(nextPrayed);
        setCount(prev => (nextPrayed ? prev + 1 : Math.max(0, prev - 1)));

        // 2. Persist in localStorage so visitor doesn't duplicate on reload
        try {
            const stored = localStorage.getItem('sdaecv_prayed_prayers');
            let prayedIds: string[] = stored ? JSON.parse(stored) : [];
            if (!Array.isArray(prayedIds)) prayedIds = [];
            if (nextPrayed) {
                if (!prayedIds.includes(prayer._id)) prayedIds.push(prayer._id);
            } else {
                prayedIds = prayedIds.filter(id => id !== prayer._id);
            }
            localStorage.setItem('sdaecv_prayed_prayers', JSON.stringify(prayedIds));
        } catch {
            // Ignore storage errors
        }

        // 3. Persist to Sanity via server API route
        try {
            setIsUpdating(true);
            const res = await fetch('/api/prayers/pray', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: prayer._id, action }),
            });
            if (res.ok) {
                const data = await res.json();
                if (typeof data.likes === 'number') {
                    setCount(data.likes);
                }
            }
        } catch (err) {
            console.error('Failed to sync prayer count to Sanity:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    const isAnswered = prayer.status === 'answered' || Boolean(prayer.answer);

    return (
        <div
            className={`group relative flex flex-col justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:shadow-[0_12px_30px_-8px_rgba(91,45,156,0.12)] hover:-translate-y-0.5 ${
                prayer.pinned
                    ? 'border-[#e36520]/40 ring-2 ring-[#e36520]/15 bg-gradient-to-b from-white to-[#fff8f3]'
                    : isAnswered
                    ? 'border-[#448d21]/25 hover:border-[#448d21]/40'
                    : 'border-[#140d23]/8 hover:border-[#5b2d9c]/25'
            }`}
        >
            {/* Top row: Badges and date */}
            <div>
                <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {prayer.pinned && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#e36520]/12 text-[#e36520] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 border border-[#e36520]/20">
                                <span className="material-symbols-outlined text-[12px]">push_pin</span>
                                Pinned
                            </span>
                        )}

                        {isAnswered ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#448d21]/12 text-[#448d21] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 border border-[#448d21]/20">
                                <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                Answered
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#5b2d9c]/10 text-[#5b2d9c] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5">
                                <span className="material-symbols-outlined text-[12px]">volunteer_activism</span>
                                Needs Prayer
                            </span>
                        )}
                    </div>

                    <span className="text-[10px] text-[#7a6d8e]/60 font-body">
                        {prayer.date || 'Recently'}
                    </span>
                </div>

                {/* Quotation mark */}
                <span
                    className="block text-[#e36520]/20 text-3xl leading-none -mb-1 select-none"
                    style={{ fontFamily: 'var(--font-newsreader), serif' }}
                >
                    &ldquo;
                </span>

                {/* Prayer Request text */}
                <p className="text-[#140d23]/80 text-[13.5px] leading-relaxed font-body italic mb-3">
                    {prayer.request}
                </p>

                {/* Praise Report / Answer Callout */}
                {prayer.answer && (
                    <div className="mt-3 p-3.5 rounded-xl bg-[#448d21]/8 border border-[#448d21]/20">
                        <div className="flex items-center gap-1.5 text-[#448d21] text-[10px] font-black uppercase tracking-widest mb-1 font-body">
                            <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                            Praise Report &amp; Answer
                        </div>
                        <p className="text-[#140d23]/85 text-xs font-body leading-relaxed">
                            {prayer.answer}
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom Row: Attribution & Interactive Prayer Counter */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#140d23]/6 gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#7a6d8e] font-body truncate max-w-[130px]">
                    {prayer.name || 'Anonymous'}
                </span>

                {/* I Prayed Button / Counter */}
                <button
                    type="button"
                    onClick={handlePrayClick}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                        prayed
                            ? 'bg-[#5b2d9c] text-white shadow-md shadow-[#5b2d9c]/20 scale-105'
                            : 'bg-white hover:bg-[#5b2d9c]/10 text-[#5b2d9c] border border-[#5b2d9c]/20 hover:border-[#5b2d9c]/40'
                    }`}
                    title="Click to pray for this request"
                >
                    <span className={`material-symbols-outlined text-[14px] ${prayed ? 'scale-110' : ''}`}>
                        {prayed ? 'favorite' : 'volunteer_activism'}
                    </span>
                    <span>{count}</span>
                    <span className="hidden sm:inline text-[10px] font-medium opacity-80">
                        {prayed ? 'Prayed' : 'Pray'}
                    </span>
                </button>
            </div>
        </div>
    );
}

/* ── Main Component ─────────────────────────────────────────────────── */
export default function PrayerWallSection({ prayers: propPrayers, ctaHref = '/connect#connect-form' }: PrayerWallSectionProps) {
    const rawPrayers = propPrayers && propPrayers.length > 0 ? propPrayers : FALLBACK_PRAYERS;
    const [filter, setFilter] = useState<'all' | 'needs-prayer' | 'answered'>('all');

    // Sort: pinned first, then date/created
    const sortedPrayers = [...rawPrayers].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
    });

    const filteredPrayers = sortedPrayers.filter((p) => {
        if (filter === 'needs-prayer') {
            return p.status !== 'answered' && !p.answer;
        }
        if (filter === 'answered') {
            return p.status === 'answered' || Boolean(p.answer);
        }
        return true;
    });

    const answeredCount = sortedPrayers.filter(p => p.status === 'answered' || Boolean(p.answer)).length;

    return (
        <section className="py-20 md:py-28 bg-[#fdebd4] overflow-hidden relative">
            {/* Decorative warmth */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-[#e36520]/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#e36520]/[0.04] blur-[120px]" />
            </div>

            <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20 relative">

                {/* ── Header ─────────────────────────────────────────── */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-[#e36520]" />
                        <span className="text-[#e36520] text-[10px] font-black uppercase tracking-[0.4em] font-body">
                            Lifting Hearts Together
                        </span>
                        <div className="h-px w-8 bg-[#e36520]" />
                    </div>
                    <h2
                        className="text-[#140d23] leading-[0.92] tracking-[-0.03em]"
                        style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400 }}
                    >
                        Prayer <span className="text-[#5b2d9c] italic font-light">Wall</span>
                    </h2>
                    <p className="text-[#7a6d8e] text-sm font-body mt-3 max-w-md mx-auto leading-relaxed">
                        Join us in prayer. Read what&apos;s on the hearts of our church family, celebrate praise reports, and lift one another before God.
                    </p>

                    {/* Filter Pills */}
                    <div className="inline-flex items-center bg-white/60 p-1.5 rounded-full border border-[#140d23]/8 mt-6 gap-1 shadow-sm">
                        <button
                            type="button"
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold font-body transition-all cursor-pointer ${
                                filter === 'all'
                                    ? 'bg-[#5b2d9c] text-white shadow-sm'
                                    : 'text-[#7a6d8e] hover:text-[#140d23]'
                            }`}
                        >
                            All ({sortedPrayers.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('needs-prayer')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold font-body transition-all cursor-pointer ${
                                filter === 'needs-prayer'
                                    ? 'bg-[#5b2d9c] text-white shadow-sm'
                                    : 'text-[#7a6d8e] hover:text-[#140d23]'
                            }`}
                        >
                            Needs Prayer ({sortedPrayers.length - answeredCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('answered')}
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold font-body transition-all cursor-pointer ${
                                filter === 'answered'
                                    ? 'bg-[#448d21] text-white shadow-sm'
                                    : 'text-[#7a6d8e] hover:text-[#140d23]'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                            Praise Reports ({answeredCount})
                        </button>
                    </div>
                </div>

                {/* ── Prayer cards Grid ────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 items-stretch">
                    {filteredPrayers.map((prayer) => (
                        <PrayerCard key={prayer._id} prayer={prayer} />
                    ))}
                </div>

                {/* ── CTA ─────────────────────────────────────────────── */}
                <div className="text-center">
                    <Link
                        href={ctaHref}
                        className="group inline-flex items-center gap-2.5 rounded-full bg-white border border-[#140d23]/8 px-7 py-3.5 text-sm font-bold text-[#140d23] hover:border-[#5b2d9c]/30 hover:text-[#5b2d9c] hover:shadow-md transition-all duration-300 font-body"
                    >
                        <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                        Share a Prayer Request
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
