import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import {
  ScrollScaleVideo,
  CommitmentsSection,
  BeliefsAccordion,
  LeadershipSection,
  EditorialHero,
} from './AboutClient';
import { sanityFetch } from "@/lib/sanity/live";

export const metadata: Metadata = {
  title: 'About Us — SDAECV | Seventh Day Adventist English Church, Vellore',
  description:
    'Learn about the history, core values, fundamental beliefs, and servant leaders of the Seventh Day Adventist English Church, Vellore — a welcoming community known by love.',
};

/* ── Fallback Data ─────────────────────────────────────────────────────── */
const FALLBACK_LEADERS = [
  {
    name: 'Pastor Abraham Mani',
    role: 'Senior Pastor',
    bio: 'Passionate about expository preaching and spiritual growth.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV1jYO3Z5U7wxXy8easWPThcEPzSemmXa2Rwji6dz2pK8r6l6iu5AVGsGaEBLo4YORYA4KOpo6u5mLa-w960BUHrKkyC1xDRPJmRbEqUCjlDdO1QWFnorcI7WrHYs7RzO4KglS9cSzCJgk6djjoWl0JR5oRyNaIFecZyOGNCc-BBzS-HrpZN2zhycgACs0q35_nKPRQZDBhoekXpmI2mBg5IhWoq_HM1LwM2TjEa48AbIGNdK9Cn7kx8kdze7uqk6YHNt16XviVmk',
  },
  {
    name: 'Dr. Elizabeth Varghese',
    role: 'Elder / Health Ministries',
    bio: 'Dedicated to the wholistic wellbeing of our congregation.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcAZxmJDt7PopXSIJzFKIY6xY6iI0c1TgRxRHv6ZaISJ1iUo3TE40UgxxyuwsQHkMb5v9Ua58zW0Y-sz45PQYyCNobJtBY_Y9G0aGPae1eWs0AekcnGHd9lUj9bgy7pWA87DAB7DIE_8eo9dpKB17yG_nTtlOoxdAVluuBH9h2BC_UpO9-G1ZGez8UnsBE_9yJe3U_EMrtLpHuWuX95wWTdCwEIlwVDFH0b1Xcxe6GYVer9c5yvvtvYvSoeaMqsgzJoOCtT7NdyfI',
  },
  {
    name: 'Johnathan Wesley',
    role: 'Youth Coordinator',
    bio: 'Empowering students to be leaders for Christ.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADlN2AuYpMzjWGGHbvz3z9Or14ZguVlOJDeSA7xS4Cs1i_-ydkYP3I_UtpjLAHZPS2sk4uoRDp1D9BwGG4ONycUYioMp8722zf1JvZ4l8-8_GFevqlXb9GZuEyogH8js2E2V5rf4gtpVY91ODSl76aTnT40cZrDvb7qtSeBOy6R7GyVaUsf2njSbmnvcYw2pbPq22Hk7NU5Hz-rKSrQtXNZn1BdntmMdmEjUq59CevVAralMzCvJT50pAf6Nhf3YzmtutFXRZ1ves',
  },
  {
    name: 'Sarah Mathews',
    role: 'Music Director',
    bio: 'Cultivating a spirit of worship through music.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-K9N5_84cSOJUslapMVY3Cz_NqjdqAo7B_8BrwtPsxTwNtLPPFUloZBOTkd3A52sz3w5CaZ25vwfwRqvxGAHPZKA8G_N13bye4tP_VXUqFO621agEKIo0ZuTNp_ckOB2sdGjW3tPTyeTRA7ABmheFkty5a7HwtnNRM2op3qJgPlynPccyxYaAyw_VpEn3k36YkjB1aCvyCn-kpzHuczEl5-tUJZUai1S-XP1vmOBEnowhl3LR0f6GG4iDAtC635o0N19O07FP_Nw',
  },
];

const timeline = [
  {
    era: '1947',
    title: 'Partnership with CMC',
    desc: 'Negotiations with Christian Medical College Vellore began. Dr. John Quinn became the first sponsored Adventist medical student admitted, pioneering a generation of faith-driven physicians.',
  },
  {
    era: '1958',
    title: 'Organizing the Church',
    desc: 'On November 29, 1958, twenty-three charter members officially organized the Vellore Adventist Church, meeting in the living room of Dr. Albert J. Patt\'s Maranatha Bungalow.',
  },
  {
    era: '1975',
    title: 'Sanctuary Dedicated',
    desc: 'After 17 years in borrowed rooms, the Vellore Seventh-day Adventist Church building was dedicated. Membership grew to 120, establishing a permanent home.',
  },
];

const FALLBACK_BELIEFS = [
  {
    title: 'The Seventh-day Sabbath',
    body: 'We believe in the biblical Sabbath as a day of rest, worship, and ministry, established by God at Creation and observed on the seventh day (Saturday).',
  },
  {
    title: 'The Second Coming',
    body: 'We look forward with blessed hope to the literal, visible, and personal return of Jesus Christ, which will bring an end to sin and suffering.',
  },
  {
    title: "The Three Angels' Messages",
    body: 'We are committed to sharing the final message of grace and warning found in Revelation 14, calling all people to worship the Creator.',
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
 ───────────────────────────────────────────────────────────────────────────── */
export default async function AboutPage() {
  // Fetch About Settings
  const aboutSettingsResult = await sanityFetch({
    query: `*[_type == "aboutPageSettings"][0]{
      heroTitle,
      heroSubtitle,
      heroImage {
        asset->{
          _id,
          url
        }
      },
      videoId,
      doctrinalBeliefs
    }`
  });
  const aboutSettings = (aboutSettingsResult?.data as any) || null;

  // Fetch Leadership Staff (authors)
  const leadersResult = await sanityFetch({
    query: `*[_type == "author"] | order(name asc){
      name,
      role,
      "bio": bio[0].children[0].text,
      "image": image.asset->url
    }`
  });
  const leaders = Array.isArray(leadersResult?.data) && leadersResult.data.length > 0
    ? (leadersResult.data as any[])
    : FALLBACK_LEADERS;

  // Map beliefs
  const beliefs = aboutSettings?.doctrinalBeliefs && aboutSettings.doctrinalBeliefs.length > 0
    ? aboutSettings.doctrinalBeliefs.map((b: any) => ({
      title: b.title,
      body: b.body,
    }))
    : FALLBACK_BELIEFS;

  return (
    <SmoothScroll>
      <div className="relative z-10">
        <Navbar dark={true} />

        {/* ═══════════════════════════════════════════════════
            1. EDITORIAL HERO — split screen, text + photo
        ════════════════════════════════════════════════════ */}
        <EditorialHero
          heroTitle={aboutSettings?.heroTitle}
          heroSubtitle={aboutSettings?.heroSubtitle}
          heroImage={aboutSettings?.heroImage}
        />

        {/* ═══════════════════════════════════════════════════
            2. SCROLL-SCALING VIDEO — grows from boxed → full
        ════════════════════════════════════════════════════ */}
        <ScrollScaleVideo videoId={aboutSettings?.videoId} />

        {/* ═══════════════════════════════════════════════════
            3. HISTORY / TIMELINE — minimal, typographic
        ════════════════════════════════════════════════════ */}
        <section id="story" className="w-full bg-white relative overflow-hidden">
          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#5b2d9c]/30 to-transparent" />

          <div className="max-w-7xl mx-auto px-6 py-28 md:py-36">
            {/* Top label */}
            <div className="flex items-center gap-4 mb-16">
              <div className="w-12 h-px bg-[#e36520]" />
              <span className="text-[#e36520] font-bold tracking-[0.2em] uppercase text-xs">
                Our Roots
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24 items-start">

              {/* Left — sticky editorial blurb */}
              <div className="lg:sticky lg:top-28">
                <h2
                  className="text-5xl md:text-7xl text-[#0c0818] mb-8 leading-[0.9] tracking-[-0.02em]"
                  style={{ fontFamily: 'var(--font-newsreader)' }}
                >
                  A Legacy of<br />
                  <em className="italic text-[#5b2d9c]">Faith</em><br />
                  in Vellore
                </h2>
                <p className="text-[#7a6d8e] text-lg leading-relaxed mb-10 max-w-sm">
                  SDAECV has been a spiritual home for many in Vellore — growing from a heart for
                  the English-speaking community into a vibrant mission-driven church.
                </p>
              </div>

              {/* Right — timeline entries */}
              <div className="relative">
                {/* Vertical line passing through the center of the circles */}
                <div className="absolute left-2 top-2 bottom-12 w-px bg-gradient-to-b from-[#5b2d9c]/30 via-[#5b2d9c]/15 to-transparent" />

                <div className="space-y-14 pl-10 relative">
                  {timeline.map((item, idx) => {
                    const isLast = idx === timeline.length - 1;
                    return (
                      <div key={item.era} className={`relative group ${isLast ? 'pb-28' : ''}`}>
                        {/* Timeline dot centered exactly on the line */}
                        <div className="absolute -left-[40px] top-1.5 size-4 rounded-full border-2 border-[#5b2d9c]/30 bg-white group-hover:border-[#5b2d9c] group-hover:bg-[#5b2d9c]/10 transition-all duration-300 z-10" />
                        {/* Era number */}
                        <span className="text-[#5b2d9c]/50 font-bold text-xs tracking-widest uppercase mb-2 block">
                          0{idx + 1} — {item.era}
                        </span>
                        <h3
                          className="text-3xl text-[#0c0818] mb-3 leading-tight group-hover:text-[#5b2d9c] transition-colors duration-300"
                          style={{ fontFamily: 'var(--font-newsreader)' }}
                        >
                          {item.title}
                        </h3>
                        <p className="text-[#7a6d8e] leading-relaxed text-base">{item.desc}</p>

                        {isLast && (
                          <>
                            {/* Faded shadow overlay starting from bottom and fading the 3rd point */}
                            <div className="absolute -left-[50px] -right-6 bottom-0 top-0 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />

                            {/* Explore Full History button placed on top of the faded 3rd point */}
                            <div className="absolute inset-x-0 bottom-4 flex justify-center z-20">
                              <Link
                                href="/history"
                                className="group inline-flex items-center gap-3 bg-[#0c0818] text-white hover:bg-[#5b2d9c] font-bold py-3.5 px-8 rounded-full text-sm shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
                              >
                                <span className="material-symbols-outlined text-base">history_edu</span>
                                Explore Full History
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-300">
                                  arrow_forward
                                </span>
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            4. BELIEFS — dark card, accordion
        ════════════════════════════════════════════════════ */}
        <section id="beliefs" className="w-full bg-[#f8f4ef] py-28 md:py-36">
          <div className="max-w-7xl mx-auto px-6">
            {/* Label */}
            <div className="flex items-center gap-4 mb-16">
              <div className="w-12 h-px bg-[#2f557f]" />
              <span className="text-[#2f557f] font-bold tracking-[0.2em] uppercase text-xs">
                Doctrines
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-start">
              {/* Left */}
              <div>
                <h2
                  className="text-5xl md:text-6xl text-[#0c0818] mb-6 leading-[0.9] tracking-[-0.02em]"
                  style={{ fontFamily: 'var(--font-newsreader)' }}
                >
                  What We<br />
                  <em className="italic text-[#2f557f]">Believe</em>
                </h2>
                <p className="text-[#7a6d8e] text-base leading-relaxed mb-8 max-w-xs">
                  As part of the worldwide Seventh-day Adventist Church, we hold to 28 fundamental
                  beliefs that define our understanding of God and His Word.
                </p>
                <a
                  href="https://www.adventist.org/beliefs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 bg-[#2f557f] text-white font-bold text-sm py-3.5 px-7 rounded-full hover:bg-[#1e3d5c] transition-all duration-300 shadow-md shadow-[#2f557f]/20 hover:shadow-lg hover:shadow-[#2f557f]/30 hover:-translate-y-0.5"
                >
                  View All 28 Beliefs
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </a>
              </div>

              {/* Right — accordion on dark pill */}
              <div className="bg-[#2F557F] rounded-3xl p-8 md:p-12 relative overflow-hidden">
                {/* Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#2f557f]/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <BeliefsAccordion beliefs={beliefs} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            5. COMMITMENTS — light, editorial
        ════════════════════════════════════════════════════ */}
        <CommitmentsSection />

        {/* ═══════════════════════════════════════════════════
            6. LEADERSHIP — tilt cards, dark dots bg
        ════════════════════════════════════════════════════ */}
        <LeadershipSection leaders={leaders} />

        {/* ═══════════════════════════════════════════════════
            7. HISTORY BRIDGE — cinematic dark section
        ════════════════════════════════════════════════════ */}
        <section className="w-full bg-[#0c0818] py-28 md:py-40 px-6 relative overflow-hidden">
          {/* Wide horizontal rule */}
          <div className="absolute top-0 left-16 right-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Ambient glows */}
          <div className="absolute inset-y-0 left-0 w-[600px] bg-gradient-to-r from-[#5b2d9c]/10 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-[400px] bg-gradient-to-l from-[#e36520]/6 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">
              {/* Text */}
              <div>
                <span className="text-[#e36520] font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
                  Our Heritage
                </span>
                <h2
                  className="text-5xl md:text-7xl text-white leading-[0.9] tracking-[-0.02em] mb-8"
                  style={{ fontFamily: 'var(--font-newsreader)' }}
                >
                  Rooted in{' '}
                  <em className="italic text-[#a78bfa]">History</em>,<br />
                  Growing in{' '}
                  <em className="italic text-[#f5d78e]">Purpose</em>
                </h2>
                <p className="text-white/45 text-lg leading-relaxed max-w-lg">
                  From humble beginnings to a thriving faith community — discover the full story
                  of how God has led the Seventh Day Adventist English Church in Vellore
                  through every season.
                </p>
              </div>

              {/* CTA card */}
              <div className="flex-shrink-0">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-sm max-w-xs">
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-[#5b2d9c]/30 to-[#7b4dc0]/20 border border-white/10 flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-[#a78bfa] text-3xl">
                      history_edu
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">
                    Every chapter of our story is a testament to God&apos;s faithfulness.
                  </p>
                  <Link
                    href="/history"
                    className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#5b2d9c] to-[#7b4dc0] text-white font-bold py-3.5 px-8 rounded-full text-sm shadow-lg shadow-[#5b2d9c]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#5b2d9c]/40"
                  >
                    Explore Full History
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            8. CTA — Welcome Home
        ════════════════════════════════════════════════════ */}
        <section className="w-full bg-[#f8f4ef] py-28 md:py-36 px-6 relative overflow-hidden">
          {/* Geometric accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#5b2d9c]/6 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#5b2d9c]/8 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <span className="text-[#e36520] font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
              You&apos;re Welcome Here
            </span>
            <h2
              className="text-5xl md:text-7xl text-[#0c0818] mb-8 leading-[0.92] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-newsreader)' }}
            >
              Welcome{' '}
              <em className="italic text-[#5b2d9c]">Home</em>.
            </h2>
            <p className="text-[#7a6d8e] text-xl leading-relaxed max-w-xl mx-auto mb-12">
              Whether you&apos;re a student at CMC, a resident of Vellore, or just passing through
              — there&apos;s a place for you at SDAECV.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/visit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0c0818] text-white font-bold py-4 px-10 rounded-full text-sm shadow-xl shadow-[#0c0818]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#5b2d9c] hover:shadow-[#5b2d9c]/30"
              >
                Plan a Visit
                <span className="material-symbols-outlined text-sm">place</span>
              </Link>
              <Link
                href="https://www.youtube.com/@SDAEnglishChurchVellore/streams" target='_blank'
                className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-[#0c0818]/12 text-[#0c0818] font-bold py-4 px-10 rounded-full text-sm hover:border-[#5b2d9c] hover:text-[#5b2d9c] transition-all duration-300 hover:-translate-y-0.5"
              >
                Join Online
                <span className="material-symbols-outlined text-sm">live_tv</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </SmoothScroll>
  );
}
