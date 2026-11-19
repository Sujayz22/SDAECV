import Link from 'next/link';
import Image from 'next/image';
import { ServiceTimeSlot, getTimingsSummary } from '@/lib/timings';

const NAV_COLUMNS = [
    {
        title: 'About',
        links: [
            { label: 'Our Story', href: '/about' },
            { label: 'Our Beliefs', href: '/about' },
            { label: 'Our History', href: '/history' },
            { label: 'Location & Hours', href: '/visit' },
        ],
    },
    {
        title: 'Ministry',
        links: [
            { label: 'Youth (AY)', href: '/connect' },
            { label: 'Sabbath School', href: '/connect' },
            { label: 'Dorcas Society', href: '/connect' },
            { label: 'Health Ministry', href: '/connect' },
        ],
    },
    {
        title: 'Connect',
        links: [
            { label: 'Events', href: '/events' },
            { label: 'Give', href: '/give' },
            { label: 'Prayer Request', href: '/connect' },
            { label: 'Contact Us', href: '/connect' },
        ],
    },
    {
        title: 'Media',
        links: [
            { label: 'Church Blog', href: '/blog' },
            { label: 'Videos Archive', href: '/media/videos' },
            { label: 'Service Streams', href: '/media/videos' },
            { label: 'Resources & Docs', href: '/resources' },
        ],
    },
];

export default function FooterContent({ serviceTimes }: { serviceTimes?: ServiceTimeSlot[] }) {
    const timings = getTimingsSummary(serviceTimes);

    return (
        <div className="bg-[#140d23] text-white flex flex-col w-full">

            {/* ── Statement Section ─────────────────────────────── */}
            <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-20 pt-10 sm:pt-14 pb-8 sm:pb-10">

                {/* Logo row — sits above on mobile, inline on lg */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">

                    {/* Left: Logo + Headline */}
                    <div className="flex flex-col gap-5 sm:gap-6">

                        {/* Logo */}
                        <Image
                            src="/logo.png"
                            alt="SDAECV — Seventh Day Adventist English Church, Vellore"
                            width={180}
                            height={96}
                            className="object-contain w-[140px] sm:w-[180px] h-auto"
                            priority={false}
                        />

                        {/* Orange rule + church name */}
                        <div className="flex items-center gap-3">
                            <div className="h-px w-8 bg-[#e36520] flex-shrink-0" />
                            <span className="text-[#e36520] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] font-body">
                                SDA English Church · Vellore
                            </span>
                        </div>

                        {/* Headline — smaller clamp on mobile */}
                        <h2
                            className="font-medium leading-[0.88] tracking-[-0.03em]"
                            style={{
                                fontFamily: 'var(--font-newsreader), serif',
                                fontSize: 'clamp(2rem, 6vw, 5.5rem)',
                            }}
                        >
                            Where Faith<br />
                            <span className="text-white/30 font-light italic">Finds Home.</span>
                        </h2>

                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-body">
                            Gathering every Sabbath in worship, fellowship, and service —
                            a community rooted in the Word and the love of Christ.
                        </p>
                    </div>

                    {/* Right: Service grid + CTA */}
                    <div className="flex flex-col gap-6 lg:items-end lg:text-right flex-shrink-0">
                        {/* Service times — 2×2 grid, tighter on mobile */}
                        <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-4 sm:gap-y-5">
                            {[
                                { label: 'AY Service', line1: timings.ay.day, line2: timings.ay.timeOnly },
                                { label: 'Online Service', line1: 'YouTube Live', line2: 'Every Sabbath' },
                                { label: 'Sabbath School', line1: timings.sabbathSchool.day, line2: timings.sabbathSchool.timeOnly },
                                { label: 'Location', line1: 'Vellore', line2: 'Tamil Nadu, India' },
                            ].map((item) => (
                                <div key={item.label}>
                                    <p className="text-[#e36520] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] font-body mb-1.5">{item.label}</p>
                                    <p className="text-white text-xs sm:text-sm font-semibold font-body">{item.line1}</p>
                                    <p className="text-gray-500 text-xs sm:text-sm font-body">{item.line2}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <Link
                            href="/visit"
                            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#e36520] to-[#5b2d9c] px-6 sm:px-8 py-3 sm:py-4 text-sm font-bold font-body tracking-wider text-white shadow-xl shadow-[#e36520]/10 hover:shadow-[#5b2d9c]/25 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Plan Your Visit
                                <span className="material-symbols-outlined text-[16px] sm:text-[18px] group-hover:translate-x-1.5 transition-transform duration-300">arrow_forward</span>
                            </span>
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#5b2d9c] to-[#e36520] transition-transform duration-500 group-hover:translate-x-0" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Divider ────────────────────────────────────────── */}
            <div className="border-t border-white/[0.07] mx-5 sm:mx-8 md:mx-12 lg:mx-20" />

            {/* ── Navigation columns ─────────────────────────────── */}
            <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-20 py-7 sm:py-10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
                    {NAV_COLUMNS.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-[#e36520] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] font-body mb-3 sm:mb-4">
                                {col.title}
                            </h4>
                            <ul className="space-y-1.5 sm:space-y-2">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="footer-link text-xs sm:text-sm text-gray-500 hover:text-white transition-colors duration-200 font-body"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Divider ────────────────────────────────────────── */}
            <div className="border-t border-white/[0.07] mx-5 sm:mx-8 md:mx-12 lg:mx-20" />

            {/* ── Bottom bar ─────────────────────────────────────── */}
            <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-20 py-4 sm:py-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">

                    {/* Social icons */}
                    <div className="flex items-center gap-2.5 sm:gap-3.5 order-2 sm:order-1">
                        {[
                            { label: 'Website', icon: 'public' },
                            { label: 'Instagram', icon: 'photo_camera' },
                            { label: 'YouTube', icon: 'smart_display' },
                        ].map((s) => (
                            <a
                                key={s.label}
                                href="#"
                                aria-label={s.label}
                                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-gray-400 hover:text-white hover:border-[#e36520] hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <span className="material-symbols-outlined text-[15px] sm:text-[18px]">{s.icon}</span>
                            </a>
                        ))}
                    </div>

                    {/* Copyright */}
                    <p
                        className="text-gray-600 text-[9px] sm:text-[11px] font-body uppercase tracking-[0.15em] sm:tracking-[0.2em] order-1 sm:order-2 text-center"
                        suppressHydrationWarning
                    >
                        &copy; {new Date().getFullYear()} &nbsp;·&nbsp; SDA English Church, Vellore &nbsp;·&nbsp; All rights reserved.
                    </p>

                    {/* Legal */}
                    <div className="flex items-center gap-4 sm:gap-6 order-3 text-gray-600 text-[9px] sm:text-[11px] font-body uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                        <a href="#" className="footer-link hover:text-gray-300 transition-colors duration-200">Privacy</a>
                        <a href="#" className="footer-link hover:text-gray-300 transition-colors duration-200">Terms</a>
                    </div>
                </div>
            </div>

        </div>
    );
}
