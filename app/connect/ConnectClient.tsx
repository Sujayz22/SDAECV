'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ServiceTimeSlot, getTimingsSummary, parseServiceTime } from '@/lib/timings';

/* ── Animation Variants ─────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const clipReveal = {
  hidden: { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
  visible: (i = 0) => ({
    clipPath: 'inset(0% 0 0 0)',
    opacity: 1,
    transition: { duration: 1.1, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] as const },
  }),
};

/* ── FAQ data ─────────────────────────────────────────────────────────── */
const faqs = [
  {
    q: 'What should I wear to church?',
    a: 'While many choose to wear their "Sabbath best," we warmly welcome you as you are. Our focus is always on the heart, worship, and fellowship — not on outward appearance.',
  },
  {
    q: 'Do you have programs for children and youth?',
    a: 'Absolutely! We have vibrant Sabbath School classes for every age group, from Cradle Roll to Ambassadors. Our youth programs are designed to make biblical learning engaging and relevant.',
  },
  {
    q: 'Is there a fellowship lunch after service?',
    a: 'Yes! We often share potluck lunches after the Divine Service. It\'s one of our most cherished traditions — everyone is welcome to join. Just bring a dish to share if you can!',
  },
  {
    q: 'Can I attend online if I can\'t be there in person?',
    a: 'Yes! We offer a live stream for those who cannot attend in person. You can join us from anywhere in the world on our website\'s live stream page.',
  },
  {
    q: 'How can I get involved in a ministry?',
    a: 'We have many ministry opportunities — music, health, community outreach, and more. Reach out to us via the form on this page or speak to any of our leaders after service.',
  },
];

/* ── Connection types ─────────────────────────────────────────────────── */
const connectionTypes = [
  { value: '', label: 'Select a topic', disabled: true },
  { value: 'prayer', label: 'Prayer Request' },
  { value: 'visit', label: 'Planning a Visit' },
  { value: 'membership', label: 'Membership Info' },
  { value: 'volunteer', label: 'Volunteer / Serve' },
  { value: 'general', label: 'General Inquiry' },
];

/* ── Ministries data ──────────────────────────────────────────────────── */
const ministries = [
  {
    id: 'singing-band',
    name: 'Singing Band',
    tagline: 'Worship through sacred song',
    icon: 'music_note',
    gradient: 'from-[#5b2d9c]/20 to-[#e36520]/20',
    description: 'Elevating worship through choral and vocal harmony. The Singing Band coordinates special choruses, leads congregational praise, and shares the gospel through sacred musical programs.',
  },
  {
    id: 'outreach',
    name: 'Outreach Ministry',
    tagline: 'Hands and feet of Jesus in Vellore',
    icon: 'volunteer_activism',
    gradient: 'from-[#448d21]/20 to-[#5b2d9c]/20',
    description: 'Coordinating active missionary work and community support. From health outreach camps and literature distribution to organizing food and clothing drives for families in need.',
  },
  {
    id: 'youth',
    name: 'Adventist Youth Programme',
    tagline: 'Empowering the next generation',
    icon: 'diversity_3',
    gradient: 'from-[#e36520]/20 to-[#448d21]/20',
    description: 'A vibrant fellowship for youth and young adults. We foster spiritual growth, leadership training, and deep community bonds through youth retreats, devotionals, and outreach.',
  },
  {
    id: 'womens-ministry',
    name: "Women's Ministry",
    tagline: 'Nurturing faith and service',
    icon: 'spa',
    gradient: 'from-[#5b2d9c]/25 to-[#5b2d9c]/5',
    description: 'Supporting, encouraging, and equipping women in their spiritual walk and daily lives. Activities include weekly prayer circles, family life seminars, and local charitable service.',
  },
  {
    id: 'pathfinders',
    name: 'Pathfinders',
    tagline: 'Adventure, leadership, and faith',
    icon: 'explore',
    gradient: 'from-[#448d21]/25 to-[#448d21]/5',
    description: 'A scout-like ministry for children and teenagers. Pathfinders learn life skills, outdoor woodcraft and survival, engage in community service projects, and grow in their faith.',
  },
  {
    id: 'social-fellowship',
    name: 'Social & Fellowship',
    tagline: 'Building a warm family bond',
    icon: 'celebration',
    gradient: 'from-[#e36520]/25 to-[#e36520]/5',
    description: 'Cultivating a close-knit, welcoming church community. We coordinate our cherished potluck fellowship lunches, recreational outings, and family gatherings that bring us closer together.',
  },
  {
    id: 'prayer-ministry',
    name: 'Prayer Ministry',
    tagline: 'Interceding for one another',
    icon: 'favorite',
    gradient: 'from-[#5b2d9c]/20 to-[#448d21]/20',
    description: 'The spiritual powerhouse of the church, dedicated to prayer. We maintain an active intercessory prayer chain, host weekly prayer meetings, and faithfully lift up the church and community needs.',
  },
];

interface SanityFAQ {
  question: string;
  answer: string;
}

interface SanityMinistry {
  name: string;
  tagline: string;
  icon: string;
  gradient?: string;
  description: string;
}

interface ConnectClientProps {
  faqs?: SanityFAQ[];
  ministries?: SanityMinistry[];
  serviceTimes?: ServiceTimeSlot[];
}

export default function ConnectClient({ faqs: propFaqs, ministries: propMinistries, serviceTimes }: ConnectClientProps) {
  const timings = getTimingsSummary(serviceTimes);
  const resolvedFaqs = propFaqs && propFaqs.length > 0
    ? propFaqs.map(f => ({
        q: f.question,
        a: f.answer
      }))
    : faqs;

  const uniqueFaqs = resolvedFaqs.filter((faq, idx, self) =>
    self.findIndex(f => f.q === faq.q) === idx
  );

  const resolvedMinistries = propMinistries && propMinistries.length > 0
    ? propMinistries.map((m) => ({
        id: m.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: m.name,
        tagline: m.tagline,
        icon: m.icon,
        gradient: m.gradient || 'from-[#5b2d9c]/20 to-[#e36520]/20',
        description: m.description
      }))
    : ministries;
  /* ── Tab state ───────────────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<'inquiries' | 'ministries'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'ministries' || tabParam === 'inquiries') {
        return tabParam;
      }
    }
    return 'inquiries';
  });

  // Watch query parameter changes as well
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'ministries') {
        setActiveTab('ministries');
      } else if (tabParam === 'inquiries') {
        setActiveTab('inquiries');
      }
    };
    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  /* ── Form state ──────────────────────────────────────────────────────── */
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    message: '',
    privacy: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [submitError, setSubmitError] = useState<string | null>(null);

  /* ── FAQ state ───────────────────────────────────────────────────────── */
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* ── InView hooks ────────────────────────────────────────────────────── */
  const headerRef = useRef<HTMLDivElement>(null);
  const inViewHeader = useInView(headerRef, { once: true, margin: '-100px' });

  const contentRef = useRef<HTMLDivElement>(null);
  const inViewContent = useInView(contentRef, { once: true, margin: '-100px' });

  const faqRef = useRef<HTMLDivElement>(null);
  const inViewFaq = useInView(faqRef, { once: true, margin: '-100px' });

  const ctaRef = useRef<HTMLDivElement>(null);
  const inViewCta = useInView(ctaRef, { once: true, margin: '-100px' });

  /* ── Handlers ────────────────────────────────────────────────────────── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name.';
    if (!formData.email.trim()) newErrors.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email address.';
    if (!formData.type) newErrors.type = 'Please select a topic.';
    if (!formData.message.trim()) newErrors.message = 'Please share your message or prayer request.';
    return newErrors;
  };

  const handleConnectMinistry = (ministryName: string) => {
    setActiveTab('inquiries');
    setFormData((prev) => ({
      ...prev,
      type: 'volunteer',
      message: `Hi, I am interested in joining the ${ministryName} and would like to learn more!`,
    }));
    setTimeout(() => {
      const formEl = document.getElementById('connect-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
      const nameInput = document.getElementById('connect-name');
      if (nameInput) {
        nameInput.focus();
      }
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit request. Please try again.');
      }
      setSubmitted(true);
    } catch (err: any) {
      console.error('Submit error:', err);
      setSubmitError(err.message || 'Something went wrong. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION (Cinematic and animated, matching Visit page)
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-between overflow-hidden bg-[#0b0814]">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.22] scale-105"
            style={{ backgroundImage: `url('/church.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0814]/90 via-[#0b0814]/40 to-[#0b0814]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0814]/60 via-transparent to-transparent" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 35%, rgba(11,8,20,0.85) 100%)',
            }}
          />
          {/* Subtle noise texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'repeat',
              backgroundSize: '128px 128px',
            }}
          />
        </div>

        {/* Top Header Label */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-36 md:pt-40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-[#e36520]" />
            <span className="text-white/35 text-[10px] uppercase tracking-[0.45em] font-body">Connect With Us</span>
          </div>
          <span className="text-white/35 text-[10px] uppercase tracking-[0.45em] font-body hidden sm:block">Vellore, Tamil Nadu</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 max-w-4xl mx-auto pt-16 pb-20">
          <motion.div
            initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
            animate={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="overflow-hidden"
          >
            <h1
              className="text-white leading-[0.88] tracking-[-0.04em] mb-8 select-none"
              style={{
                fontFamily: 'var(--font-newsreader), serif',
                fontSize: 'clamp(3.5rem, 10vw, 8.5rem)',
                fontWeight: 400,
              }}
            >
              Connect &amp;{' '}
              <span className="font-light italic text-white/30" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Pray.
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/60 text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-12"
          >
            Whether you have a prayer need, a question, or simply want to find your place in our church family — we are here to walk with you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <a
              href="#connect-section"
              className="group flex flex-col items-center gap-3 text-white/40 hover:text-white transition-colors duration-300"
            >
              <span className="text-xs uppercase tracking-[0.3em] font-bold">Reach Out</span>
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#e36520] transition-colors group-hover:bg-[#e36520]/10">
                <span className="material-symbols-outlined text-white/60 group-hover:text-white transition-colors animate-bounce" style={{ animationDuration: '2s' }}>
                  south
                </span>
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN INTERACTIVE SECTION (Tabs: Inquiries & Ministries)
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="connect-section"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-36 bg-[#f8f4ef] relative overflow-hidden"
        ref={headerRef}
      >
        {/* Subtle decorative blurs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#e36520]/[0.02] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#5b2d9c]/[0.02] blur-[120px] pointer-events-none" />

        {/* Tab Header and Selection */}
        <div className="flex flex-col items-center mb-20">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate={inViewHeader ? 'visible' : 'hidden'}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-8 bg-[#e36520]" />
            <span className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.45em] font-body">Get in Touch</span>
          </motion.div>

          <div className="overflow-hidden mb-12 text-center">
            <motion.h2
              variants={clipReveal}
              custom={1}
              initial="hidden"
              animate={inViewHeader ? 'visible' : 'hidden'}
              className="text-[#140d23] leading-[0.88] tracking-[-0.04em]"
              style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 400 }}
            >
              Choose Your<br />
              <span className="italic font-light text-[#140d23]/30">Connection Path</span>
            </motion.h2>
          </div>

          {/* Interactive Switcher */}
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate={inViewHeader ? 'visible' : 'hidden'}
            className="inline-flex p-1.5 rounded-full bg-white border border-[#140d23]/8 relative shadow-soft"
          >
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`relative z-10 px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer select-none ${
                activeTab === 'inquiries' ? 'text-white' : 'text-[#7a6d8e] hover:text-[#140d23]'
              }`}
            >
              {activeTab === 'inquiries' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-[#5b2d9c] rounded-full -z-10 shadow-[0_5px_15px_-3px_rgba(91,45,156,0.3)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              Prayer &amp; Inquiries
            </button>
            <button
              onClick={() => setActiveTab('ministries')}
              className={`relative z-10 px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer select-none ${
                activeTab === 'ministries' ? 'text-white' : 'text-[#7a6d8e] hover:text-[#140d23]'
              }`}
            >
              {activeTab === 'ministries' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-[#5b2d9c] rounded-full -z-10 shadow-[0_5px_15px_-3px_rgba(91,45,156,0.3)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              Our Ministries
            </button>
          </motion.div>
        </div>

        {/* Tab Contents */}
        <div ref={contentRef}>
          <AnimatePresence mode="wait">
            {activeTab === 'inquiries' ? (
              <motion.div
                key="inquiries-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
              >
                {/* ── LEFT: Prayer Request Form ────────────────────────────── */}
                <div className="lg:col-span-7" id="connect-form">
                  <div className="mb-10">
                    <span className="text-[#e36520] font-bold tracking-widest uppercase text-xs mb-4 block">
                      Prayer &amp; Inquiries
                    </span>
                    <h3
                      className="text-4xl text-[#140d23] mb-4 leading-tight font-light"
                      style={{ fontFamily: 'var(--font-newsreader), serif' }}
                    >
                      How can we pray <br />
                      <span className="italic font-normal text-[#5b2d9c]">for you?</span>
                    </h3>
                    <p className="text-[#7a6d8e] text-base leading-relaxed max-w-lg">
                      Share your prayer request or question with us. Our pastoral team will hold your request in complete confidence and prayer.
                    </p>
                  </div>

                  {/* Success state */}
                  {submitted ? (
                    <div className="bg-white rounded-3xl border border-[#140d23]/5 p-12 shadow-[0_10px_40px_-10px_rgba(20,13,35,0.08)] flex flex-col items-center text-center gap-6">
                      <div className="size-20 rounded-full bg-[#5b2d9c]/10 flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-4xl text-[#5b2d9c]">favorite</span>
                      </div>
                      <h4
                        className="text-3xl text-[#140d23]"
                        style={{ fontFamily: 'var(--font-newsreader), serif' }}
                      >
                        We received your message
                      </h4>
                      <p className="text-[#7a6d8e] leading-relaxed max-w-sm">
                        Thank you, <strong className="text-[#140d23]">{formData.name}</strong>. Our pastoral team will be in prayer for you and will reach out if needed. God bless you.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: '', email: '', phone: '', type: '', message: '', privacy: false });
                        }}
                        className="mt-2 text-[#5b2d9c] font-bold text-sm hover:text-[#e36520] transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        Submit another request
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className="bg-white rounded-3xl border border-[#140d23]/5 p-8 md:p-12 shadow-soft flex flex-col gap-8 relative overflow-hidden"
                    >
                      {/* decorative corner accents */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-[#e36520]/5 rounded-bl-[100%] pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#5b2d9c]/4 rounded-tr-[100%] pointer-events-none" />

                      {submitError && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl relative z-10">
                          <p className="text-red-700 text-sm font-medium">{submitError}</p>
                        </div>
                      )}

                      {/* Row 1: Name + Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="connect-name"
                            className="text-xs font-black uppercase tracking-widest text-[#7a6d8e]"
                          >
                            Your Name <span className="text-[#e36520]">*</span>
                          </label>
                          <input
                            id="connect-name"
                            name="name"
                            type="text"
                            placeholder="Full name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full rounded-xl border px-4 py-3.5 text-[#140d23] bg-[#f8f4ef] placeholder:text-[#7a6d8e]/40 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5b2d9c]/30 transition-all duration-200 ${
                              errors.name ? 'border-red-400 bg-red-50/50' : 'border-[#140d23]/8 focus:border-[#5b2d9c]/30'
                            }`}
                          />
                          {errors.name && <p className="text-red-500 text-xs font-medium">{errors.name}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="connect-email"
                            className="text-xs font-black uppercase tracking-widest text-[#7a6d8e]"
                          >
                            Email Address <span className="text-[#e36520]">*</span>
                          </label>
                          <input
                            id="connect-email"
                            name="email"
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full rounded-xl border px-4 py-3.5 text-[#140d23] bg-[#f8f4ef] placeholder:text-[#7a6d8e]/40 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5b2d9c]/30 transition-all duration-200 ${
                              errors.email ? 'border-red-400 bg-red-50/50' : 'border-[#140d23]/8 focus:border-[#5b2d9c]/30'
                            }`}
                          />
                          {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email}</p>}
                        </div>
                      </div>

                      {/* Row 2: Phone + Connection Type */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="connect-phone"
                            className="text-xs font-black uppercase tracking-widest text-[#7a6d8e]"
                          >
                            Phone <span className="text-[#7a6d8e]/50 font-normal normal-case">(optional)</span>
                          </label>
                          <input
                            id="connect-phone"
                            name="phone"
                            type="tel"
                            placeholder="+91 00000 00000"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#140d23]/8 px-4 py-3.5 text-[#140d23] bg-[#f8f4ef] placeholder:text-[#7a6d8e]/40 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5b2d9c]/30 focus:border-[#5b2d9c]/30 transition-all duration-200"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="connect-type"
                            className="text-xs font-black uppercase tracking-widest text-[#7a6d8e]"
                          >
                            Topic <span className="text-[#e36520]">*</span>
                          </label>
                          <select
                            id="connect-type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className={`w-full rounded-xl border px-4 py-3.5 text-[#140d23] bg-[#f8f4ef] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5b2d9c]/30 transition-all duration-200 appearance-none cursor-pointer ${
                              errors.type ? 'border-red-400 bg-red-50/50' : 'border-[#140d23]/8 focus:border-[#5b2d9c]/30'
                            } ${!formData.type ? 'text-[#7a6d8e]/50' : ''}`}
                          >
                            {connectionTypes.map(({ value, label, disabled }) => (
                              <option key={value} value={value} disabled={disabled}>
                                {label}
                              </option>
                            ))}
                          </select>
                          {errors.type && <p className="text-red-500 text-xs font-medium">{errors.type}</p>}
                        </div>
                      </div>

                      {/* Message / Prayer Request */}
                      <div className="flex flex-col gap-2 relative z-10">
                        <label
                          htmlFor="connect-message"
                          className="text-xs font-black uppercase tracking-widest text-[#7a6d8e]"
                        >
                          Message / Prayer Request <span className="text-[#e36520]">*</span>
                        </label>
                        <textarea
                          id="connect-message"
                          name="message"
                          rows={5}
                          placeholder="Share your prayer request, question, or how we can serve you…"
                          value={formData.message}
                          onChange={handleChange}
                          className={`w-full rounded-xl border px-4 py-3.5 text-[#140d23] bg-[#f8f4ef] placeholder:text-[#7a6d8e]/40 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5b2d9c]/30 transition-all duration-200 resize-none ${
                            errors.message ? 'border-red-400 bg-red-50/50' : 'border-[#140d23]/8 focus:border-[#5b2d9c]/30'
                          }`}
                        />
                        {errors.message && <p className="text-red-500 text-xs font-medium">{errors.message}</p>}
                      </div>

                      {/* Privacy + Submit */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2 relative z-10">
                        <label className="flex items-start gap-3 cursor-pointer group select-none">
                          <span
                            className={`relative mt-0.5 size-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                              formData.privacy ? 'bg-[#5b2d9c] border-[#5b2d9c]' : 'border-[#140d23]/20 bg-[#f8f4ef] group-hover:border-[#5b2d9c]/40'
                            }`}
                          >
                            {formData.privacy && (
                              <span className="material-symbols-outlined text-white text-[14px] font-black">
                                check
                              </span>
                            )}
                            <input
                              id="connect-privacy"
                              name="privacy"
                              type="checkbox"
                              checked={formData.privacy}
                              onChange={handleChange}
                              className="sr-only"
                            />
                          </span>
                          <span className="text-xs text-[#7a6d8e] leading-relaxed">
                            Keep my prayer request <strong className="text-[#140d23]">private</strong> — share only with pastoral staff.
                          </span>
                        </label>

                        <button
                          id="connect-submit"
                          type="submit"
                          disabled={loading}
                          className="flex-shrink-0 flex items-center justify-center gap-3 rounded-full h-14 px-10 bg-[#5b2d9c] hover:bg-[#4a2480] text-white text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-[0_10px_30px_-5px_rgba(91,45,156,0.4)] hover:-translate-y-0.5 hover:shadow-[0_15px_35px_-5px_rgba(91,45,156,0.5)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto cursor-pointer"
                        >
                          {loading ? (
                            <>
                              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending…
                            </>
                          ) : (
                            <>
                              <span>Send Message</span>
                              <span className="material-symbols-outlined text-lg">arrow_right_alt</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Privacy badge */}
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#7a6d8e]/70 flex items-center gap-2 relative z-10 -mt-2">
                        <span className="material-symbols-outlined text-sm text-[#448d21]">verified_user</span>
                        Your information is always kept confidential.
                      </p>
                    </form>
                  )}
                </div>

                {/* ── RIGHT: Info Cards (Schedule, Contact, Map) ──────────────── */}
                <div className="lg:col-span-5 flex flex-col gap-6 lg:pt-24">
                  {/* Worship times */}
                  <div className="group bg-white rounded-3xl border border-[#140d23]/5 p-8 shadow-[0_10px_40px_-10px_rgba(20,13,35,0.06)] flex items-start gap-6 hover:shadow-[0_20px_60px_-15px_rgba(91,45,156,0.12)] hover:-translate-y-1 transition-all duration-300">
                    <div className="size-14 rounded-2xl bg-[#5b2d9c]/10 text-[#5b2d9c] flex items-center justify-center flex-shrink-0 group-hover:bg-[#5b2d9c] group-hover:text-white transition-all duration-300">
                      <span className="material-symbols-outlined text-2xl">auto_stories</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#7a6d8e] mb-3">
                        Worship Schedule
                      </h4>
                      <div className="flex flex-col gap-1.5">
                        {timings.slots.map((slot, index) => {
                          const p = parseServiceTime(slot);
                          const colors = ['#448d21', '#5b2d9c', '#e36520', '#3e8391', '#2f557f', '#7a6d8e'];
                          const accent = colors[index % colors.length];
                          return (
                            <p key={slot.label} className="text-sm text-[#140d23]">
                              <span className="font-semibold">{slot.label}:</span>{' '}
                              <span className="font-bold" style={{ color: accent }}>{p.timeOnly}</span>
                              <span className="text-[#7a6d8e] text-xs ml-1">({p.day})</span>
                            </p>
                          );
                        })}
                      </div>
                      <p className="text-xs text-[#7a6d8e] mt-3">Every Saturday · SDAECV, Vellore</p>
                    </div>
                  </div>

                  {/* Direct Contact */}
                  <div className="group bg-white rounded-3xl border border-[#140d23]/5 p-8 shadow-[0_10px_40px_-10px_rgba(20,13,35,0.06)] flex items-start gap-6 hover:shadow-[0_20px_60px_-15px_rgba(227,101,32,0.12)] hover:-translate-y-1 transition-all duration-300">
                    <div className="size-14 rounded-2xl bg-[#e36520]/10 text-[#e36520] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e36520] group-hover:text-white transition-all duration-300">
                      <span className="material-symbols-outlined text-2xl">contact_support</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#7a6d8e] mb-3">
                        Direct Contact
                      </h4>
                      <a
                        href="mailto:office@sdaecv.org"
                        className="text-[#140d23] hover:text-[#5b2d9c] transition-colors font-bold text-base block"
                      >
                        office@sdaecv.org
                      </a>
                      <a
                        href="tel:+914161234567"
                        className="text-[#7a6d8e] text-sm font-medium mt-1 block hover:text-[#140d23] transition-colors"
                      >
                        +91 416 123 4567
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="group bg-white rounded-3xl border border-[#140d23]/5 p-8 shadow-[0_10px_40px_-10px_rgba(20,13,35,0.06)] flex items-start gap-6 hover:shadow-[0_20px_60px_-15px_rgba(20,13,35,0.08)] hover:-translate-y-1 transition-all duration-300">
                    <div className="size-14 rounded-2xl bg-[#140d23]/6 text-[#140d23] flex items-center justify-center flex-shrink-0 group-hover:bg-[#140d23] group-hover:text-white transition-all duration-300">
                      <span className="material-symbols-outlined text-2xl">location_on</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#7a6d8e] mb-3">
                        Our Location
                      </h4>
                      <p className="text-sm font-semibold text-[#140d23] leading-relaxed">
                        SDA English Church
                        <br />
                        Otteri Road, Bagayam
                        <br />
                        Vellore, Tamil Nadu — 632002
                      </p>
                      <a
                        href="https://maps.app.goo.gl/wqVwkb6SpbF9aUBS8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#5b2d9c] text-xs font-black mt-4 hover:text-[#e36520] transition-colors uppercase tracking-widest"
                      >
                        Open in Maps
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    </div>
                  </div>

                  {/* Map embed */}
                  <div className="relative w-full rounded-3xl overflow-hidden border border-[#140d23]/5 shadow-[0_10px_40px_-10px_rgba(20,13,35,0.08)]" style={{ height: '220px' }}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.4!2d79.1358917!3d12.8837302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad39169d3cb4b7%3A0x4370d664eb729a78!2sSeventh-day+Adventist+Church+Bagayam!5e0!3m2!1sen!2sin!4v1"
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: 'sepia(20%) saturate(120%) hue-rotate(10deg)' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="SDAECV Location Map"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="ministries-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Ministries Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <span className="text-[#e36520] font-bold tracking-widest uppercase text-xs mb-4 block">
                    Active Church Ministries
                  </span>
                  <h3
                    className="text-4xl text-[#140d23] mb-4 font-light"
                    style={{ fontFamily: 'var(--font-newsreader), serif' }}
                  >
                    Serve &amp; Grow{' '}
                    <span className="italic font-normal text-[#5b2d9c]">Together</span>
                  </h3>
                  <p className="text-[#7a6d8e] text-base leading-relaxed">
                    Explore the vibrant ministries in our church. Whether you want to develop your faith, participate in outreach, or join in songs, there is a place for you to serve.
                  </p>
                </div>

                {/* Ministries Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {resolvedMinistries.map((ministry, i) => (
                    <motion.div
                      key={ministry.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                      className="group bg-white rounded-3xl border border-[#140d23]/5 overflow-hidden shadow-soft hover:shadow-warm transition-shadow duration-500 flex flex-col h-full cursor-default"
                    >
                      {/* Visual Image Placeholder */}
                      <div className={`relative w-full h-48 bg-gradient-to-br ${ministry.gradient} flex items-center justify-center overflow-hidden transition-all duration-500`}>
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
                        <div className="absolute size-24 rounded-full bg-white/20 blur-xl pointer-events-none" />
                        <div className="relative z-10 size-16 rounded-2xl bg-white/90 text-[#5b2d9c] border border-white/25 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="material-symbols-outlined text-3xl">{ministry.icon}</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-8 flex-grow flex flex-col justify-between">
                        <div>
                          <span className="text-[#e36520] font-bold tracking-widest uppercase text-[10px] mb-2 block">
                            {ministry.tagline}
                          </span>
                          <h4
                            className="text-2xl text-[#140d23] mb-3 font-semibold tracking-tight"
                            style={{ fontFamily: 'var(--font-newsreader), serif' }}
                          >
                            {ministry.name}
                          </h4>
                          <p className="text-[#7a6d8e] text-sm leading-relaxed mb-8">
                            {ministry.description}
                          </p>
                        </div>

                        <button
                          onClick={() => handleConnectMinistry(ministry.name)}
                          className="w-full h-12 rounded-full bg-[#f8f4ef] hover:bg-[#5b2d9c] text-[#5b2d9c] hover:text-white text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 border border-[#5b2d9c]/10 hover:border-transparent cursor-pointer select-none group/btn"
                        >
                          <span>Connect with {ministry.name}</span>
                          <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover/btn:translate-x-1">
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FAQ SECTION (Styled with matching Accordion animation styles)
      ════════════════════════════════════════════════════════════════ */}
      <section ref={faqRef} className="w-full bg-white py-24 md:py-36 relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#5b2d9c]/4 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#e36520]/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

        <div className="w-full max-w-5xl mx-auto px-6 relative z-10">
          {/* heading */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <motion.div
                variants={fadeUp}
                custom={0}
                initial="hidden"
                animate={inViewFaq ? 'visible' : 'hidden'}
                className="flex items-center gap-3 mb-6"
              >
                <div className="h-px w-8 bg-[#e36520]" />
                <span className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.45em] font-body">Common Questions</span>
              </motion.div>

              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  custom={1}
                  initial="hidden"
                  animate={inViewFaq ? 'visible' : 'hidden'}
                  className="text-[#140d23] leading-[0.88] tracking-[-0.04em]"
                  style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', fontWeight: 400 }}
                >
                  First time joining us?<br />
                  <span className="italic font-light text-[#140d23]/30">We got you covered</span>
                </motion.h2>
              </div>
            </div>
            <Link
              href="/about"
              className="flex-shrink-0 text-[#5b2d9c] font-bold text-sm hover:text-[#e36520] transition-colors flex items-center gap-2 font-body cursor-pointer group"
            >
              <span>About Our Church</span>
              <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* FAQ Accordion with smooth framer-motion scaling */}
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate={inViewFaq ? 'visible' : 'hidden'}
            className="flex flex-col gap-3"
          >
            {uniqueFaqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? 'border-[#5b2d9c]/20 bg-[#f8f4ef]' : 'border-[#140d23]/6 bg-white hover:border-[#5b2d9c]/15'
                  }`}
                >
                  <button
                    id={`faq-btn-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-7 py-5 cursor-pointer select-none text-left"
                  >
                    <h3 className={`text-base font-bold transition-colors duration-200 ${isOpen ? 'text-[#5b2d9c]' : 'text-[#140d23]'}`}>
                      {faq.q}
                    </h3>
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
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-7 pb-6 text-[#7a6d8e] text-sm leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA BOTTOM (Full overhaul, beautiful typography & action)
      ════════════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="w-full py-32 px-6 bg-[#f8f4ef] relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#5b2d9c]/4 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#e36520]/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-5xl mx-auto z-10">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate={inViewCta ? 'visible' : 'hidden'}
            className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white rounded-3xl border border-[#140d23]/5 p-10 md:p-14 shadow-soft hover:shadow-warm transition-shadow duration-500"
          >
            <div className="flex flex-col gap-4 max-w-lg text-left">
              <span className="text-[#e36520] font-bold tracking-widest uppercase text-xs">You&apos;re Welcome Here</span>
              <h2
                className="text-4xl md:text-5xl text-[#140d23] leading-tight tracking-tight font-light"
                style={{ fontFamily: 'var(--font-newsreader), serif' }}
              >
                Come as you <span className="italic font-normal text-[#5b2d9c]">are.</span>
              </h2>
              <p className="text-[#7a6d8e] text-lg leading-relaxed">
                Every soul is welcome in our family. Join us this Sabbath and experience the warmth of community and worship.
              </p>
            </div>
            <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
              <Link
                href="/visit"
                className="flex items-center justify-center gap-2 bg-[#e36520] text-white hover:bg-[#c9571a] font-bold py-4 px-10 rounded-full shadow-lg shadow-[#e36520]/20 hover:shadow-[#e36520]/30 transition-all hover:-translate-y-1 hover:scale-102 cursor-pointer font-body"
              >
                Plan a Visit
              </Link>
              <Link
                href="/live"
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-[#140d23]/10 text-[#140d23] hover:border-[#5b2d9c] hover:text-[#5b2d9c] font-bold py-4 px-10 rounded-full transition-all hover:-translate-y-1 cursor-pointer font-body"
              >
                Join Online
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
