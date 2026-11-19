'use client';

import { useRef } from 'react';

const PILLARS = [
    {
        num: '01',
        label: 'Connect',
        desc: 'Build meaningful relationships in community groups and through shared service. Life is simply better when we live it together.',
        accent: '#e36520',
        gradient: 'from-[#e36520]/20 to-transparent',
        icon: 'groups',
        link: 'Find a Group',
    },
    {
        num: '02',
        label: 'Grow',
        desc: 'Deepen your faith through Sabbath School, biblical teaching, and personal devotion. There is always more to discover.',
        accent: '#5b2d9c',
        gradient: 'from-[#5b2d9c]/20 to-transparent',
        icon: 'local_library',
        link: 'Start Learning',
    },
    {
        num: '03',
        label: 'Serve',
        desc: 'Use your gifts in Vellore and the world. Through Outreach ministry, Singing Band and Health Ministry — everyone has a meaningful part.',
        accent: '#448d21',
        gradient: 'from-[#448d21]/20 to-transparent',
        icon: 'volunteer_activism',
        link: 'Join a Team',
    },
];

export default function MissionSection() {
    return (
        <section className="bg-[#140d23] py-32 md:py-44 overflow-hidden relative">

            {/* Ambient glow orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#5b2d9c]/10 blur-[120px]" />
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#e36520]/8 blur-[100px]" />
            </div>

            <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20 relative">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-24 md:mb-32">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-8 bg-[#e36520]" />
                            <span className="text-[#e36520] text-[10px] font-black uppercase tracking-[0.4em] font-body">Our Purpose</span>
                        </div>
                        <h2
                            className="text-white leading-[0.85] tracking-[-0.04em]"
                            style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(3.5rem, 9vw, 8rem)', fontWeight: 400 }}
                        >
                            We exist<br />
                            <span className="text-white/25 font-light italic">for people.</span>
                        </h2>
                    </div>
                    <p className="text-white/40 text-base leading-relaxed max-w-xs font-body md:text-right md:pb-4">
                        Three commitments that shape how we live, grow, and serve as a community of faith.
                    </p>
                </div>

                {/* Pillar cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PILLARS.map((p, i) => (
                        <div
                            key={p.num}
                            className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 md:p-10 cursor-pointer hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-500"
                        >
                            {/* Card glow on hover */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                            />

                            {/* Number */}
                            <div className="flex items-start justify-between mb-12">
                                <span
                                    className="text-8xl font-black font-display leading-none tabular-nums"
                                    style={{ color: p.accent + '20' }}
                                >
                                    {p.num}
                                </span>
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1"
                                    style={{ background: p.accent + '15', border: `1px solid ${p.accent}25` }}
                                >
                                    <span className="material-symbols-outlined text-[22px]" style={{ color: p.accent }}>{p.icon}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 space-y-4">
                                <h3
                                    className="text-white text-4xl font-medium tracking-[-0.02em] transition-colors duration-300"
                                    style={{ fontFamily: 'var(--font-newsreader), serif' }}
                                >
                                    {p.label}
                                </h3>
                                <p className="text-white/45 text-[15px] leading-relaxed font-body">
                                    {p.desc}
                                </p>
                            </div>

                            {/* Link
                            <div className="mt-10 relative z-10">
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-2 text-sm font-bold font-body uppercase tracking-[0.15em] transition-all duration-300 group-hover:gap-3"
                                    style={{ color: p.accent }}
                                >
                                    {p.link}
                                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                                </a>
                            </div> */}

                            {/* Bottom accent line */}
                            <div
                                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700"
                                style={{ background: `linear-gradient(90deg, ${p.accent}, transparent)` }}
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
