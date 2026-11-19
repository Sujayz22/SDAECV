'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from 'framer-motion';
import dynamic from 'next/dynamic';

const WorldMapSection = dynamic(() => import('./WorldMapSection'), {
  ssr: false,
  loading: () => (
    <section className="relative py-32 md:py-48 bg-[#0b0814] overflow-hidden min-h-[600px] flex items-center justify-center">
      <div className="text-white/20 font-baskerville text-sm animate-pulse">Loading Map...</div>
    </section>
  ),
});

// ─── FONTS ────────────────────────────────────────────────────────────────────

// ─── MILESTONES — rich data from history.txt ─────────────────────────────────

const MILESTONES = [
  {
    year: '1945',
    era: 'Medical Education Begins',
    tag: 'Origin',
    headline: 'Partnership Forged with CMC',
    body: 'The Southern Asia Division began negotiations with Christian Medical College, Vellore. Dr. Theodore R. Flaiz was appointed to develop a sponsorship programme for Adventist medical students. Advertisements were published across the Division inviting qualified students.',
    detail: 'Dr. Flaiz envisioned a pipeline of trained Adventist physicians who would carry healing and the gospel across South Asia.',
  },
  {
    year: '1947',
    era: 'First Students',
    tag: 'Milestone',
    headline: 'Dr. Quinn Enters CMC',
    body: 'CMC launched its first co-educational medical programme. Dr. John Quinn became the first known Adventist student admitted through the sponsorship programme — pioneering a generation of faith-driven physicians.',
    detail: 'Quinn\'s admission opened the door. Within a decade, dozens of Adventist students would follow him through CMC\'s gates.',
  },
  {
    year: '1948',
    era: 'Official Representation',
    tag: 'Growth',
    headline: 'Faculty & Leaders at the Table',
    body: 'Adventist leaders and medical representatives regularly attended CMC Council meetings. Dr. Thomas Thompson joined the CMC faculty as an official Adventist representative, cementing institutional ties.',
    detail: 'The church secured a permanent voice within CMC\'s governance — not merely a beneficiary, but a partner.',
  },
  {
    year: '1950',
    era: 'Community Deepens',
    tag: 'Growth',
    headline: 'Standards & Women Pioneers',
    body: 'Qualification criteria for Adventist-sponsored medical students were formally established. Elizabeth Fernando became one of the earliest Adventist women to enter the medical programme — a landmark in the church\'s commitment to women in ministry and medicine.',
    detail: 'The church insisted on excellence and inclusion from the very beginning.',
  },
  {
    year: '1953',
    era: 'Adventist Faculty Arrive',
    tag: 'Milestone',
    headline: 'The Janzens Come to Vellore',
    body: 'Dr. Jacob and Dr. Ernestine Janzen joined CMC as missionary faculty. Sabbath worship services began meeting at the Mission Bungalow. Dr. John Quinn completed his studies — among the very first Adventist medical graduates from CMC.',
    detail: 'The Janzens brought institutional weight. Suddenly this was not just a student fellowship but a genuine congregation in formation.',
  },
  {
    year: '1954',
    era: 'Village Ministry',
    tag: 'Outreach',
    headline: 'Chitteri Sabbath School',
    body: 'Dr. Albert J. Patt and six students launched a Branch Sabbath School in Chitteri village. The village headman offered his family courtyard for weekly meetings. Over seventy children eventually gathered each week.',
    detail: 'Health education, Bible stories, singing programmes, and missionary activities ran weekly. Several children were later helped into Adventist education at Lowry Memorial College.',
  },
  {
    year: '1958',
    era: 'The Founding',
    tag: 'Founding',
    headline: 'The Church Is Organized',
    body: 'On November 29, 1958, twenty-three charter members officially organized the Vellore Adventist Church. Worship was held in the living room of Dr. Patt\'s Maranatha Bungalow. English and Tamil Sabbath Schools operated simultaneously from day one.',
    detail: 'Members were actively trained in church leadership and evangelism — a community built not just for worship but for mission.',
  },
  {
    year: '1959',
    era: 'Training Begins',
    tag: 'Community',
    headline: 'Prayer & Leadercraft',
    body: 'Prayer and Leadercraft training programmes were introduced for Adventist students at CMC — forming the spiritual backbone of a generation of future church leaders and medical missionaries.',
    detail: 'The church understood that healing hands must be guided by trained hearts.',
  },
  {
    year: '1963',
    era: 'Established Ministries',
    tag: 'Growth',
    headline: 'Membership Reaches 35',
    body: 'The congregation grew to approximately thirty-five members. Separate English and Tamil worship groups functioned regularly. Midweek prayer meetings, singing bands, literature ministry, and village Sabbath Schools became established ministries.',
    detail: 'The Sabbath School was recognized that year for its excellent organization — a sign of maturity and intentionality.',
  },
  {
    year: '1964',
    era: 'Evangelism Grows',
    tag: 'Outreach',
    headline: '40 Bibles Distributed',
    body: 'The church\'s Sabbath School was formally recognized for its excellent organisation. Medical students conducted evangelistic meetings in Chitteri village. Forty Bibles were distributed during outreach campaigns across the region.',
    detail: 'By now the church was not merely surviving — it was actively multiplying its witness.',
  },
  {
    year: '1965',
    era: 'A Generation Trained',
    tag: 'Milestone',
    headline: '21 CMC Graduates',
    body: 'Twenty-one Adventist medical students had graduated from CMC by this year. Dr. Patt and Dr. Small were formally acknowledged for their extraordinary contributions to the congregation\'s shape and character over the preceding decade.',
    detail: 'Twenty-one doctors. Each one carrying faith into wards, villages, and nations.',
  },
  {
    year: '1966',
    era: 'Evangelistic Growth',
    tag: 'Outreach',
    headline: 'Baptisms in Budoor Village',
    body: 'Evangelistic campaigns were conducted in Budoor village and surrounding areas. Several people from non-Christian backgrounds accepted baptism. Church membership reached approximately forty — nearly double the founding number.',
    detail: 'The mission was no longer confined to the CMC campus. It was spreading into Tamil Nadu\'s villages.',
  },
  {
    year: '1968',
    era: 'Medical Mission',
    tag: 'Mission',
    headline: 'Eye Camps & Cataract Surgery',
    body: 'Adventist ophthalmologist Dr. John C. Abraham organised eye camps and cataract surgeries for surrounding communities. Sixteen Adventist students were enrolled in medical training at CMC.',
    detail: 'Healing sight — physical and spiritual — became a defining image of this congregation\'s ministry.',
  },
  {
    year: '1969',
    era: 'Retreat & Fellowship',
    tag: 'Community',
    headline: 'First Retreat at Horsley Hills',
    body: 'The first Adventist church retreat was organised at Horsley Hills. Medical students, staff, pastors, and alumni attended — a tradition of fellowship, renewal, and recommitment that has continued ever since.',
    detail: 'A church that prays together in the hills stays together through the valleys.',
  },
  {
    year: '1970',
    era: 'Youth & Legacy',
    tag: 'Growth',
    headline: 'Youth Centre Dedicated',
    body: 'Land was acquired near Bagayam. A Youth Centre was built and dedicated for Sabbath School and Adventist Youth activities. Dr. Theodore R. Flaiz completed fifty years of medical missionary service — a milestone celebrated by the entire community.',
    detail: 'The Youth Centre gave the next generation a physical home for their faith formation.',
  },
  {
    year: '1971',
    era: 'Medical Institute',
    tag: 'Mission',
    headline: 'CMC Hosts Evangelical Medical Institute',
    body: 'CMC hosted a major Evangelical Medical Institute. Adventist physicians and leaders taught health evangelism, physiology, counseling, nutrition, and family life — drawing attendees from across South Asia.',
    detail: 'Vellore became a classroom for the integration of medicine and mission.',
  },
  {
    year: '1972',
    era: 'Expansion',
    tag: 'Outreach',
    headline: 'Village Schools Multiply',
    body: 'Branch Sabbath Schools expanded into additional villages across the region. Students and doctors travelled weekly to conduct children\'s ministries and health education programmes. Plans for a permanent church building accelerated.',
    detail: 'The congregation outgrew borrowed spaces. A permanent home was now not just a dream — it was a necessity.',
  },
  {
    year: '1973',
    era: 'Building Begins',
    tag: 'Milestone',
    headline: 'Construction Starts',
    body: 'Construction of a permanent church building began — designed to seat approximately 120 worshippers. Funds were raised through donations from members and supporters who had prayed for this day for fifteen years.',
    detail: 'Every brick laid was an act of faith. Every donation a declaration of permanence.',
  },
  {
    year: '1975',
    era: 'Historic Dedication',
    tag: 'Founding',
    headline: 'The Doors Open',
    body: 'The Vellore Seventh-day Adventist Church building was officially dedicated. Designed by R. S. Senseman. Pastor C. P. Jonahs presided. Membership had grown to approximately 120 — five times the charter count of 1958.',
    detail: 'From a living room to a sanctuary. Seventeen years of faithfulness made permanent in stone and timber.',
  },
];

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Origin: { bg: 'rgba(91,45,156,0.15)', text: '#a78bfa', border: 'rgba(91,45,156,0.4)' },
  Milestone: { bg: 'rgba(227,101,32,0.15)', text: '#fb923c', border: 'rgba(227,101,32,0.4)' },
  Growth: { bg: 'rgba(68,141,33,0.15)', text: '#86efac', border: 'rgba(68,141,33,0.4)' },
  Outreach: { bg: 'rgba(47,85,127,0.15)', text: '#93c5fd', border: 'rgba(47,85,127,0.4)' },
  Mission: { bg: 'rgba(62,131,145,0.15)', text: '#67e8f9', border: 'rgba(62,131,145,0.4)' },
  Community: { bg: 'rgba(244,63,94,0.15)', text: '#fda4af', border: 'rgba(244,63,94,0.4)' },
  Founding: { bg: 'rgba(234,179,8,0.15)', text: '#fde68a', border: 'rgba(234,179,8,0.4)' },
};

// (COUNTRY_NODES and VELLORE coordinates moved to WorldMapSection.tsx)

// ─── CHAPTERS ─────────────────────────────────────────────────────────────────

const CHAPTERS = [
  {
    id: 'origins',
    era: '1945 – 1953',
    chapter: 'Chapter I',
    headline: ['The Healers Who', 'First Prayed Together'],
    sub: 'How a medical sponsorship in Vellore became the seed of a congregation.',
    body: [
      'In 1945, the Southern Asia Division entered negotiations with Christian Medical College, Vellore — envisioning a programme where Adventist students could receive world-class medical training while remaining rooted in faith.',
      'Dr. Theodore R. Flaiz was appointed to lead the effort. By 1947, Dr. John Quinn became the first Adventist to enter CMC\'s co-educational programme — pioneering a generation of faith-driven physicians.',
      'By 1953, Drs. Jacob and Ernestine Janzen had joined CMC as missionary faculty, and Sabbath worship found its first home at the Mission Bungalow. Elizabeth Fernando had already become one of the earliest Adventist women in medicine.',
    ],
    facts: ['Dr. Theodore R. Flaiz appointed', 'CMC\'s first co-ed medical programme 1947', 'Elizabeth Fernando — women in medicine pioneer'],
    accent: '#5b2d9c',
    year: '1947',
    bg: '#140d23',
  },
  {
    id: 'founding',
    era: 'November 29, 1958',
    chapter: 'Chapter II',
    headline: ['The Charter Is', 'Signed'],
    sub: 'Twenty-three faithful members gather in a living room — and write history.',
    body: [
      'On the twenty-ninth of November, 1958, the Vellore Adventist Church was officially organized. Twenty-three charter members signed the register in the living room of Dr. Albert J. Patt\'s Maranatha Bungalow on the CMC campus.',
      'English and Tamil Sabbath Schools operated simultaneously under the same roof from day one. Members were trained in church leadership and evangelism, building a pipeline that would eventually reach Burma, Malaysia, Singapore, and beyond.',
      'By 1963 the membership had grown to thirty-five. Midweek prayer meetings, singing bands, literature ministry, and village Sabbath Schools had all taken root. The Sabbath School was formally recognised for its excellent organisation.',
    ],
    facts: ['23 charter members', 'English & Tamil schools from day one', 'Maranatha Bungalow, CMC Campus'],
    accent: '#e36520',
    year: '1958',
    bg: '#0e0919',
  },
  {
    id: 'growth',
    era: '1959 – 1972',
    chapter: 'Chapter III',
    headline: ['A Ministry That', 'Refused to Stand Still'],
    sub: 'Eye camps, Horsley Hills retreats, village schools, and 21 CMC graduates.',
    body: [
      'The 1960s were years of extraordinary expansion. Dr. John C. Abraham organised eye camps and cataract surgeries in surrounding communities. Medical students conducted evangelistic campaigns in Budoor village. Forty Bibles were distributed in a single outreach season.',
      'Prayer and Leadercraft training programmes formed the spiritual backbone of a generation. The first church retreat at Horsley Hills became a tradition. The Youth Centre near Bagayam gave young people a home.',
      'By 1972, Branch Sabbath Schools had expanded into multiple villages — doctors and students travelling weekly to conduct children\'s ministry and health education. A permanent church building was no longer a dream. It was a plan.',
    ],
    facts: ['Eye camps & cataract surgeries 1968', 'First Horsley Hills retreat 1969', 'Youth Centre near Bagayam 1970', '21 CMC graduates by 1965'],
    accent: '#448d21',
    year: '1966',
    bg: '#071208',
  },
  {
    id: 'dedication',
    era: '1973 – 1975',
    chapter: 'Chapter IV',
    headline: ['A Sanctuary', 'Of Their Own'],
    sub: 'After 17 years in borrowed rooms — a permanent home is built in stone and timber.',
    body: [
      'Construction began in 1973 on a permanent church building, designed by R. S. Senseman to seat 120 worshippers. Funds were raised through sacrificial giving by members and supporters who had prayed for this day for nearly two decades.',
      'In 1975, under the pastoral care of C. P. Jonahs, the Vellore Seventh-day Adventist Church was officially dedicated. Membership stood at 120 — five times the founding number of twenty-three.',
      'The building stands today as a testament to every student, doctor, pastor, and layperson who gave their faith practical form. From a living room to a sanctuary — seventeen years of faithfulness made permanent.',
    ],
    facts: ['Designed by R. S. Senseman', 'Pastor C. P. Jonahs presided', '120 members at dedication', '1973–1975 construction period'],
    accent: '#e36520',
    year: '1975',
    bg: '#f5f0e8',
    light: true,
  },
];

const STATS = [
  { num: 23, suffix: '', label: 'Charter members, 1958' },
  { num: 7, suffix: '', label: 'Continents reached' },
  { num: 120, suffix: '', label: 'Members by dedication, 1975' },
  { num: 21, suffix: '+', label: 'CMC graduates by 1965' },
  { num: 79, suffix: '+', label: 'Years of unbroken ministry' },
  { num: 8, suffix: '', label: 'Countries served' },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useCounter(target: number, inView: boolean, duration = 2200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setCount(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return count;
}

// ─── VARIANTS ─────────────────────────────────────────────────────────────────

const clipReveal = {
  hidden: { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
  visible: (i = 0) => ({
    clipPath: 'inset(0% 0 0 0)',
    opacity: 1,
    transition: { duration: 1.1, delay: i * 0.15, ease: [0.76, 0, 0.24, 1] as const },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const lineGrow = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } },
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ num, suffix, label, index }: { num: number; suffix: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useCounter(num, inView);
  return (
    <motion.div
      ref={ref}
      variants={fadeUp} custom={index}
      initial="hidden" animate={inView ? 'visible' : 'hidden'}
      className="flex flex-col items-center text-center group px-4"
    >
      <span
        className="text-white leading-none tabular-nums"
        style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 900 }}
      >
        {count}{suffix}
      </span>
      <motion.div
        className="mt-3 h-px bg-[#e36520] origin-left"
        initial={{ width: 0 }} animate={inView ? { width: 32 } : { width: 0 }}
        transition={{ duration: 0.8, delay: index * 0.1 + 0.4 }}
      />
      <span className="mt-3 text-white/35 text-[9px] font-bold tracking-[0.25em] uppercase">{label}</span>
    </motion.div>
  );
}

// ─── CHAPTER SECTION ─────────────────────────────────────────────────────────

function ChapterSection({ chapter, index }: { chapter: typeof CHAPTERS[0]; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0;
  const isLight = !!chapter.light;

  const textColor = isLight ? '#140d23' : '#fff';
  const mutedColor = isLight ? '#7a6d8e' : 'rgba(255,255,255,0.45)';
  const bodyColor = isLight ? '#374151' : 'rgba(255,255,255,0.5)';
  const borderColor = isLight ? 'rgba(20,13,35,0.08)' : 'rgba(255,255,255,0.07)';

  return (
    <section
      ref={ref}
      className="relative py-36 md:py-52 overflow-hidden"
      style={{ background: chapter.bg }}
    >
      {/* Ghost year watermark */}
      <motion.div
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2 }}
        className="absolute select-none pointer-events-none"
        style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: 'clamp(10rem,28vw,26rem)',
          fontWeight: 900,
          color: isLight ? 'rgba(20,13,35,0.04)' : 'rgba(255,255,255,0.025)',
          lineHeight: 1,
          top: '50%', [isEven ? 'right' : 'left']: '-3%',
          transform: 'translateY(-50%)',
          letterSpacing: '-0.04em',
        }}
      >
        {chapter.year}
      </motion.div>

      {/* Accent orb */}
      <div
        className="absolute pointer-events-none w-[600px] h-[600px] rounded-full blur-[130px] opacity-[0.10]"
        style={{ background: chapter.accent, [isEven ? 'left' : 'right']: '-15%', top: '10%' }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-start gap-16 lg:gap-28`}>

          {/* Headline col */}
          <div className="flex-1 max-w-[500px]">
            <motion.div variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="flex items-center gap-4 mb-7">
              <div className="h-px w-8" style={{ background: chapter.accent }} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: chapter.accent }}>{chapter.chapter}</span>
            </motion.div>

            <div className="overflow-hidden mb-1">
              <motion.p variants={clipReveal} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="font-baskerville text-[10px] tracking-[3px] uppercase" style={{ color: mutedColor }}>
                {chapter.era}
              </motion.p>
            </div>

            {chapter.headline.map((line, i) => (
              <div key={i} className="overflow-hidden">
                <motion.h2
                  variants={clipReveal} custom={i + 1}
                  initial="hidden" animate={inView ? 'visible' : 'hidden'}
                  style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(2.6rem,5.5vw,5rem)', fontWeight: 900, lineHeight: 0.96, letterSpacing: '-0.03em', color: textColor }}
                >
                  {line}
                </motion.h2>
              </div>
            ))}

            <motion.div variants={lineGrow} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="mt-7 mb-7 h-px origin-left" style={{ background: `linear-gradient(to right,${chapter.accent},transparent)` }} />

            <motion.p variants={fadeUp} custom={4} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="font-fell italic text-lg leading-relaxed" style={{ color: chapter.accent }}>
              {chapter.sub}
            </motion.p>

            {/* Fact pills */}
            <div className="mt-8 flex flex-col gap-2">
              {chapter.facts.map((fact, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} custom={i + 5}
                  initial="hidden" animate={inView ? 'visible' : 'hidden'}
                  className="flex items-center gap-3 text-[12px] font-baskerville"
                  style={{ color: mutedColor }}
                >
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: chapter.accent }} />
                  {fact}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Body col */}
          <div className="flex-1 max-w-[560px] space-y-6">
            {chapter.body.map((para, i) => (
              <motion.p
                key={i}
                variants={fadeUp} custom={i + 3}
                initial="hidden" animate={inView ? 'visible' : 'hidden'}
                className="text-[15px] leading-[1.95] font-baskerville"
                style={{ color: bodyColor }}
              >
                {para}
              </motion.p>
            ))}

            <motion.div
              variants={fadeUp} custom={7}
              initial="hidden" animate={inView ? 'visible' : 'hidden'}
              className="mt-6 inline-flex items-center gap-3 rounded-full px-5 py-2.5 border"
              style={{ borderColor: `${chapter.accent}35`, background: `${chapter.accent}0f` }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: chapter.accent }} />
              <span className="font-baskerville text-[11px] tracking-[0.2em] uppercase" style={{ color: isLight ? '#140d23' : '#fff' }}>{chapter.era}</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HORIZONTAL TIMELINE ──────────────────────────────────────────────────────

function HorizontalTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const totalCards = MILESTONES.length;

  const x = useTransform(scrollYProgress, [0, 1], ['0vw', `${-(totalCards - 1) * 100}vw`]);
  const smoothX = useSpring(x, { stiffness: 50, damping: 22, restDelta: 0.001 });

  // Track active card from scroll progress
  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const idx = Math.round(v * (totalCards - 1));
      setActiveIdx(Math.max(0, Math.min(totalCards - 1, idx)));
    });
  }, [scrollYProgress, totalCards]);

  const SCROLL_HEIGHT = totalCards * 110; // vh

  return (
    <div ref={containerRef} style={{ height: `${SCROLL_HEIGHT}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#050308] flex flex-col">

        {/* Header bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-8 md:px-16 pt-8 pb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8 bg-[#e36520]" />
              <span className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.45em]">Full Chronicle</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(1.6rem,3vw,2.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
              1945 — 1975<br />
              <span className="text-white/20 font-normal italic">Every Milestone</span>
            </h2>
          </div>

          {/* Progress counter */}
          <div className="text-right hidden sm:block">
            <motion.p
              key={activeIdx}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="text-white/20 font-baskerville text-[11px] tracking-widest uppercase mb-1"
            >
              {MILESTONES[activeIdx]?.year}
            </motion.p>
            <p className="text-white/15 font-bold text-sm tabular-nums">
              {String(activeIdx + 1).padStart(2, '0')} / {String(totalCards).padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* Slim progress bar */}
        <div className="flex-shrink-0 h-px bg-white/5 mx-8 md:mx-16 mb-4">
          <motion.div className="h-full bg-[#e36520] origin-left" style={{ scaleX: scrollYProgress }} />
        </div>

        {/* Sliding cards — full screen width each */}
        <div className="flex-1 relative overflow-hidden">
          <motion.div
            className="flex h-full"
            style={{ x: smoothX, width: `${totalCards * 100}vw` } as any}
          >
            {MILESTONES.map((m, i) => {
              const tag = TAG_COLORS[m.tag] ?? TAG_COLORS['Growth'];
              const isActive = i === activeIdx;
              return (
                <div
                  key={m.year}
                  className="h-full flex items-center justify-center px-8 md:px-20 lg:px-32"
                  style={{ width: '100vw', flexShrink: 0 }}
                >
                  <div className="w-full max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-20 items-start">

                      {/* Left: year + tag */}
                      <div className="flex flex-col gap-4">
                        <motion.div
                          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.95 }}
                          transition={{ duration: 0.5 }}
                        >
                          <p
                            className="text-white leading-none tabular-nums"
                            style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(5rem,14vw,12rem)', fontWeight: 900, letterSpacing: '-0.04em' }}
                          >
                            {m.year}
                          </p>
                        </motion.div>
                        <div className="flex flex-col gap-3">
                          <span
                            className="inline-flex items-center self-start px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border"
                            style={{ background: tag.bg, color: tag.text, borderColor: tag.border }}
                          >
                            {m.tag}
                          </span>
                          <span
                            className="font-baskerville text-[10px] tracking-[0.25em] uppercase"
                            style={{ color: 'rgba(255,255,255,0.25)' }}
                          >
                            {m.era}
                          </span>
                        </div>

                        {/* Card index dots */}
                        <div className="flex gap-1.5 mt-4 flex-wrap max-w-[200px]">
                          {MILESTONES.map((_, di) => (
                            <div
                              key={di}
                              className="h-1 rounded-full transition-all duration-300"
                              style={{
                                width: di === activeIdx ? '24px' : '6px',
                                background: di === activeIdx ? '#e36520' : 'rgba(255,255,255,0.12)',
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Right: content */}
                      <div className="flex flex-col gap-6 pt-2">
                        <motion.div
                          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.2, y: 12 }}
                          transition={{ duration: 0.6 }}
                        >
                          <h3
                            className="text-white mb-5"
                            style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(1.8rem,3.5vw,3.2rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}
                          >
                            {m.headline}
                          </h3>
                          <div className="h-px w-16 bg-[#e36520] mb-6" />
                          <p className="font-baskerville text-[14px] leading-[1.95] text-white/55 mb-4">
                            {m.body}
                          </p>
                          <p className="font-fell italic text-[13px] leading-relaxed text-[#e36520]/70">
                            {m.detail}
                          </p>
                        </motion.div>

                        {/* Nav hint */}
                        <div className="flex items-center gap-3 mt-4">
                          {i > 0 && (
                            <span className="font-baskerville text-[10px] tracking-widest uppercase text-white/20">← {MILESTONES[i - 1]?.year}</span>
                          )}
                          {i < MILESTONES.length - 1 && (
                            <span className="font-baskerville text-[10px] tracking-widest uppercase text-white/20 ml-auto">{MILESTONES[i + 1]?.year} →</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom hint */}
        <div className="flex-shrink-0 flex items-center justify-center pb-4 gap-2">
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="text-white/15 text-[9px] font-bold tracking-[0.3em] uppercase"
          >
            Scroll to advance
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// (WorldMapSection component imported dynamically above from ./WorldMapSection)

// ─── PULL QUOTE ───────────────────────────────────────────────────────────────

function PullQuote({ quote, speaker }: { quote: string; speaker: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section ref={ref} className="relative py-28 md:py-40 bg-[#f5f0e8] overflow-hidden">
      <motion.span
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.5 }}
        className="absolute select-none pointer-events-none"
        style={{ fontFamily: "'UnifrakturMaguntia',cursive", fontSize: 'clamp(10rem,28vw,26rem)', color: 'rgba(20,13,35,0.04)', top: '-5%', left: '-1%', lineHeight: 1 }}
      >
        V
      </motion.span>
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative">
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="w-12 h-0.5 bg-[#5b2d9c] mx-auto mb-10" />
        <div className="overflow-hidden">
          <motion.blockquote
            variants={clipReveal} custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(1.5rem,3.5vw,3rem)', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.35, color: '#140d23', letterSpacing: '-0.01em' }}
          >
            &ldquo;{quote}&rdquo;
          </motion.blockquote>
        </div>
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px w-8 bg-[#e36520]" />
          <span className="font-baskerville text-[10px] tracking-[0.3em] uppercase text-[#7a6d8e]">{speaker}</span>
          <div className="h-px w-8 bg-[#e36520]" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 220]);
  const opacity = useTransform(scrollY, [0, 550], [1, 0]);

  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-[#050308]">
      {/* Animated orbs */}
      <motion.div animate={{ scale: [1, 1.18, 1], opacity: [0.16, 0.28, 0.16] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#5b2d9c] blur-[140px] pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.22, 1], opacity: [0.08, 0.16, 0.08] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#e36520] blur-[120px] pointer-events-none" />

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

      <motion.div style={{ y, opacity }} className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex items-center gap-4 mb-10">
          <div className="h-px w-8 bg-[#e36520]" />
          <span className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.45em]">Since 1947 · Vellore</span>
          <div className="h-px w-8 bg-[#e36520]" />
        </motion.div>

        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif" }} className="mb-8">
          {[
            { text: 'A Church', italic: false, color: '#fff' },
            { text: 'Forged in', italic: true, color: '#fff' },
            { text: 'Faith.', italic: false, color: '#e36520' },
          ].map((w, wi) => (
            <div key={wi} className="overflow-hidden block">
              <motion.span
                initial={{ y: '110%', rotate: 1.5 }} animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1.05, delay: 0.4 + wi * 0.18, ease: [0.76, 0, 0.24, 1] }}
                className="block"
                style={{ fontSize: 'clamp(3.2rem,9.5vw,9.5rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', color: w.color, fontStyle: w.italic ? 'italic' : 'normal' }}
              >
                {w.text}
              </motion.span>
            </div>
          ))}
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.0 }} className="text-white/40 font-baskerville text-base md:text-lg max-w-xl leading-relaxed">
          From a living room in 1958 to a congregation whose alumni serve on every continent — the story of the SDA English Church, Vellore.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="mt-16 flex flex-col items-center gap-2">
          <span className="text-white/20 text-[9px] font-bold tracking-[0.4em] uppercase">Scroll to explore</span>
          <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center gap-1 mt-2">
            <div className="w-px h-12 bg-gradient-to-b from-white/25 to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#e36520]" />
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#050308] to-transparent pointer-events-none" />
    </section>
  );
}

// ─── STATS BAND ───────────────────────────────────────────────────────────────

function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <section ref={ref} className="bg-[#0b0814] border-t border-white/5 py-16">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          {STATS.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── CLOSING ──────────────────────────────────────────────────────────────────

function Closing() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section ref={ref} className="relative py-36 bg-[#f8f4ef] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.03, 0.08, 0.03] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[700px] h-[700px] rounded-full bg-[#5b2d9c] blur-[130px]" />
      </div>
      <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1.5 }} className="overflow-hidden mb-4">
          <span className="block text-[#fffff]/8 leading-none select-none" style={{ fontFamily: "'UnifrakturMaguntia',cursive", fontSize: 'clamp(3rem,10vw,8rem)' }}>
            The Vellore Witness
          </span>
        </motion.div>
        <motion.div variants={lineGrow} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="h-0.5 bg-gradient-to-r from-transparent via-[#e36520] to-transparent my-8" />
        <div className="overflow-hidden">
          <motion.p variants={clipReveal} custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="text-[#140d23]/70 font-fell italic text-xl md:text-2xl leading-relaxed">
            &ldquo;We invite your continued prayers and support as this church empowers a new generation to carry the mission of the Gospel to the ends of the earth.&rdquo;
          </motion.p>
        </div>
        <motion.p variants={fadeUp} custom={3} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="mt-6 font-baskerville text-[14px] tracking-[0.3em] uppercase text-[#7a6d8e]">
          Sourced by Dr. Gordon E Christo &amp;  Dr. Samuel Vijayakumar · Est. 1947 · Vellore, India
        </motion.p>
      </div>
    </section>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function HistoryClient() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=IM+Fell+English:ital@0;1&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        .font-fraktur     { font-family: 'UnifrakturMaguntia',cursive; }
        .font-playfair    { font-family: 'Playfair Display',Georgia,serif; }
        .font-fell        { font-family: 'IM Fell English',Georgia,serif; }
        .font-baskerville { font-family: 'Libre Baskerville',Georgia,serif; }
      `}</style>

      <Hero />
      <StatsSection />
      <ChapterSection chapter={CHAPTERS[0]} index={0} />
      <PullQuote quote="Dr. John Quinn — the first Adventist to enter CMC's co-educational programme in 1947." speaker="Church Records · Vellore, 1947" />
      <ChapterSection chapter={CHAPTERS[1]} index={1} />
      <PullQuote quote="Two languages. One calling. Twenty-three people who changed everything." speaker="Charter Day · November 29, 1958" />
      <ChapterSection chapter={CHAPTERS[2]} index={2} />
      <HorizontalTimeline />
      <ChapterSection chapter={CHAPTERS[3]} index={3} />
      <WorldMapSection />
      <PullQuote quote="From a living room to a sanctuary — 17 years of faithfulness made permanent in stone and timber." speaker="Dedication Day · 1975" />
      <Closing />
    </>
  );
}
