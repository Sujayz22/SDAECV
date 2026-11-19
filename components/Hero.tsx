'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ServiceTimeSlot, getTimingsSummary } from '@/lib/timings';

interface HeroProps {
    headline?: string;
    subheadline?: string;
    ctaText?: string;
    ctaUrl?: string;
    serviceTimes?: ServiceTimeSlot[];
}

export default function Hero({ headline, subheadline, ctaText, ctaUrl, serviceTimes }: HeroProps) {
    const videoRef = useRef<HTMLDivElement>(null);
    const timings = getTimingsSummary(serviceTimes);

    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;
        const handleScroll = () => {
            const scrollY = window.scrollY;
            el.style.transform = `translateY(${scrollY * 0.4}px)`;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const displayHeadline = headline || "A Place to Belong.";
    const displaySubheadline = subheadline || "A Seventh-day Adventist community in Vellore — gathering every Sabbath for worship, growth, and service.";
    const displayCtaText = ctaText || "Plan Your Visit";
    const displayCtaUrl = ctaUrl || "/visit";

    return (
        <section className="relative w-full min-h-screen bg-[#0b0814] overflow-hidden">

            <div ref={videoRef} className="absolute inset-0 will-change-transform">
                <div
                    className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("/church.jpg")' }}
                />
            </div>

            {/* ── Multi-layer gradients for cinematic depth ────────── */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b0814]/80 via-transparent to-[#0b0814]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0814]/70 via-transparent to-transparent" />
            {/* Vignette */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(11,8,20,0.7) 100%)' }} />

            {/* Subtle grain overlay */}
            <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />

            {/* ── Content ────────────────────────────────────────────── */}
            <div className="relative z-10 min-h-screen flex flex-col mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">

                {/* Top marquee bar */}
                <div className="flex items-center justify-between pt-36 md:pt-40">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-px bg-[#e36520]" />
                        <span className="text-white/35 text-[10px] uppercase tracking-[0.45em] font-body">
                            Seventh-day Adventist
                        </span>
                    </div>
                    <span className="text-white/35 text-[10px] uppercase tracking-[0.45em] font-body hidden sm:block">
                        Vellore, Tamil Nadu
                    </span>
                </div>

                {/* Main hero content — bottom anchored */}
                <div className="flex-1 flex flex-col justify-end pb-12 gap-12">

                    {/* Headline */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">

                        <div className="space-y-0">
                            <h1
                                className="text-white leading-[0.85] tracking-[-0.04em] select-none"
                                style={{
                                    fontFamily: 'var(--font-newsreader), serif',
                                    fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                                    fontWeight: 400
                                }}
                            >
                                {displayHeadline.includes(' Belong') ? (
                                    <>
                                        A Place<br />
                                        <span className="font-light italic" style={{ color: 'rgba(255,255,255,0.2)' }}>
                                            to Belong.
                                        </span>
                                    </>
                                ) : (
                                    displayHeadline
                                )}
                            </h1>
                        </div>

                        {/* Right column — description + CTAs */}
                        <div className="flex flex-col gap-7 lg:max-w-[340px] lg:pb-3 lg:items-end lg:text-right">
                            <p className="text-white/90 font-semibold text-[15px] leading-relaxed font-body">
                                {displaySubheadline}
                            </p>
                            <div className="flex flex-wrap gap-3 lg:justify-end">
                                <Link href={displayCtaUrl} className="group relative overflow-hidden bg-[#e36520] hover:bg-[#c9571a] text-white px-8 py-3.5 rounded-full text-sm font-bold tracking-wider transition-all duration-300 hover:-translate-y-0.5 font-body cursor-pointer shadow-xl shadow-[#e36520]/20">
                                    <span className="relative z-10">{displayCtaText}</span>
                                </Link>
                                <Link href="https://www.youtube.com/@SDAEnglishChurchVellore/streams" target='_blank' className="border border-white/20 text-white px-8 py-3.5 rounded-full text-sm font-bold tracking-wider hover:bg-white/10 transition-all duration-300 backdrop-blur-sm font-body cursor-pointer">
                                    Watch Live
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Info strip */}
                    <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between border-t border-white/[0.08] pt-8">
                        <div className="flex items-center gap-6 md:gap-10 flex-wrap">
                            <div>
                                <p className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.4em] mb-1 font-body">Sabbath Service</p>
                                <p className="text-white text-sm font-semibold font-body">{timings.heroString}</p>
                            </div>
                            <div className="w-px h-6 bg-white/10" />
                            <div>
                                <p className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.4em] mb-1 font-body">Online on</p>
                                <p className="text-white text-sm font-semibold font-body">Youtube</p>
                            </div>
                            <div className="w-px h-6 bg-white/10 hidden md:block" />
                            <div>
                                <p className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.4em] mb-1 font-body">CHURCH</p>
                                <p className="text-white text-sm font-semibold font-body">Online | In-Person</p>
                            </div>
                            <div className="w-px h-6 bg-white/10 hidden lg:block" />
                            <div className="hidden lg:block">
                                <p className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.4em] mb-1 font-body">Location</p>
                                <p className="text-white text-sm font-semibold font-body">Vellore, TN</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-white/25 text-[10px] uppercase tracking-[0.35em] font-body cursor-default hover:text-white/50 transition-colors">
                            <span>Scroll</span>
                            <span className="material-symbols-outlined text-sm animate-bounce" style={{ animationDuration: '2s' }}>south</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
