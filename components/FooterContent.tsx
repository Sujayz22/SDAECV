import Link from 'next/link';
import Image from 'next/image';
import { ServiceTimeSlot, getTimingsSummary } from '@/lib/timings';

// Brand icons for bottom footer
const InstagramIcon = ({ className = 'size-4' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const YoutubeIcon = ({ className = 'size-4' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.109-2.108C19.53 3.53 12 3.53 12 3.53s-7.53 0-9.388.525a3.003 3.003 0 0 0-2.109 2.108C0 8.02 0 12 0 12s0 3.98.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.857.525 9.387.525 9.387.525s7.53 0 9.388-.525a3.003 3.003 0 0 0 2.11-2.108C24 15.98 24 12 24 12s0-3.98-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const WebsiteIcon = ({ className = 'size-4' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);

const SOCIAL_LINKS = [
    {
        label: 'Website',
        Icon: WebsiteIcon,
        url: '/',
        external: false,
    },
    {
        label: 'Instagram',
        Icon: InstagramIcon,
        url: 'https://www.instagram.com/sdaecv_official?gwpx=dm9pOGt2dG4xcHpu',
        external: true,
    },
    {
        label: 'YouTube',
        Icon: YoutubeIcon,
        url: 'https://www.youtube.com/@sdaenglishchurchvellore',
        external: true,
    },
];

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
            { label: 'Singing Band', href: '/connect' },
            { label: 'Outreach Ministry', href: '/connect' },
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
                        {SOCIAL_LINKS.map((s) => {
                            const Icon = s.Icon;
                            return (
                                <a
                                    key={s.label}
                                    href={s.url}
                                    target={s.external ? '_blank' : undefined}
                                    rel={s.external ? 'noopener noreferrer' : undefined}
                                    aria-label={s.label}
                                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-gray-400 hover:text-white hover:border-[#e36520] hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </a>
                            );
                        })}
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
                        <Link href="/privacy" className="footer-link hover:text-gray-300 transition-colors duration-200">Privacy</Link>
                        <Link href="/terms" className="footer-link hover:text-gray-300 transition-colors duration-200">Terms</Link>
                    </div>
                </div>
            </div>

        </div>
    );
}
