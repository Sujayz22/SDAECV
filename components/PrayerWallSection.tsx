import Link from 'next/link';

/* ── Prayer data ──────────────────────────────────────────────────────── */
interface SanityPrayerRequest {
    _id: string;
    name: string;
    date: string;
    request: string;
    answer?: string;
    status: string;
}

interface PrayerWallSectionProps {
    prayers?: SanityPrayerRequest[];
}

/* ── Prayer fallback data ─────────────────────────────────────────── */
const FALLBACK_PRAYERS = [
    {
        id: '1',
        text: 'Please pray for my mother\'s recovery from surgery. We trust in God\'s healing power.',
        from: 'A Church Member',
        time: '2 days ago',
    },
    {
        id: '2',
        text: 'Pray for the youth as they prepare for Youth Sabbath. May God give them wisdom and courage.',
        from: 'Youth Ministry',
        time: '3 days ago',
    },
    {
        id: '3',
        text: 'Lifting up our community in Vellore — for peace, health, and spiritual renewal in every home.',
        from: 'Prayer Ministry',
        time: '5 days ago',
    },
    {
        id: '4',
        text: 'Pray for safe travels for our missionaries serving in Northeast India this month.',
        from: 'Mission Committee',
        time: '1 week ago',
    },
];

/* ── Component ────────────────────────────────────────────────────────── */
export default function PrayerWallSection({ prayers: propPrayers }: PrayerWallSectionProps) {
    const prayers = propPrayers && propPrayers.length > 0
        ? propPrayers.map((p) => ({
            id: p._id,
            text: p.request,
            from: p.name,
            time: p.date || 'Recently',
        }))
        : FALLBACK_PRAYERS;
    return (
        <section className="py-20 md:py-28 bg-[#fdebd4] overflow-hidden relative">
            {/* Decorative warmth */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-[#e36520]/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#e36520]/[0.04] blur-[120px]" />
            </div>

            <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20 relative">

                {/* ── Header — centered ───────────────────────────────── */}
                <div className="text-center mb-12">
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
                        Join us in prayer. Read what&apos;s on the hearts of our church family and lift them before God.
                    </p>
                </div>

                {/* ── Prayer cards ─────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {prayers.map((prayer) => (
                        <div
                            key={prayer.id}
                            className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-[#e36520]/8 hover:border-[#e36520]/20 hover:bg-white/90 hover:shadow-[0_8px_24px_-6px_rgba(227,101,32,0.10)] hover:-translate-y-0.5 transition-all duration-300"
                        >
                            {/* Quotation mark */}
                            <span
                                className="block text-[#e36520]/15 text-4xl leading-none mb-1 select-none"
                                style={{ fontFamily: 'var(--font-newsreader), serif' }}
                            >
                                &ldquo;
                            </span>

                            {/* Prayer text */}
                            <p className="text-[#140d23]/75 text-[13px] leading-relaxed font-body italic mb-4">
                                {prayer.text}
                            </p>

                            {/* Attribution */}
                            <div className="flex items-center justify-between pt-3 border-t border-[#140d23]/5">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#7a6d8e] font-body">
                                    {prayer.from}
                                </span>
                                <span className="text-[9px] text-[#7a6d8e]/50 font-body">
                                    {prayer.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── CTA ─────────────────────────────────────────────── */}
                <div className="text-center">
                    <Link
                        href="/connect"
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
