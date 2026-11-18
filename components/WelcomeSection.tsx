import Link from 'next/link';

interface WelcomeSectionProps {
    welcomeTitle?: string;
    welcomeSubtitle?: string;
    welcomeDescription?: string;
    welcomeImage?: any;
    serviceTimes?: { label: string; time: string; detail?: string }[];
}

/* ── Service schedule fallback data ────────────────────────────────────────── */
const FALLBACK_SERVICES = [
    { icon: 'menu_book', name: 'Sabbath School', day: 'Saturday', time: '8:45 AM', accent: '#5b2d9c' },
    { icon: 'church', name: 'Divine Service', day: 'Saturday', time: '10:30 AM', accent: '#e36520' },
    { icon: 'music_note', name: 'Singing Band/Outreach', day: 'Saturday', time: '3:30 PM', accent: '#3e8391' },
    { icon: 'wb_twilight', name: 'Vespers', day: 'Saturday', time: '5:00 PM', accent: '#2f557f' },
    { icon: 'groups', name: 'AY Service', day: 'Friday', time: '7:30 PM', accent: '#448d21' },
    { icon: 'volunteer_activism', name: 'Prayer Meeting', day: 'Wednesday', time: '7:00 PM', accent: '#7a6d8e' },
];

function getServiceIconAndAccent(label: string) {
    const l = label.toLowerCase();
    if (l.includes('school')) return { icon: 'menu_book', accent: '#5b2d9c' };
    if (l.includes('divine') || l.includes('worship') || l.includes('service')) {
        if (l.includes('ay')) return { icon: 'groups', accent: '#448d21' };
        return { icon: 'church', accent: '#e36520' };
    }
    if (l.includes('singing') || l.includes('outreach')) return { icon: 'music_note', accent: '#3e8391' };
    if (l.includes('vespers')) return { icon: 'wb_twilight', accent: '#2f557f' };
    if (l.includes('ay')) return { icon: 'groups', accent: '#448d21' };
    if (l.includes('prayer')) return { icon: 'volunteer_activism', accent: '#7a6d8e' };
    return { icon: 'schedule', accent: '#2f557f' };
}

/* ── Component ────────────────────────────────────────────────────────── */
export default function WelcomeSection({
    welcomeTitle,
    welcomeSubtitle,
    welcomeDescription,
    welcomeImage,
    serviceTimes
}: WelcomeSectionProps) {
    const displayTitle = welcomeTitle || "Join Us This";
    const displaySubtitle = welcomeSubtitle || "Sabbath";
    const displayDescription = welcomeDescription || "Whether you're a lifelong Adventist or stepping into a church for the first time, you'll find a warm, welcoming community at SDAECV. Our doors are open every Saturday for worship, fellowship, and spiritual growth in the heart of Vellore.";

    // Parse Sanity service times or use fallback
    const resolvedServices = serviceTimes && serviceTimes.length > 0
        ? serviceTimes.map((s) => {
            const { icon, accent } = getServiceIconAndAccent(s.label);
            // Split day and time from 'Saturday · 8:45 AM'
            const parts = s.time.split(' · ');
            const day = parts[0] || 'Saturday';
            const time = parts[1] || s.time;
            return {
                icon,
                name: s.label,
                day,
                time,
                accent
            };
        })
        : FALLBACK_SERVICES;

    const imageUrl = welcomeImage?.asset?.url;

    return (
        <section className="py-24 md:py-32 bg-[#f8f4ef] overflow-hidden relative">
            {/* Decorative elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-[#140d23]/6" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5b2d9c]/[0.03] rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4" />
            </div>

            <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* ── Left: Content ────────────────────────────────── */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-8 bg-[#e36520]" />
                            <span className="text-[#e36520] text-[10px] font-black uppercase tracking-[0.4em] font-body">
                                Welcome Home
                            </span>
                        </div>

                        <h2
                            className="text-[#140d23] leading-[0.88] tracking-[-0.04em] mb-6"
                            style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 400 }}
                        >
                            {displayTitle}<br />
                            <span className="text-[#5b2d9c] italic font-light">{displaySubtitle}</span>
                        </h2>

                        <p className="text-[#7a6d8e] text-[15px] leading-relaxed font-body max-w-lg mb-10">
                            {displayDescription}
                        </p>

                        {/* Service times grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                            {resolvedServices.map((s) => (
                                <div
                                    key={s.name}
                                    className="group flex items-center gap-4 rounded-2xl border border-[#140d23]/5 bg-white p-4 hover:border-[#140d23]/10 hover:shadow-[0_6px_20px_-4px_rgba(20,13,35,0.06)] hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                                        style={{ background: s.accent + '12', border: `1px solid ${s.accent}20` }}
                                    >
                                        <span className="material-symbols-outlined text-[18px]" style={{ color: s.accent }}>
                                            {s.icon}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[#140d23] text-sm font-bold leading-tight">{s.name}</p>
                                        <p className="text-[#7a6d8e] text-[11px] font-body mt-0.5">
                                            {s.day} · <span className="font-bold" style={{ color: s.accent }}>{s.time}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick CTA */}
                        <div className="flex flex-wrap gap-3 mt-8">
                            <Link
                                href="/visit"
                                className="inline-flex items-center gap-2 rounded-full bg-[#5b2d9c] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5b2d9c]/20 hover:bg-[#4b2088] hover:-translate-y-0.5 transition-all duration-300 font-body"
                            >
                                <span className="material-symbols-outlined text-[16px]">directions</span>
                                Plan Your Visit
                            </Link>
                            <Link
                                href="/live"
                                className="inline-flex items-center gap-2 rounded-full border border-[#140d23]/10 px-7 py-3.5 text-sm font-bold text-[#140d23] hover:border-[#5b2d9c]/30 hover:text-[#5b2d9c] hover:bg-[#5b2d9c]/[0.03] transition-all duration-300 font-body"
                            >
                                <span className="material-symbols-outlined text-[16px]">smart_display</span>
                                Watch Online
                            </Link>
                        </div>
                    </div>

                    {/* ── Right: Image ────────────────────── */}
                    <div className="lg:col-span-5">
                        {imageUrl ? (
                            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-[#140d23]/5 shadow-[0_20px_60px_-15px_rgba(20,13,35,0.10)]">
                                <img
                                    src={imageUrl}
                                    alt="SDAECV Church Sanctuary"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#5b2d9c]/8 via-[#e36520]/5 to-[#448d21]/5 border border-[#140d23]/5 shadow-[0_20px_60px_-15px_rgba(20,13,35,0.10)] flex items-center justify-center">
                                {/* Decorative inner elements */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute top-6 left-6 w-20 h-20 rounded-2xl bg-[#5b2d9c]/8 blur-xl" />
                                    <div className="absolute bottom-10 right-6 w-24 h-24 rounded-full bg-[#e36520]/8 blur-xl" />
                                </div>
                                <div className="relative text-center px-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#140d23]/5 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <span className="material-symbols-outlined text-3xl text-[#7a6d8e]/40">image</span>
                                    </div>
                                    <p className="text-[#7a6d8e]/50 text-[10px] font-black uppercase tracking-[0.25em] font-body">
                                        Church Photo
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
