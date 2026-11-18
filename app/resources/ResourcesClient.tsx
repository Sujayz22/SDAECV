'use client';

import { useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ─── ANIMATION VARIANTS ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.85, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const clipReveal = {
  hidden: { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
  visible: (i = 0) => ({
    clipPath: 'inset(0% 0 0 0)', opacity: 1,
    transition: { duration: 1.1, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] as const },
  }),
};

// ─── RESOURCE DATA ─────────────────────────────────────────────────────────────

type Category =
  | 'All'
  | 'Sabbath School'
  | 'Bible Study'
  | 'Apologetics'
  | 'For Children'
  | 'Watch Live'
  | 'Recommended';

interface Resource {
  title: string;
  description: string;
  href: string;
  category: Exclude<Category, 'All'>;
  icon: string;
  ageGroup?: string;
  tag?: string;
}

const RESOURCES: Resource[] = [
  // ── Sabbath School ──
  {
    title: 'Sabbath School Lesson — Beginner',
    description: 'Bible lessons, songs, and interactive activities designed for toddlers aged 0–2.',
    href: 'https://www.sabbathschoolpersonalministries.org/',
    category: 'Sabbath School',
    icon: 'child_care',
    ageGroup: '0–2 yrs',
    tag: 'Toddlers',
  },
  {
    title: 'Sabbath School Lesson — Kindergarten',
    description: 'Engaging stories and hands-on spiritual lessons tailored for children aged 3–5.',
    href: 'https://www.sabbathschoolpersonalministries.org/',
    category: 'Sabbath School',
    icon: 'toys',
    ageGroup: '3–5 yrs',
    tag: 'Kindergarten',
  },
  {
    title: 'Sabbath School Lesson — Primary',
    description: 'Scriptural lessons and faith-building activities created for elementary children aged 6–9.',
    href: 'https://www.sabbathschoolpersonalministries.org/',
    category: 'Sabbath School',
    icon: 'menu_book',
    ageGroup: '6–9 yrs',
    tag: 'Primary',
  },
  {
    title: 'Junior Powerpoints',
    description: 'A dynamic, grace-centered Sabbath School curriculum designed for youth aged 10–14.',
    href: 'https://www.juniorpowerpoints.org/',
    category: 'Sabbath School',
    icon: 'bolt',
    ageGroup: '10–14 yrs',
    tag: 'Junior',
  },
  {
    title: 'Cornerstone Connections',
    description: 'A deep, biblically grounded study guide based on the Spirit of Prophecy for high school teens.',
    href: 'https://www.cornerstoneconnections.net/',
    category: 'Sabbath School',
    icon: 'school',
    ageGroup: 'Teens',
    tag: 'Teen',
  },
  {
    title: 'Adult Bible Study Guide',
    description: 'The official quarterly study guide used by millions of adult Seventh-day Adventists worldwide.',
    href: 'https://ssnet.org/study-guides/',
    category: 'Sabbath School',
    icon: 'auto_stories',
    ageGroup: 'Adults',
    tag: 'Adult',
  },

  // ── Bible Study ──
  {
    title: 'Amazing Facts Free Book Library',
    description: 'A massive digital library of free booklets covering prophecy, doctrine, and practical Christian living.',
    href: 'https://www.amazingfacts.org/study/free-book-library/',
    category: 'Bible Study',
    icon: 'local_library',
  },
  {
    title: 'Discover Bible Study',
    description: 'Easy-to-understand online lessons covering the foundational truths of Scripture.',
    href: 'https://bibleschools.com/',
    category: 'Bible Study',
    icon: 'search',
  },
  {
    title: 'It Is Written — Classics',
    description: 'Timeless, Christ-centered archive broadcasts from one of the church\'s premier media ministries.',
    href: 'https://itiswritten.tv/',
    category: 'Bible Study',
    icon: 'history_edu',
  },
  {
    title: 'It Is Written — Line Upon Line',
    description: 'A dedicated verse-by-verse Bible study program examining deep scriptural topics.',
    href: 'https://itiswritten.tv/',
    category: 'Bible Study',
    icon: 'format_list_numbered',
  },
  {
    title: 'It Is Written — Hope Awakens',
    description: 'A powerful prophetic series exploring biblical answers to current global events.',
    href: 'https://itiswritten.tv/',
    category: 'Bible Study',
    icon: 'wb_sunny',
  },
  {
    title: 'Sabbath Truth — Advanced Topics',
    description: 'In-depth historical and theological studies regarding the biblical seventh-day Sabbath.',
    href: 'https://www.sabbathtruth.com/',
    category: 'Bible Study',
    icon: 'manage_search',
  },
  {
    title: 'E.G. White Writings',
    description: 'The official online repository containing the complete published works of Ellen G. White.',
    href: 'https://egwwritings.org/',
    category: 'Bible Study',
    icon: 'draw',
  },

  // ── Apologetics ──
  {
    title: 'BibleInfo.com',
    description: 'A comprehensive database providing straightforward, biblical answers to thousands of life\'s questions.',
    href: 'https://www.bibleinfo.com/',
    category: 'Apologetics',
    icon: 'quiz',
  },
  {
    title: 'BibleUniverse.com',
    description: 'An ultimate hub for online Bible courses, multimedia resources, and prophetic timelines.',
    href: 'https://www.bibleuniverse.com/',
    category: 'Apologetics',
    icon: 'public',
  },
  {
    title: 'HellTruth.com',
    description: 'A scriptural exploration of what the Bible truly teaches about hell, death, and the afterlife.',
    href: 'https://www.helltruth.com/',
    category: 'Apologetics',
    icon: 'policy',
  },
  {
    title: 'Adventist Biblical Research',
    description: 'Deep theological papers and official documents from the Biblical Research Institute.',
    href: 'https://www.adventistbiblicalresearch.org/',
    category: 'Apologetics',
    icon: 'lab_research',
  },
  {
    title: '3ABN Raw Questions',
    description: 'Panel discussions providing unscripted, direct biblical answers to tough questions sent in by viewers.',
    href: 'https://3abn.org/',
    category: 'Apologetics',
    icon: 'help_center',
  },
  {
    title: 'MichaelPedrin.com',
    description: 'Pastoral resources, deep doctrinal essays, and prophetic studies focused on End-Time truths.',
    href: 'http://www.michaelpedrin.com/',
    category: 'Apologetics',
    icon: 'person_book',
  },

  // ── For Children ──
  {
    title: 'My Place With Jesus',
    description: 'An interactive, child-friendly Bible study website produced by It Is Written.',
    href: 'https://www.myplacewithjesus.com/',
    category: 'For Children',
    icon: 'emoji_nature',
  },
  {
    title: 'Starting With Jesus',
    description: 'Daily devotional audios, video lessons, and music playlists to foster a relationship with God in early childhood.',
    href: 'https://www.startingwithjesus.com/',
    category: 'For Children',
    icon: 'star',
  },
  {
    title: 'Creation Connection',
    description: 'Creative multimedia resources that teach children about God\'s character through the wonders of nature.',
    href: 'https://www.creationconnection.org/',
    category: 'For Children',
    icon: 'forest',
  },
  {
    title: 'Discovery Mountain',
    description: 'An immersive, high-quality audio adventure drama series that teaches valuable faith lessons.',
    href: 'https://www.discoverymountain.com/',
    category: 'For Children',
    icon: 'terrain',
  },
  {
    title: 'Your Story Hour',
    description: 'Classic, dramatized stories from the Bible and history that build strong character in young listeners.',
    href: 'https://www.yourstoryhour.org/',
    category: 'For Children',
    icon: 'headphones',
  },

  // ── Watch Live ──
  {
    title: '3ABN — Three Angels Broadcasting',
    description: 'The official broadcasting network dedicated to sharing the everlasting gospel through family and spiritual programming.',
    href: 'https://3abn.org/',
    category: 'Watch Live',
    icon: 'live_tv',
  },
  {
    title: 'Hope TV',
    description: 'Global television network featuring programs focused on holistic Christian living, health, and deep Bible study.',
    href: 'https://www.hopetv.org/',
    category: 'Watch Live',
    icon: 'tv',
  },
  {
    title: 'Adventist Review TV',
    description: 'High-quality, on-demand video ministry showcasing global mission stories, interviews, and documentaries.',
    href: 'https://www.adventistreview.tv/',
    category: 'Watch Live',
    icon: 'video_library',
  },

  // ── Recommended ──
  {
    title: 'Sabbath School Net (SSNET)',
    description: 'An interactive forum featuring daily lesson text and worldwide discussions on the weekly Sabbath School lesson.',
    href: 'https://ssnet.org/',
    category: 'Recommended',
    icon: 'forum',
  },
  {
    title: 'Geoscience Research Institute',
    description: 'The official church resource exploring the intersection of faith and science, offering evidence for Creationism.',
    href: 'https://www.grisda.org/',
    category: 'Recommended',
    icon: 'biotech',
  },
  {
    title: 'Encyclopedia of Seventh-day Adventists',
    description: 'The definitive global church registry featuring official historical profiles of Adventist pioneers and ministries.',
    href: 'https://encyclopedia.adventist.org/',
    category: 'Recommended',
    icon: 'encyclopedia',
  },
  {
    title: 'ADRA International',
    description: 'The official humanitarian agency of the Seventh-day Adventist Church providing global disaster relief.',
    href: 'https://adra.org/',
    category: 'Recommended',
    icon: 'favorite',
  },
];

// ─── CATEGORY METADATA ─────────────────────────────────────────────────────────

const CATEGORIES: { id: Category; label: string; icon: string; color: string; bg: string }[] = [
  { id: 'All', label: 'All Resources', icon: 'grid_view', color: '#140d23', bg: '#140d23' },
  { id: 'Sabbath School', label: 'Sabbath School', icon: 'auto_stories', color: '#5b2d9c', bg: '#5b2d9c' },
  { id: 'Bible Study', label: 'Bible Study', icon: 'menu_book', color: '#e36520', bg: '#e36520' },
  { id: 'Apologetics', label: 'Apologetics', icon: 'policy', color: '#2f557f', bg: '#2f557f' },
  { id: 'For Children', label: 'For Children', icon: 'child_care', color: '#448d21', bg: '#448d21' },
  { id: 'Watch Live', label: 'Watch Live', icon: 'live_tv', color: '#c41e3a', bg: '#c41e3a' },
  { id: 'Recommended', label: 'Recommended', icon: 'star', color: '#b45309', bg: '#b45309' },
];

const CATEGORY_COLORS: Record<string, { text: string; badge: string }> = {
  'Sabbath School': { text: '#5b2d9c', badge: 'rgba(91,45,156,0.10)' },
  'Bible Study': { text: '#e36520', badge: 'rgba(227,101,32,0.10)' },
  'Apologetics': { text: '#2f557f', badge: 'rgba(47,85,127,0.10)' },
  'For Children': { text: '#448d21', badge: 'rgba(68,141,33,0.10)' },
  'Watch Live': { text: '#c41e3a', badge: 'rgba(196,30,58,0.10)' },
  'Recommended': { text: '#b45309', badge: 'rgba(180,83,9,0.10)' },
};

// ─── AGE GUIDE DATA ───────────────────────────────────────────────────────────

const AGE_GUIDES = [
  { label: '0–2 yrs', title: 'Sabbath School Lesson — Beginner', href: 'https://www.sabbathschoolpersonalministries.org/', note: 'Songs, stories & activities for toddlers' },
  { label: '3–5 yrs', title: 'Sabbath School Lesson — Kindergarten', href: 'https://www.sabbathschoolpersonalministries.org/', note: 'Hands-on spiritual lessons for kindergarteners' },
  { label: '6–9 yrs', title: 'Sabbath School Lesson — Primary', href: 'https://www.sabbathschoolpersonalministries.org/', note: 'Faith-building activities for elementary ages' },
  { label: '10–14 yrs', title: 'Junior Powerpoints', href: 'https://www.juniorpowerpoints.org/', note: 'Grace-centered curriculum for pre-teens' },
  { label: 'Teens', title: 'Cornerstone Connections', href: 'https://www.cornerstoneconnections.net/', note: 'Spirit of Prophecy study guide for high schoolers' },
  { label: 'Adults', title: 'Adult Bible Study Guide (SSNET)', href: 'https://ssnet.org/study-guides/', note: 'Official quarterly guide for adult Adventists worldwide' },
];

// ─── RESOURCE CARD ─────────────────────────────────────────────────────────────

function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const colors = CATEGORY_COLORS[resource.category];

  return (
    <motion.a
      href={resource.href}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -16, transition: { duration: 0.25 } }}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      className="group relative flex flex-col rounded-2xl border border-[#140d23]/6 bg-white p-6 shadow-[0_4px_24px_-6px_rgba(20,13,35,0.07)] hover:shadow-[0_16px_48px_-8px_rgba(20,13,35,0.13)] transition-shadow duration-500 cursor-pointer overflow-hidden"
    >
      {/* Hover radial glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at 20% 0%, ${colors.badge.replace('0.10', '0.18')}, transparent 65%)` }}
      />

      {/* Top row: icon + category badge */}
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ background: colors.badge }}
        >
          <span className="material-symbols-outlined text-xl" style={{ color: colors.text }}>
            {resource.icon}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className="text-[9px] font-black uppercase tracking-[0.35em] font-body px-2.5 py-1 rounded-full"
            style={{ color: colors.text, background: colors.badge }}
          >
            {resource.category}
          </span>
          {resource.tag && (
            <span className="text-[8px] font-bold uppercase tracking-[0.25em] font-body px-2 py-0.5 rounded-full bg-[#140d23]/5 text-[#7a6d8e]">
              {resource.tag}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-[#140d23] font-semibold font-body text-[15px] leading-snug mb-2 group-hover:text-[#5b2d9c] transition-colors duration-200"
      >
        {resource.title}
      </h3>

      {/* Description */}
      <p className="text-[#7a6d8e] text-[13px] leading-[1.8] font-body flex-1">
        {resource.description}
      </p>

      {/* Footer CTA */}
      <div
        className="flex items-center gap-1.5 mt-5 pt-4 border-t font-body text-[12px] font-bold uppercase tracking-[0.3em] transition-all duration-200 group-hover:gap-2.5"
        style={{ borderColor: `${colors.text}18`, color: colors.text }}
      >
        <span>Open Resource</span>
        <span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover:translate-x-1">
          open_in_new
        </span>
      </div>

      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out rounded-b-2xl"
        style={{ background: colors.text }}
      />
    </motion.a>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative bg-[#0b0814] overflow-hidden pt-36 pb-24">
      {/* Animated glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.28, 0.12] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-[#5b2d9c]/25 blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.2, 0.08] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full bg-[#e36520]/15 blur-[130px] pointer-events-none"
      />
      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px w-8 bg-[#e36520]" />
          <span className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.45em] font-body">Curated for Your Growth</span>
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
            animate={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="text-white leading-[0.88] tracking-[-0.04em]"
            style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(3rem, 9vw, 8rem)', fontWeight: 400 }}
          >
            Resource<br />
            <span className="font-light italic text-white/20">Directory</span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="text-white/45 text-[15px] leading-relaxed font-body max-w-xl"
        >
          A curated collection of spiritual growth, Bible study, and media resources for every age and every season of faith.
        </motion.p>
      </div>
    </section>
  );
}

// ─── AGE GUIDE SELECTOR ───────────────────────────────────────────────────────

function AgeGuideSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-20 bg-[#fdebd4] border-t border-[#140d23]/5 relative overflow-hidden">
      <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-[#e36520]/8 blur-[120px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          {/* Left */}
          <div className="lg:w-[360px] flex-shrink-0">
            <motion.div variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#e36520]" />
              <span className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.45em] font-body">Personalised</span>
            </motion.div>
            <div className="overflow-hidden mb-5">
              <motion.h2 variants={clipReveal} custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                className="text-[#140d23] leading-[0.9] tracking-[-0.04em]"
                style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400 }}
              >
                Find Your<br /><span className="italic font-light text-[#140d23]/30">Study Guide</span>
              </motion.h2>
            </div>
            <motion.p variants={fadeUp} custom={2} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              className="text-[#7a6d8e] text-[13px] leading-relaxed font-body"
            >
              Select an age group and we&apos;ll immediately point you to the right Sabbath School curriculum.
            </motion.p>
          </div>

          {/* Right: age grid + result */}
          <div className="flex-1">
            <motion.div variants={fadeUp} custom={2} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8"
            >
              {AGE_GUIDES.map((g, i) => (
                <button
                  key={g.label}
                  onClick={() => setSelected(selected === i ? null : i)}
                  className="flex flex-col items-center justify-center gap-1 px-2 py-4 rounded-2xl border-2 text-center font-body transition-all duration-300 cursor-pointer"
                  style={
                    selected === i
                      ? { borderColor: '#5b2d9c', background: '#5b2d9c', color: 'white' }
                      : { borderColor: 'rgba(20,13,35,0.10)', background: 'white', color: '#140d23' }
                  }
                >
                  <span className="material-symbols-outlined text-xl" style={{ color: selected === i ? 'white' : '#5b2d9c' }}>person</span>
                  <span className="text-[11px] font-bold leading-tight">{g.label}</span>
                </button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              {selected !== null && (
                <motion.a
                  key={selected}
                  href={AGE_GUIDES[selected].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-center justify-between gap-6 p-6 rounded-2xl bg-white border-2 border-[#5b2d9c]/20 shadow-[0_8px_32px_-6px_rgba(91,45,156,0.15)] hover:border-[#5b2d9c]/50 hover:shadow-[0_16px_40px_-6px_rgba(91,45,156,0.22)] transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#5b2d9c]/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-xl text-[#5b2d9c]">auto_stories</span>
                    </div>
                    <div>
                      <p className="text-[#5b2d9c] text-[9px] font-black uppercase tracking-[0.35em] font-body mb-1">
                        Recommended for {AGE_GUIDES[selected].label}
                      </p>
                      <p className="text-[#140d23] font-bold font-body text-[14px] leading-snug">
                        {AGE_GUIDES[selected].title}
                      </p>
                      <p className="text-[#7a6d8e] text-[12px] font-body mt-0.5">{AGE_GUIDES[selected].note}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5b2d9c] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-[16px] text-white">open_in_new</span>
                  </div>
                </motion.a>
              )}
              {selected === null && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-4 py-6 px-6 rounded-2xl border-2 border-dashed border-[#140d23]/12 text-[#7a6d8e]"
                >
                  <span className="material-symbols-outlined text-2xl opacity-40">touch_app</span>
                  <p className="text-[13px] font-body">Select an age group above to see your personalised recommendation.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── RESOURCE GRID SECTION ────────────────────────────────────────────────────

function ResourceGridSection({
  search,
  setSearch,
  activeCategory,
  setActiveCategory,
  totalVisible,
  filtered,
}: {
  search: string;
  setSearch: (v: string) => void;
  activeCategory: Category;
  setActiveCategory: (v: Category) => void;
  totalVisible: number;
  filtered: Resource[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 bg-[#f8f4ef] relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">

        {/* Search & Filter Controls Panel */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            {/* Search Input Box */}
            <div className="relative w-full max-w-xl">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="material-symbols-outlined text-xl text-[#7a6d8e]">search</span>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources, topics, or programmes…"
                className="w-full bg-white border border-[#140d23]/10 rounded-2xl pl-14 pr-12 py-3.5 text-[#140d23] placeholder-[#7a6d8e]/60 font-body text-[14px] focus:outline-none focus:border-[#5b2d9c]/60 focus:ring-1 focus:ring-[#5b2d9c]/30 shadow-sm transition-all duration-300"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a6d8e]/60 hover:text-[#140d23] transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              )}
            </div>

            {/* Count bar */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-[#7a6d8e] text-[11px] font-body uppercase tracking-[0.3em]">
                {totalVisible === RESOURCES.length
                  ? `${totalVisible} resources`
                  : `${totalVisible} of ${RESOURCES.length} shown`}
              </span>
              {(search || activeCategory !== 'All') && (
                <button
                  onClick={() => { setSearch(''); setActiveCategory('All'); }}
                  className="text-[#e36520] text-[11px] font-black font-body uppercase tracking-[0.25em] hover:underline transition-all"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-body text-[12px] font-bold uppercase tracking-[0.25em] transition-all duration-300 cursor-pointer border"
                  style={
                    isActive
                      ? { background: cat.bg, borderColor: cat.bg, color: 'white', boxShadow: `0 4px 12px ${cat.bg}25` }
                      : { background: 'white', borderColor: 'rgba(20, 13, 35, 0.08)', color: '#7a6d8e' }
                  }
                >
                  <span className="material-symbols-outlined text-[13px]">{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div ref={ref}>
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div
                key="grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filtered.map((resource, i) => (
                  <ResourceCard key={`${resource.title}-${resource.category}`} resource={resource} index={i % 9} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#140d23]/5 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl text-[#7a6d8e]/50">search_off</span>
                </div>
                <h3 className="text-[#140d23] font-semibold font-body text-lg mb-2">No resources found</h3>
                <p className="text-[#7a6d8e] text-[14px] font-body">Try a different search term or category filter.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─── CLOSING CTA ──────────────────────────────────────────────────────────────

function ClosingCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-[#f8f4ef] border-t border-[#140d23]/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="relative rounded-3xl overflow-hidden p-10 md:p-16 flex flex-col lg:flex-row items-center gap-12"
          style={{ background: 'linear-gradient(135deg, #140d23 0%, #3d1e6f 60%, #5b2d9c 100%)' }}
        >
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#e36520]/15 blur-[100px]" />
            <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-white/5 blur-[80px]" />
          </div>
          {/* Grain */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />

          <div className="relative flex-1 text-center lg:text-left">
            <p className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.45em] font-body mb-4">Have Questions?</p>
            <h2
              className="text-white leading-[0.9] tracking-[-0.03em] mb-5"
              style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 400 }}
            >
              Want to Study<br />
              <span className="italic font-light text-white/30">Together?</span>
            </h2>
            <p className="text-white/50 text-[14px] leading-relaxed font-body max-w-lg">
              Our pastors and elders are available to guide your personal Bible study journey. Reach out to arrange a one-on-one or group study session.
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
            <Link
              href="/connect"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#e36520] px-8 py-4 text-sm font-bold text-white hover:bg-[#c9571a] hover:-translate-y-0.5 transition-all duration-300 font-body shadow-lg shadow-[#e36520]/30"
            >
              <span className="material-symbols-outlined text-[16px]">mail</span>
              Contact the Church
            </Link>
            <Link
              href="/visit"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/20 px-8 py-4 text-sm font-bold text-white hover:border-white/40 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300 font-body backdrop-blur-sm"
            >
              Plan a Visit
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface SanityResourceLink {
  title: string;
  description: string;
  href: string;
  category: string;
  icon: string;
  ageGroup?: string;
  tag?: string;
}

interface ResourcesClientProps {
  resources?: SanityResourceLink[];
}

export default function ResourcesClient({ resources: propResources }: ResourcesClientProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const resolvedResources = useMemo(() => {
    return propResources && propResources.length > 0
      ? propResources.map(r => ({
          title: r.title,
          description: r.description,
          href: r.href,
          category: r.category as Exclude<Category, 'All'>,
          icon: r.icon,
          ageGroup: r.ageGroup,
          tag: r.tag
        }))
      : RESOURCES;
  }, [propResources]);

  const filtered = useMemo(() => {
    return resolvedResources.filter((r) => {
      const matchesCat = activeCategory === 'All' || r.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        (r.tag?.toLowerCase().includes(q) ?? false) ||
        (r.ageGroup?.toLowerCase().includes(q) ?? false);
      return matchesCat && matchesSearch;
    });
  }, [search, activeCategory, resolvedResources]);

  return (
    <>
      <HeroSection />
      <AgeGuideSection />
      <ResourceGridSection
        search={search}
        setSearch={setSearch}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        totalVisible={filtered.length}
        filtered={filtered}
      />
      <ClosingCTA />
    </>
  );
}
