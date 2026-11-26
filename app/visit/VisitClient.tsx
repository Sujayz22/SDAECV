'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ServiceTimeSlot, getTimingsSummary, parseServiceTime, findServiceSlot } from '@/lib/timings';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';

// ─── ANIMATION VARIANTS ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const clipReveal = {
  hidden: { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
  visible: (i = 0) => ({
    clipPath: 'inset(0% 0 0 0)',
    opacity: 1,
    transition: { duration: 1.1, delay: i * 0.12, ease: [0.76, 0, 0.24, 1] as const },
  }),
};

const lineGrow = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1, opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// ─── DATA ──────────────────────────────────────────────────────────────────────

const EXPECT_CARDS = [
  {
    icon: 'waving_hand',
    step: '01',
    title: 'Arrive',
    color: '#e36520',
    body: 'A greeter will welcome you at the door. No registration needed — just walk in. You\'ll receive a bulletin and be guided to a comfortable seat. Parking is free on campus.',
  },
  {
    icon: 'music_note',
    step: '02',
    title: 'Worship',
    color: '#5b2d9c',
    body: 'Our service blends traditional hymns with contemporary praise. Expect Scripture readings, a thoughtful sermon, and a warm community atmosphere.',
  },
  {
    icon: 'restaurant',
    step: '03',
    title: 'Connect',
    color: '#448d21',
    body: 'After service, everyone is invited to a fellowship lunch. It\'s the best way to meet members, share a meal, and feel at home. Children and youth have their own dedicated programmes running simultaneously.',
  },
];

const SCHEDULE = [
  {
    label: 'Sabbath School',
    time: '8:30 AM',
    detail: 'Bible study for all age groups. Interactive discussions, a deeply welcoming environment.',
    icon: 'book_4',
  },
  {
    label: 'Church at Study',
    time: '9:15 AM',
    detail: 'A weekly time of inspiring songs, global mission reports, and special feature talks.',
    icon: 'menu_book',
  },
  {
    label: 'Divine Service',
    time: '10:45 AM',
    detail: 'Our main worship service. Music, Scripture, and a sermon centred on the Gospel.',
    icon: 'church',
  },
  {
    label: 'Online Stream',
    time: 'Every Sabbath',
    detail: 'Can\'t make it in person? Watch the full service live from wherever you are.',
    icon: 'live_tv',
  },
  {
    label: 'Youth & Children',
    time: 'During Service',
    detail: 'Age-appropriate programmes running in parallel with the main worship service.',
    icon: 'family_restroom',
  },
];

const FAQS = [
  {
    q: 'What should I wear?',
    a: 'Come as you are. While many members dress formally, there is absolutely no dress code. We care far more about you being present than what you\'re wearing.',
  },
  {
    q: 'Do I need to bring anything?',
    a: 'Just yourself! We\'ll provide a bulletin at the door. If you\'d like to follow along with Scripture, you\'re welcome to bring a Bible — or use your phone.',
  },
  {
    q: 'Is there a programme for children?',
    a: 'Yes! We have a dedicated Sabbath School for children and youth that runs at the same time as the main service. They are in safe hands with trained volunteers.',
  },
  {
    q: 'Do I have to give an offering?',
    a: 'Absolutely not. The offering is strictly for those who are members and wish to participate. There is no pressure, no plate passed to visitors.',
  },
  {
    q: 'What language is the service in?',
    a: 'The primary service is in English. We also have resources available in Tamil. Our congregation includes members from diverse linguistic backgrounds.',
  },
  {
    q: 'Is parking available?',
    a: 'Yes, free parking is available on the church campus. If you\'re arriving by auto-rickshaw or bus, the campus is well-known locally — simply ask for the "SDA Church, Bagayam".',
  },
];

// ─── HERO ─────────────────────────────────────────────────────────────────────

function HeroSection({ timings }: { timings: ReturnType<typeof getTimingsSummary> }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 240]);

  return (
    <section className="relative w-full min-h-screen bg-[#0b0814] overflow-hidden" ref={heroRef}>
      {/* Parallax Background */}
      <motion.div
        ref={bgRef}
        style={{ y }}
        className="absolute inset-0 will-change-transform"
      >
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/church.jpg")' }}
        />
      </motion.div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0814]/85 via-[#0b0814]/40 to-[#0b0814]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0814]/70 via-transparent to-transparent" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(11,8,20,0.75) 100%)' }} />
      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">

        {/* Top label */}
        <div className="flex items-center justify-between pt-36 md:pt-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-[#e36520]" />
            <span className="text-white/35 text-[10px] uppercase tracking-[0.45em] font-body">Plan Your Visit</span>
          </div>
          <span className="text-white/35 text-[10px] uppercase tracking-[0.45em] font-body hidden sm:block">Vellore, Tamil Nadu</span>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-end pb-12 gap-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">

            {/* Headline */}
            <div className="space-y-0 overflow-hidden">
              <motion.h1
                initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
                animate={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                className="text-white leading-[0.82] tracking-[-0.04em] select-none"
                style={{
                  fontFamily: 'var(--font-newsreader), serif',
                  fontSize: 'clamp(4rem, 12vw, 11rem)',
                  fontWeight: 400,
                }}
              >
                You Are<br />
                <span className="font-light italic" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Welcome Here.
                </span>
              </motion.h1>
            </div>

            {/* Right column */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-7 lg:max-w-[360px] lg:pb-3 lg:items-end lg:text-right"
            >
              <p className="text-white/90 text-[15px] leading-relaxed font-body">
                Whatever your story, wherever you&apos;ve been — there is a seat for you at our Church every Sabbath.
              </p>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a
                  href="https://maps.app.goo.gl/wqVwkb6SpbF9aUBS8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-[#e36520] hover:bg-[#c9571a] text-white px-8 py-3.5 rounded-full text-sm font-bold tracking-wider transition-all duration-300 hover:-translate-y-0.5 font-body cursor-pointer shadow-xl shadow-[#e36520]/20 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  Get Directions
                </a>
                <button onClick={() => window.open('https://www.youtube.com/@SDAEnglishChurchVellore/streams', '_blank')} className="border border-white/20 text-white px-8 py-3.5 rounded-full text-sm font-bold tracking-wider hover:bg-white/10 transition-all duration-300 backdrop-blur-sm font-body cursor-pointer flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">live_tv</span>
                  Watch Live
                </button>
              </div>
            </motion.div>
          </div>

          {/* Info strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between border-t border-white/[0.08] pt-8"
          >
            <div className="flex items-center gap-6 md:gap-10 flex-wrap">
              {[
                { label: 'AY Service', value: `${timings.ay.day} · ${timings.ay.timeOnly}` },
                { label: 'Sabbath School', value: `${timings.sabbathSchool.day} · ${timings.sabbathSchool.timeOnly}` },
                { label: 'Divine Worship', value: timings.divineService.timeOnly },
                { label: 'Online Stream', value: 'Every Sabbath' },
                { label: 'Location', value: 'SDA English Church, Otteri Rd, Bagayam, Vellore' },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center gap-6">
                  {i > 0 && <div className="w-px h-6 bg-white/10 hidden sm:block" />}
                  <div>
                    <p className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.4em] mb-1 font-body">{item.label}</p>
                    <p className="text-white text-sm font-semibold font-body">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-white/25 text-[10px] uppercase tracking-[0.35em] font-body">
              <span>Scroll</span>
              <span className="material-symbols-outlined text-sm animate-bounce" style={{ animationDuration: '2s' }}>south</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── WHAT TO EXPECT ────────────────────────────────────────────────────────────

function ExpectSection({ expectCards }: { expectCards: any[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-28 md:py-40 bg-[#f8f4ef] relative overflow-hidden">
      {/* Subtle decorative blurs */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-[#e36520]/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-[#5b2d9c]/[0.04] blur-[100px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">

        {/* Section header */}
        <div className="mb-20">
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#e36520]" />
            <span className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.45em] font-body">Your First Sabbath</span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              variants={clipReveal} custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              className="text-[#140d23] leading-[0.88] tracking-[-0.04em]"
              style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', fontWeight: 400 }}
            >
              What to<br />
              <span className="italic font-light text-[#140d23]/25">Expect</span>
            </motion.h2>
          </div>

          <motion.div variants={lineGrow} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="h-px origin-left mt-8 max-w-xs" style={{ background: 'linear-gradient(to right, #e36520, transparent)' }} />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {expectCards.map((card, i) => (
            <motion.div
              key={card.step}
              variants={fadeUp} custom={i + 2} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
              className="group relative rounded-3xl border border-[#140d23]/6 bg-white p-8 md:p-10 shadow-[0_8px_40px_-10px_rgba(20,13,35,0.08)] hover:shadow-[0_20px_60px_-10px_rgba(20,13,35,0.14)] transition-shadow duration-500 cursor-default overflow-hidden"
            >
              {/* Hover radial */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                style={{ background: `radial-gradient(circle at 30% 0%, ${card.color}10, transparent 60%)` }}
              />

              {/* Step label */}
              <div className="flex items-center justify-between mb-8">
                <span
                  className="text-[9px] font-black uppercase tracking-[0.4em] font-body"
                  style={{ color: card.color }}
                >
                  Step {card.step}
                </span>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${card.color}12` }}
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ color: card.color }}
                  >
                    {card.icon}
                  </span>
                </div>
              </div>

              <h3
                className="text-[#140d23] mb-4 leading-tight"
                style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 400 }}
              >
                {card.title}
              </h3>

              <p className="text-[#7a6d8e] text-[14px] leading-[1.85] font-body">
                {card.body}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500 rounded-b-3xl"
                style={{ background: card.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICE TIMES ─────────────────────────────────────────────────────────────

function ScheduleSection({ schedule }: { schedule: any[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-28 md:py-40 bg-[#140d23] relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-[#5b2d9c]/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#e36520]/6 blur-[120px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-start">
          {/* Left: header */}
          <div className="lg:w-[380px] flex-shrink-0">
            <motion.div variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#e36520]" />
              <span className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.45em] font-body">Every Saturday</span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h2
                variants={clipReveal} custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                className="text-white leading-[0.88] tracking-[-0.04em] mb-8"
                style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 400 }}
              >
                Join Us<br />
                <span className="font-light italic text-white/60">This Sabbath</span>
              </motion.h2>
            </div>

            <motion.p variants={fadeUp} custom={3} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="text-white/60 text-[14px] leading-[1.9] font-body mb-10">
              We gather every Saturday morning. Whether you&apos;re early for Sabbath School or joining us for the main service — you are exactly on time.
            </motion.p>

            <motion.div variants={fadeUp} custom={4} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
              <Link
                href="/connect"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#e36520] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#e36520]/25 hover:bg-[#c9571a] hover:-translate-y-0.5 transition-all duration-300 font-body"
              >
                Reach Out First
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </motion.div>
          </div>

          {/* Right: schedule cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {schedule.map((item, i) => (
              <motion.div
                key={item.label}
                variants={fadeUp} custom={i + 2} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                className="group relative rounded-2xl border border-white/6 bg-white/[0.03] hover:bg-white/[0.06] p-7 transition-all duration-300 overflow-hidden cursor-default"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(227,101,32,0.12), transparent 70%)' }} />

                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[#e36520]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl text-[#e36520]">{item.icon}</span>
                  </div>
                  <span
                    className="font-black tracking-[-0.02em]"
                    style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: '1.75rem', color: 'rgba(243, 241, 241, 0.55)' }}
                  >
                    {item.time}
                  </span>
                </div>

                <p className="text-white font-semibold font-body text-[13px] tracking-wide uppercase mb-2">{item.label}</p>
                <p className="text-white/65 text-[13px] leading-relaxed font-body">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#140d23]/8 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left group cursor-pointer"
      >
        <span
          className="text-[#140d23] font-semibold font-body text-[15px] group-hover:text-[#5b2d9c] transition-colors duration-200 pr-6"
        >
          {q}
        </span>
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
          style={{ background: isOpen ? '#5b2d9c' : 'rgba(20,13,35,0.06)' }}
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="material-symbols-outlined text-[18px]"
            style={{ color: isOpen ? 'white' : '#7a6d8e' }}
          >
            add
          </motion.span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[#7a6d8e] text-[14px] leading-[1.85] font-body pb-6 pr-14">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection({ faqs }: { faqs: any[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section ref={ref} className="py-28 md:py-40 bg-[#f8f4ef] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-[#140d23]/6" />
      <div className="absolute -top-32 left-1/3 w-[600px] h-[600px] rounded-full bg-[#5b2d9c]/[0.03] blur-[130px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-28">

          {/* Left: Header stays sticky-ish */}
          <div className="lg:w-[340px] flex-shrink-0">
            <motion.div variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#e36520]" />
              <span className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.45em] font-body">Before You Come</span>
            </motion.div>

            <div className="overflow-hidden mb-6">
              <motion.h2
                variants={clipReveal} custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                className="text-[#140d23] leading-[0.88] tracking-[-0.04em]"
                style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 400 }}
              >
                Common<br />
                <span className="italic font-light text-[#140d23]/25">Questions</span>
              </motion.h2>
            </div>

            <motion.p variants={fadeUp} custom={3} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="text-[#7a6d8e] text-[14px] leading-relaxed font-body mb-8">
              We know a first visit brings up questions. Here are the ones we hear most often.
            </motion.p>

            <motion.div variants={fadeUp} custom={4} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 text-[#5b2d9c] font-bold font-body text-[13px] hover:gap-3 transition-all duration-200"
              >
                Ask us anything else
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </motion.div>
          </div>

          {/* Right: FAQ accordion */}
          <motion.div
            variants={fadeUp} custom={2} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="flex-1 bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_40px_-10px_rgba(20,13,35,0.07)] border border-[#140d23]/5"
          >
            {faqs.map((faq, i) => (
              <FAQItem
                key={faq.q}
                q={faq.q}
                a={faq.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── LOCATION ──────────────────────────────────────────────────────────────────

function LocationSection({ timings }: { timings: ReturnType<typeof getTimingsSummary> }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-28 md:py-40 bg-[#0b0814] relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[#5b2d9c]/8 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#e36520]/5 blur-[110px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
          {/* Left: Info */}
          <div className="lg:w-[380px] flex-shrink-0">
            <motion.div variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#e36520]" />
              <span className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.45em] font-body">Find Us</span>
            </motion.div>

            <div className="overflow-hidden mb-8">
              <motion.h2
                variants={clipReveal} custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                className="text-white leading-[0.88] tracking-[-0.04em]"
                style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', fontWeight: 400 }}
              >
                Getting<br />
                <span className="font-light italic text-white/20">Here</span>
              </motion.h2>
            </div>

            <motion.div variants={fadeUp} custom={2} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="space-y-8">

              {/* Address */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#e36520]/12 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px] text-[#e36520]">location_on</span>
                </div>
                <div>
                  <p className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.4em] font-body mb-2">Address</p>
                  <p className="text-white font-semibold font-body text-[14px] leading-relaxed">
                    SDA English Church<br />
                    Otteri Road, Bagayam, Vellore<br />
                    Tamil Nadu — 632002
                  </p>
                </div>
              </div>

              {/* Service times */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#5b2d9c]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px] text-[#a78bfa]">schedule</span>
                </div>
                <div>
                  <p className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.4em] font-body mb-2">Service Times</p>
                  <p className="text-white/70 font-body text-[14px] leading-relaxed">
                    {timings.slots.map(slot => {
                      const p = parseServiceTime(slot);
                      return (
                        <React.Fragment key={slot.label}>
                          {slot.label}: <span className="text-white font-semibold">{p.timeOnly} ({p.day})</span><br />
                        </React.Fragment>
                      );
                    })}
                  </p>
                </div>
              </div>

              {/* Transport */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#448d21]/12 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px] text-[#86efac]">directions_bus</span>
                </div>
                <div>
                  <p className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.4em] font-body mb-2">Getting Here</p>
                  <p className="text-white/60 font-body text-[14px] leading-relaxed">
                    Auto-rickshaw: ask for <em className="text-white/80">&ldquo;SDA Church near Otteri Bus Stop, Bagayam&rdquo;</em>. Free parking is available on campus for those driving.
                  </p>
                </div>
              </div>

              <motion.div variants={fadeUp} custom={5} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
                <a
                  href="https://maps.app.goo.gl/wqVwkb6SpbF9aUBS8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#e36520] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#c9571a] hover:-translate-y-0.5 transition-all duration-300 font-body shadow-lg shadow-[#e36520]/20"
                >
                  <span className="material-symbols-outlined text-[16px]">map</span>
                  Open in Google Maps
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Map embed */}
          <motion.div
            variants={fadeUp} custom={3} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="flex-1 w-full min-h-[400px] rounded-3xl overflow-hidden border border-white/6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            style={{ height: '480px' }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.4!2d79.1358917!3d12.8837302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad39169d3cb4b7%3A0x4370d664eb729a78!2sSeventh-day+Adventist+Church+Bagayam!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SDAECV Location Map"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── FINAL CTA ─────────────────────────────────────────────────────────────────

function ClosingCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-36 overflow-hidden" style={{ background: 'linear-gradient(135deg, #3d1e6f 0%, #5b2d9c 45%, #7c3aed 100%)' }}>
      {/* Animated glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#e36520]/20 blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-white/10 blur-[120px]"
        />
      </div>

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 text-center">

        <motion.div variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-white/30" />
          <span className="text-white/50 text-[9px] font-black uppercase tracking-[0.45em] font-body">We&apos;ve Been Waiting For You</span>
          <div className="h-px w-12 bg-white/30" />
        </motion.div>

        <div className="overflow-hidden mb-6">
          <motion.h2
            variants={clipReveal} custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="text-white leading-[0.88] tracking-[-0.04em]"
            style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(3rem, 8vw, 7.5rem)', fontWeight: 400 }}
          >
            Ready to<br />
            <span className="font-light italic" style={{ color: 'rgba(255,255,255,0.25)' }}>Visit Us?</span>
          </motion.h2>
        </div>

        <motion.p variants={fadeUp} custom={3} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="text-white/55 text-[16px] leading-relaxed font-body max-w-2xl mx-auto mb-12">
          The doors open every Sabbath. No appointment needed, no perfect faith required. Simply come and see.
        </motion.p>

        <motion.div variants={fadeUp} custom={4} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/connect"
            className="inline-flex items-center gap-2.5 rounded-full bg-[#e36520] px-10 py-4 text-sm font-bold text-white shadow-xl shadow-[#e36520]/30 hover:bg-[#c9571a] hover:-translate-y-0.5 hover:shadow-[#e36520]/40 transition-all duration-300 font-body"
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            Contact Us
          </Link>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/25 px-10 py-4 text-sm font-bold text-white hover:border-white/50 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300 font-body backdrop-blur-sm"
          >
            Our Story
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </motion.div>

        {/* Bottom quote */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="mt-20 border-t border-white/10 pt-10">
          <p
            className="text-white/25 italic"
            style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontWeight: 300 }}
          >
            &ldquo;Come to me, all who are weary and burdened, and I will give you rest.&rdquo;
          </p>
          <p className="text-white/20 text-[11px] font-body uppercase tracking-[0.3em] mt-3">Matthew 11:28</p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────

interface ExpectStep {
  step?: string;
  title: string;
  body: string;
  icon?: string;
  color?: string;
}

interface ScheduleSlot {
  label: string;
  time: string;
  detail?: string;
  icon?: string;
}

interface FAQItemType {
  question: string;
  answer: string;
}

interface VisitClientProps {
  expectSteps?: ExpectStep[];
  schedule?: ScheduleSlot[];
  faqs?: FAQItemType[];
  serviceTimes?: ServiceTimeSlot[];
}

export default function VisitClient({
  expectSteps: propExpectSteps,
  schedule: propSchedule,
  faqs: propFaqs,
  serviceTimes,
}: VisitClientProps) {
  const timings = getTimingsSummary(serviceTimes);
  const getStepIconAndColor = (title: string, index: number) => {
    const t = title.toLowerCase();
    if (t.includes('arrive') || t.includes('welcome')) return { icon: 'waving_hand', color: '#e36520' };
    if (t.includes('worship') || t.includes('sing') || t.includes('praise')) return { icon: 'music_note', color: '#5b2d9c' };
    if (t.includes('connect') || t.includes('lunch') || t.includes('eat')) return { icon: 'restaurant', color: '#448d21' };

    const colors = ['#e36520', '#5b2d9c', '#448d21'];
    const icons = ['waving_hand', 'music_note', 'restaurant'];
    return {
      icon: icons[index % icons.length],
      color: colors[index % colors.length]
    };
  };

  const expectCards = propExpectSteps && propExpectSteps.length > 0
    ? propExpectSteps.map((s, idx) => {
      const { icon: defaultIcon, color: defaultColor } = getStepIconAndColor(s.title, idx);
      return {
        icon: s.icon || defaultIcon,
        step: s.step || `0${idx + 1}`,
        title: s.title,
        color: s.color || defaultColor,
        body: s.body
      };
    })
    : EXPECT_CARDS;

  // Dynamically synchronize card times with central church service times
  const resolveCardTime = (itemLabel: string, rawTime: string) => {
    const l = itemLabel.toLowerCase();
    if (l.includes('school')) return timings.sabbathSchool.timeOnly || rawTime;
    if (l.includes('study')) return timings.churchAtStudy.timeOnly || rawTime;
    if (l.includes('divine') || l.includes('worship')) return timings.divineService.timeOnly || rawTime;

    const matchedSlot = findServiceSlot(timings.slots, [itemLabel]);
    if (matchedSlot) {
      return parseServiceTime(matchedSlot).timeOnly || rawTime;
    }
    return rawTime;
  };

  const getScheduleIcon = (label: string, index: number) => {
    const l = label.toLowerCase();
    if (l.includes('school')) return 'book_4';
    if (l.includes('study')) return 'menu_book';
    if (l.includes('worship') || l.includes('divine')) return 'church';
    if (l.includes('stream') || l.includes('online')) return 'live_tv';
    if (l.includes('youth') || l.includes('children') || l.includes('program')) return 'family_restroom';
    if (l.includes('sing') || l.includes('music')) return 'music_note';

    const icons = ['book_4', 'menu_book', 'church', 'live_tv', 'family_restroom'];
    return icons[index % icons.length];
  };

  let baseSchedule: ScheduleSlot[] = propSchedule && propSchedule.length > 0 ? propSchedule : SCHEDULE;

  // If Church at Study is configured in church service times but not in visit schedule cards, include it
  const hasStudy = baseSchedule.some(s => s.label.toLowerCase().includes('study'));
  if (!hasStudy && timings.churchAtStudy.timeOnly) {
    const ssIndex = baseSchedule.findIndex(s => s.label.toLowerCase().includes('school'));
    const studyCard: ScheduleSlot = {
      label: timings.churchAtStudy.slot.label || 'Church at Study',
      time: timings.churchAtStudy.timeOnly,
      detail: timings.churchAtStudy.slot.detail || 'A weekly time of inspiring songs, global mission reports, and special feature talks.',
      icon: 'menu_book',
    };
    if (ssIndex !== -1) {
      baseSchedule = [
        ...baseSchedule.slice(0, ssIndex + 1),
        studyCard,
        ...baseSchedule.slice(ssIndex + 1),
      ];
    } else {
      baseSchedule = [studyCard, ...baseSchedule];
    }
  }

  const resolvedSchedule = baseSchedule.map((s, idx) => ({
    label: s.label,
    time: resolveCardTime(s.label, s.time),
    detail: s.detail || '',
    icon: s.icon || getScheduleIcon(s.label, idx)
  }));

  const resolvedFaqs = propFaqs && propFaqs.length > 0
    ? propFaqs.map(f => ({
      q: f.question,
      a: f.answer
    }))
    : FAQS;

  const uniqueFaqs = resolvedFaqs.filter((faq, idx, self) =>
    self.findIndex(f => f.q === faq.q) === idx
  );

  return (
    <>
      <HeroSection timings={timings} />
      <ExpectSection expectCards={expectCards} />
      <ScheduleSection schedule={resolvedSchedule} />
      <FAQSection faqs={uniqueFaqs} />
      <LocationSection timings={timings} />
      <ClosingCTA />
    </>
  );
}
