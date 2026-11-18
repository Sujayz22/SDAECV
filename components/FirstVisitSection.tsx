import Link from 'next/link';

/* ── Visitor highlights ───────────────────────────────────────────────── */
const HIGHLIGHTS = [
    { icon: 'checkroom', text: 'We encourage clothing that is neat, modest, and respectful for a house of worship.' },
    { icon: 'family_restroom', text: 'Programs for children & youth' },
    { icon: 'local_parking', text: 'Free parking available on campus' },
    { icon: 'restaurant', text: 'Fellowship lunch after service' },
];

/* ── Component ────────────────────────────────────────────────────────── */
export default function FirstVisitSection() {
    return (
        <section className="py-24 md:py-32 bg-[#f8f4ef] overflow-hidden relative">
            {/* Decorative elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-[#140d23]/6" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#e36520]/[0.03] rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#5b2d9c]/[0.03] rounded-full blur-[80px] translate-x-1/4 -translate-y-1/4" />
            </div>

            <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* ── Left: Image placeholder ─────────────────────── */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#e36520]/8 via-[#5b2d9c]/5 to-[#fdebd4]/30 border border-[#140d23]/5 shadow-[0_20px_60px_-15px_rgba(20,13,35,0.10)] flex items-center justify-center">
                            {/* Decorative inner elements */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-[#e36520]/8 blur-xl" />
                                <div className="absolute bottom-6 left-8 w-20 h-20 rounded-2xl bg-[#5b2d9c]/6 blur-xl" />
                            </div>
                            <div className="relative text-center px-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#140d23]/5 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <span className="material-symbols-outlined text-3xl text-[#7a6d8e]/40">image</span>
                                </div>
                                <p className="text-[#7a6d8e]/50 text-[10px] font-black uppercase tracking-[0.25em] font-body">
                                    Community Photo
                                </p>
                            </div>

                            {/* Floating badge */}
                            <div className="absolute bottom-5 right-5 bg-white rounded-2xl px-5 py-3 shadow-lg border border-[#140d23]/5 hidden md:flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#e36520]/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[16px] text-[#e36520]">favorite</span>
                                </div>
                                <div>
                                    <p className="text-[#140d23] text-xs font-bold leading-tight">All Are Welcome</p>
                                    <p className="text-[#7a6d8e] text-[10px] font-body">Every Sabbath</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Content ───────────────────────────────── */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-8 bg-[#e36520]" />
                            <span className="text-[#e36520] text-[10px] font-black uppercase tracking-[0.4em] font-body">
                                New Here?
                            </span>
                        </div>

                        <h2
                            className="text-[#140d23] leading-[0.88] tracking-[-0.04em] mb-4"
                            style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 400 }}
                        >
                            First Time<br />
                            <span className="text-[#e36520] italic font-light">Visiting?</span>
                        </h2>

                        <p
                            className="text-[#140d23]/80 text-xl md:text-2xl leading-relaxed mb-4 max-w-lg"
                            style={{ fontFamily: 'var(--font-newsreader), serif', fontWeight: 400 }}
                        >
                            We want you to join us.
                        </p>

                        <p className="text-[#7a6d8e] text-[15px] leading-relaxed font-body max-w-lg mb-8">
                            We know visiting a new church can feel daunting, but at SDAECV, every person is family
                            from the moment they walk in. Here&apos;s what you can expect on your first Saturday with us.
                        </p>

                        {/* Visitor highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mb-8">
                            {HIGHLIGHTS.map((h) => (
                                <div key={h.text} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#5b2d9c]/8 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-[16px] text-[#5b2d9c]">{h.icon}</span>
                                    </div>
                                    <span className="text-[#140d23] text-[13px] font-medium font-body">{h.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/visit"
                                className="inline-flex items-center gap-2.5 rounded-full bg-[#e36520] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#e36520]/25 hover:bg-[#c9571a] hover:-translate-y-0.5 hover:shadow-[#e36520]/35 transition-all duration-300 font-body"
                            >
                                Plan Your Visit
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </Link>
                            <Link
                                href="/connect"
                                className="inline-flex items-center gap-2 rounded-full border-2 border-[#140d23]/10 px-8 py-4 text-sm font-bold text-[#140d23] hover:border-[#5b2d9c] hover:text-[#5b2d9c] transition-all duration-300 font-body hover:-translate-y-0.5"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
