'use client';

import { useState, useRef, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
interface Belief {
  title: string;
  body: string;
}

interface Leader {
  name: string;
  role: string;
  bio: string;
  image?: string | null;
}

interface CommitmentItem {
  icon: string;
  title: string;
  desc: string;
}

interface Commitment {
  pillar: string;
  icon: string;
  color: string;
  accent: string;
  items: CommitmentItem[];
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMMITMENTS DATA
───────────────────────────────────────────────────────────────────────────── */
const commitments: Commitment[] = [
  {
    pillar: 'Spiritual & Biblical Integrity',
    icon: 'menu_book',
    color: '#5b2d9c',
    accent: '#a78bfa',
    items: [
      {
        icon: 'format_quote',
        title: 'Scriptural Authority',
        desc: 'Guided strictly by "Thus saith the Lord" or "It is written".',
      },
      {
        icon: 'balance',
        title: 'Doctrinal Poise',
        desc: 'Honoring the Word of God and the Spirit of Prophecy with deep reverence.',
      },
      {
        icon: 'spa',
        title: 'Simplicity',
        desc: 'Maintaining an authentic beauty in simple worship and modest living.',
      },
    ],
  },
  {
    pillar: 'Community & Evangelism',
    icon: 'groups',
    color: '#e36520',
    accent: '#fbbf72',
    items: [
      {
        icon: 'public',
        title: 'The Great Commission',
        desc: 'Sharing the hope of salvation across diverse linguistic and cultural barriers.',
      },
      {
        icon: 'school',
        title: 'Discipleship',
        desc: 'Equipping young professionals, students, and families to become active servant-leaders.',
      },
      {
        icon: 'favorite',
        title: 'Fellowship',
        desc: 'Fostering an inclusive, supportive spiritual home for local residents and visiting scholars.',
      },
    ],
  },
  {
    pillar: 'Holistic Service',
    icon: 'volunteer_activism',
    color: '#2f557f',
    accent: '#60a5fa',
    items: [
      {
        icon: 'health_and_safety',
        title: 'Health & Wellness',
        desc: 'Promoting a wholesome lifestyle through natural health principles and temperate living.',
      },
      {
        icon: 'handshake',
        title: 'Social Responsibility',
        desc: 'Engaging in practical acts of kindness to uplift the marginalized and vulnerable.',
      },
      {
        icon: 'local_library',
        title: 'Educational Support',
        desc: 'Partnering in spirit with local Adventist Institutions to nurture body, mind, and soul.',
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   EDITORIAL HERO — split-screen text + photo
───────────────────────────────────────────────────────────────────────────── */
export function EditorialHero({
  heroTitle,
  heroSubtitle,
  heroImage
}: {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: any;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const CHURCH_IMG = heroImage?.asset?.url ||
    'https://res.cloudinary.com/ddtlgvixd/image/upload/v1782934838/unnamed_rrb17u.jpg';

  const stats = [
    { value: '28', label: 'Core Beliefs' },
    { value: '60+ Years', label: 'Of growing together, serving Vellore, and sharing hope.' },
  ];

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen bg-[#0c0818] overflow-hidden flex flex-col"
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[55vw] h-[55vw] max-w-[900px] bg-[#5b2d9c]/14 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40vw] h-[40vw] max-w-[700px] bg-[#e36520]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Main grid */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1fr] min-h-screen">

        {/* ── LEFT: Text column ── */}
        <motion.div
          style={{ y: textY }}
          className="flex flex-col justify-center px-8 md:px-14 lg:px-16 xl:px-20 pt-32 pb-16 lg:pt-36"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-px bg-[#e36520]" />
            <span className="text-[#e36520] font-bold tracking-[0.2em] uppercase text-xs">
              SDAECV · Vellore
            </span>
          </motion.div>

          {/* Headline */}
          {(() => {
            const displayTitle = heroTitle || "Faith. Health. Community.";
            const displaySubtitle = heroSubtitle || "A welcoming Seventh-day Adventist community in the heart of Vellore — built on Scripture, shaped by service, and united across cultures.";
            const parts = displayTitle.split('.');
            const p1 = parts[0]?.trim() || "Faith";
            const p2 = parts[1]?.trim() || "Health";
            const p3 = parts[2]?.trim() || "Community";
            return (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="text-white leading-[0.95] tracking-[-0.02em] mb-8"
                  style={{ fontFamily: 'var(--font-newsreader)', fontSize: 'clamp(3.5rem, 7vw, 7rem)' }}
                >
                  {p1}.<br />{' '}
                  <em
                    className="not-italic"
                    style={{
                      background: 'linear-gradient(135deg, #e36520, #f0a060)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {p2}
                  </em>
                  .{parts.length > 2 && p3 ? <><br />{' '}{p3}</> : ''}
                </motion.h1>

                {/* Sub-copy */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-white/50 text-lg leading-relaxed max-w-md mb-12"
                >
                  {displaySubtitle}
                </motion.p>
              </>
            );
          })()}

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-wrap gap-6 mb-14"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <span
                  className="text-white font-bold leading-none mb-1"
                  style={{ fontFamily: 'var(--font-newsreader)', fontSize: '2.4rem' }}
                >
                  {s.value}
                </span>
                <span className="text-white/40 text-xs tracking-widest uppercase">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.78 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#video"
              className="group flex items-center gap-3 bg-white text-[#0c0818] font-bold py-3.5 px-7 rounded-full text-sm transition-all duration-300 hover:bg-[#e36520] hover:text-white hover:shadow-lg hover:shadow-[#e36520]/30"
            >
              <span className="size-7 rounded-full bg-[#5b2d9c]/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                  <path d="M0 0l10 6-10 6V0z" />
                </svg>
              </span>
              Watch Our Story
            </a>
            <a
              href="#story"
              className="text-white/60 hover:text-white font-semibold text-sm transition-colors flex items-center gap-2"
            >
              Explore More
              <span className="material-symbols-outlined text-sm">south</span>
            </a>
          </motion.div>

          {/* Scroll indicator bottom-left */}
          <motion.div style={{ opacity }} className="mt-auto pt-16 hidden lg:flex items-center gap-3">
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent"
            />
            <span className="text-white/30 text-[10px] tracking-[0.25em] uppercase">Scroll</span>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Photo column ── */}
        <motion.div
          style={{ y: photoY }}
          className="relative hidden lg:block overflow-hidden"
        >
          {/* Main photo — fills entire right column */}
          <div className="absolute inset-0">
            <Image
              src={CHURCH_IMG}
              alt="SDAECV congregation in worship"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Left gradient fade to blend with left panel */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0818] via-[#0c0818]/20 to-transparent" />
            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0818]/60 via-transparent to-transparent" />
          </div>

          {/* Floating "Our Identity" badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="absolute top-32 right-8 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 max-w-[200px]"
          >
            <span className="material-symbols-outlined text-[#e36520] text-2xl block mb-2">church</span>
            <p className="text-white font-bold text-sm leading-tight">Our Identity</p>
            <p className="text-white/50 text-xs mt-1 leading-relaxed">A multi-cultural family of faith in Vellore</p>
          </motion.div>

          {/* Floating year badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="absolute bottom-16 left-8 flex items-center gap-3"
          >
            <div className="size-12 rounded-full bg-[#e36520] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">star</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Est. in Vellore</p>
              <p className="text-white/50 text-xs">Decades of faithful ministry</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile hero image (below text on small screens) */}
      <div className="relative lg:hidden w-full h-64 overflow-hidden">
        <Image
          src={CHURCH_IMG}
          alt="SDAECV congregation"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0818] via-transparent to-[#0c0818]/40" />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL-SCALING VIDEO PLAYER
   Starts boxed/small below the hero, grows to fullscreen on scroll
───────────────────────────────────────────────────────────────────────────── */
export function ScrollScaleVideo({ videoId }: { videoId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoActive, setVideoActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Width goes from 55% → 100%; border-radius from 24px → 0
  const widthPercent = useTransform(scrollYProgress, [0, 0.55], [55, 100]);
  const widthPx = useTransform(widthPercent, (v) => `${v}%`);
  const borderRadius = useTransform(scrollYProgress, [0.05, 0.55], [24, 0]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const springConfig = { damping: 22, stiffness: 180, mass: 0.6 };
  const playX = useSpring(0, springConfig);
  const playY = useSpring(0, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (e.clientX - rect.left - cx) * 0.07;
      const dy = (e.clientY - rect.top - cy) * 0.07;
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      playX.set(dx);
      playY.set(dy);
    },
    [playX, playY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    playX.set(0);
    playY.set(0);
  }, [playX, playY]);

  const YT_ID = videoId || '-CwVPt6r7pY';
  const thumbUrl = `https://img.youtube.com/vi/${YT_ID}/maxresdefault.jpg`;

  return (
    <section
      id="video"
      ref={containerRef}
      className="relative bg-[#0c0818] flex flex-col items-center overflow-hidden"
      style={{ paddingTop: '5rem', paddingBottom: '8rem' }}
    >
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-8 z-10 text-center px-6"
      >
        <span className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-white/8 border border-white/12 backdrop-blur-md text-white/80 text-xs font-bold tracking-widest uppercase">
          <span className="size-1.5 rounded-full bg-[#e36520] animate-pulse" />
          Who Are Adventists?
        </span>
        <p className="text-white/35 text-sm mt-3 max-w-sm mx-auto leading-relaxed">
          Scroll to expand · Click to watch
        </p>
      </motion.div>

      {/* The scaling video wrapper */}
      <motion.div
        style={{
          width: widthPx,
          borderRadius,
        }}
        className="relative overflow-hidden cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setVideoActive(true)}
      >
        {/* Drop shadow that fades as video expands */}
        <motion.div
          style={{ opacity: shadowOpacity }}
          className="absolute inset-0 -z-10 shadow-[0_40px_100px_-10px_rgba(91,45,156,0.55)]"
        />

        {videoActive ? (
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="Who Are Adventists?"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative aspect-video w-full group">
            <Image
              src={thumbUrl}
              alt="Who Are Adventists? — YouTube preview"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              priority
            />
            <div className="absolute inset-0 bg-[#0c0818]/45 group-hover:bg-[#0c0818]/25 transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0818]/70 via-transparent to-transparent" />

            {/* Magnetic play button */}
            <motion.div
              style={{ x: playX, y: playY }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.35, 0, 0.35] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-white/25"
                />
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  className="absolute -inset-4 rounded-full bg-white/10"
                />
                <div className="relative size-[5.5rem] rounded-full bg-white flex items-center justify-center shadow-2xl shadow-black/30 group-hover:scale-110 transition-transform duration-300">
                  <svg width="26" height="30" viewBox="0 0 26 30" fill="#5b2d9c">
                    <path d="M0 0l26 15L0 30V0z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Cursor glow */}
            {isHovering && (
              <div
                className="absolute pointer-events-none w-72 h-72 rounded-full blur-3xl"
                style={{
                  left: mousePos.x - 144,
                  top: mousePos.y - 144,
                  background: 'radial-gradient(circle, rgba(91,45,156,0.18) 0%, transparent 70%)',
                  transition: 'none',
                }}
              />
            )}

            {/* Bottom label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <p className="text-white text-lg md:text-2xl font-light max-w-lg leading-snug drop-shadow-lg">
                <span className="font-bold text-[#f5d78e]">Seventh-day Adventists</span>{' '}
                — a global movement united by faith, hope, and wholistic living.
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Width indicator dots */}
      <div className="flex items-center gap-1.5 mt-8 opacity-30">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`rounded-full bg-white ${i === 2 ? 'w-4 h-1.5' : 'size-1.5'}`} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMMITMENTS SECTION — dark, bold, tabbed
───────────────────────────────────────────────────────────────────────────── */
export function CommitmentsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section
      id="commitments"
      ref={ref}
      className="w-full py-28 md:py-36 bg-white relative overflow-hidden"
    >
      {/* Diagonal rule decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#140d23]/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Heading row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[#e36520] font-bold tracking-[0.18em] uppercase text-xs mb-4 block">
              Our Local Commitments
            </span>
            <h2
              className="text-5xl md:text-7xl text-[#0c0818] leading-[0.9] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-newsreader)' }}
            >
              Operational<br />
              <em className="italic text-[#5b2d9c]">Pillars</em>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#7a6d8e] text-lg max-w-sm lg:text-right leading-relaxed"
          >
            Every act of worship, witness, and service flows from these three pillars.
          </motion.p>
        </div>

        {/* Pillar tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex gap-2 mb-10 overflow-x-auto pb-1"
        >
          {commitments.map((c, i) => (
            <button
              key={c.pillar}
              onClick={() => setActiveTab(i)}
              className={`relative flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === i
                ? 'text-white shadow-md'
                : 'bg-[#140d23]/5 text-[#7a6d8e] hover:bg-[#140d23]/10 hover:text-[#140d23]'
                }`}
              style={activeTab === i ? { backgroundColor: c.color } : {}}
            >
              <span className="material-symbols-outlined text-[15px]">{c.icon}</span>
              <span className="hidden sm:inline">{c.pillar}</span>
              <span className="sm:hidden">{c.pillar.split(' ')[0]}</span>
              {activeTab === i && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-xl -z-10"
                  style={{ backgroundColor: c.color }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Active content */}
        <AnimatePresence mode="wait">
          {commitments.map((c, i) =>
            activeTab === i ? (
              <motion.div
                key={c.pillar}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
              >
                {c.items.map((item, j) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: j * 0.08, duration: 0.45 }}
                    className="group relative bg-[#f8f4ef] rounded-2xl p-8 border border-[#140d23]/5 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(20,13,35,0.12)] transition-all duration-400 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Colored top bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                      style={{ backgroundColor: c.color }}
                    />

                    <div
                      className="size-12 rounded-xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${c.color}15` }}
                    >
                      <span
                        className="material-symbols-outlined text-xl"
                        style={{ color: c.color }}
                      >
                        {item.icon}
                      </span>
                    </div>
                    <h3
                      className="text-xl font-bold text-[#0c0818] mb-3 group-hover:text-[#5b2d9c] transition-colors"
                      style={{ fontFamily: 'var(--font-newsreader)' }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[#7a6d8e] text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {/* Bottom accent line */}
        <div className="mt-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-[#5b2d9c]/20 to-transparent" />
          <span
            className="text-[#5b2d9c] text-3xl"
            style={{ fontFamily: 'var(--font-newsreader)' }}
          >
            ✦
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-[#5b2d9c]/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   BELIEFS ACCORDION — dark glass card
───────────────────────────────────────────────────────────────────────────── */
export function BeliefsAccordion({ beliefs }: { beliefs: Belief[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {beliefs.map((belief, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={belief.title}
            className={`rounded-2xl border overflow-hidden transition-all duration-300 ${isOpen
              ? 'bg-white/12 border-white/20'
              : 'bg-white/6 border-white/10 hover:bg-white/9'
              }`}
          >
            <button
              id={`belief-btn-${i}`}
              aria-expanded={isOpen}
              aria-controls={`belief-panel-${i}`}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between p-6 cursor-pointer select-none text-left"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`size-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-[#a78bfa] scale-125' : 'bg-white/30'
                    }`}
                />
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: 'var(--font-newsreader)' }}
                >
                  {belief.title}
                </h3>
              </div>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="material-symbols-outlined text-white/50 flex-shrink-0 ml-4"
              >
                expand_more
              </motion.span>
            </button>
            <div
              id={`belief-panel-${i}`}
              role="region"
              aria-labelledby={`belief-btn-${i}`}
              className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-white/70 text-sm leading-relaxed pl-16">
                  {belief.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LEADER CARD — 3D tilt + stagger
───────────────────────────────────────────────────────────────────────────── */
function LeaderCard({ leader, index }: { leader: Leader; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 16;
    setTilt({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }); }}
      style={{
        perspective: 1200,
        transform: isHovered
          ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(8px)`
          : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.6s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className="group relative cursor-default"
    >
      {/* Photo */}
      <div className="relative overflow-hidden rounded-2xl mb-5 shadow-lg aspect-[3/4]">
        {/* Color overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-500"
          style={{ background: 'linear-gradient(160deg, #5b2d9c22, #2f557f22)' }}
        />
        {leader.image ? (
          <Image
            src={leader.image}
            alt={`Portrait of ${leader.name}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#5b2d9c]/10 via-[#f8f4ef] to-[#2f557f]/10 flex flex-col items-center justify-center transition-transform duration-700 group-hover:scale-[1.06]">
            <div className="size-20 rounded-full bg-white/60 border border-[#5b2d9c]/10 flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-4xl text-[#5b2d9c]/40 select-none">
                person
              </span>
            </div>
            <span className="mt-4 text-[10px] font-bold tracking-[0.2em] text-[#5b2d9c]/40 uppercase select-none">
              {leader.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 3)}
            </span>
          </div>
        )}

        {/* Glare effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: isHovered
              ? `radial-gradient(ellipse at ${50 - tilt.y * 2.5}% ${50 - tilt.x * 2.5}%, rgba(255,255,255,0.1) 0%, transparent 65%)`
              : 'none',
          }}
        />

        {/* Email overlay */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350 z-20">
          <a
            href="mailto:info@sdaecv.org"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 bg-white text-[#5b2d9c] hover:bg-[#5b2d9c] hover:text-white font-bold text-xs py-2.5 px-5 rounded-full shadow-xl transition-all duration-250"
          >
            <span className="material-symbols-outlined text-[14px]">mail</span>
            Get in touch
          </a>
        </div>
      </div>

      <h3
        className="text-xl font-bold text-[#0c0818] group-hover:text-[#5b2d9c] transition-colors duration-300 mb-1"
        style={{ fontFamily: 'var(--font-newsreader)' }}
      >
        {leader.name}
      </h3>
      <p className="text-[#5b2d9c]/70 font-semibold text-xs mb-2.5 uppercase tracking-widest">
        {leader.role}
      </p>
      <p className="text-[#7a6d8e] text-sm leading-relaxed">{leader.bio}</p>
    </motion.div>
  );
}

export function LeadershipSection({ leaders }: { leaders: Leader[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(ref, { once: true, margin: '-80px' });

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="team" ref={ref} className="w-full bg-[#f8f4ef] py-28 md:py-36 overflow-hidden relative">
      {/* Background dots */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #140d23 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={headingInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <span className="text-[#e36520] font-bold tracking-[0.18em] uppercase text-xs mb-4 block">
              Our Servant Leaders
            </span>
            <h2
              className="text-5xl md:text-7xl text-[#0c0818] leading-[0.92] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-newsreader)' }}
            >
              Meet the<br />
              <em className="italic text-[#5b2d9c]">Team</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={headingInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-xs flex flex-col gap-6"
          >
            <p className="text-[#7a6d8e] text-lg leading-relaxed">
              Pastors and elders who lead with a passion for ministry and a heart for Vellore.
            </p>
            <div className="flex items-center justify-between">
              <a
                href="mailto:info@sdaecv.org"
                className="inline-flex items-center gap-2 text-[#5b2d9c] font-bold text-sm hover:text-[#e36520] transition-colors"
              >
                Contact a Leader
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
              {/* Carousel controls */}
              <div className="flex gap-2">
                <button
                  onClick={() => scroll('left')}
                  aria-label="Previous Team Members"
                  className="size-10 rounded-full border border-[#140d23]/10 hover:border-[#5b2d9c] text-[#140d23] hover:text-[#5b2d9c] hover:bg-[#5b2d9c]/5 flex items-center justify-center transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button
                  onClick={() => scroll('right')}
                  aria-label="Next Team Members"
                  className="size-10 rounded-full border border-[#140d23]/10 hover:border-[#5b2d9c] text-[#140d23] hover:text-[#5b2d9c] hover:bg-[#5b2d9c]/5 flex items-center justify-center transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <style>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div
            ref={scrollContainerRef}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            className="no-scrollbar flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
          >
            {leaders.map((leader, i) => (
              <div
                key={leader.name}
                className="snap-start shrink-0 w-full sm:w-[calc((100%-32px)/2)] lg:w-[calc((100%-96px)/4)]"
              >
                <LeaderCard leader={leader} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────────────────── */
export default function AboutClient({ beliefs, leaders }: { beliefs: Belief[]; leaders: Leader[] }) {
  return (
    <>
      <EditorialHero />
      <ScrollScaleVideo />
      <CommitmentsSection />
      <LeadershipSection leaders={leaders} />
    </>
  );
}
