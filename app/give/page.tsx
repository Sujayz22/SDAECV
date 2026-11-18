import type { Metadata } from 'next';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { GiveMethods, StewardshipSection } from './GiveClient';
import { sanityFetch } from '@/lib/sanity/live';

export const metadata: Metadata = {
  title: 'Give — SDAECV | Seventh Day Adventist English Church, Vellore',
  description:
    'Support the ministry and mission of the Seventh Day Adventist English Church, Vellore. Find details on tithing, free-will offerings, UPI scan, and bank transfer options.',
};

export default async function GivePage() {
  // Fetch giving settings singleton
  const givingSettingsResult = await sanityFetch({
    query: `*[_type == "givingSettings"][0]{
      memoryVerseQuote,
      memoryVerseRef,
      upiId,
      qrCodeImage {
        asset->{
          _id,
          url
        }
      },
      bankDetails,
      stewardshipQAs
    }`
  });
  const givingSettings = (givingSettingsResult?.data as any) || null;

  const GIVING_IMG =
    'https://res.cloudinary.com/ddtlgvixd/image/upload/v1782853931/offerings_ynkesg.webp';

  const memoryVerseQuote = givingSettings?.memoryVerseQuote || "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.";
  const memoryVerseRef = givingSettings?.memoryVerseRef || "2 Corinthians 9:7";

  return (
    <SmoothScroll>
      <div className="relative z-10 bg-[#f8f4ef]">
        <Navbar dark={true} />

        {/* ═══════════════════════════════════════════════════
            1. HERO SECTION — Memory Verse & Image
        ════════════════════════════════════════════════════ */}
        <section className="relative w-full min-h-screen bg-[#0c0818] overflow-hidden flex flex-col justify-center">
          {/* Ambient glows */}
          <div className="absolute top-[-10%] left-[-5%] w-[55vw] h-[55vw] max-w-[900px] bg-[#5b2d9c]/14 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[40vw] h-[40vw] max-w-[700px] bg-[#e36520]/8 rounded-full blur-[120px] pointer-events-none" />

          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 md:py-36 grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-16 items-center">
            {/* Left: Memory Verse Card */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-[#e36520]" />
                <span className="text-[#e36520] font-bold tracking-[0.2em] uppercase text-xs">
                  Worship in Giving
                </span>
              </div>

              {/* Memory Verse quote */}
              <div className="relative mb-10">
                <span
                  className="absolute -left-6 -top-12 text-[#5b2d9c]/15 text-8xl font-serif select-none pointer-events-none"
                  style={{ fontFamily: 'var(--font-newsreader)' }}
                >
                  “
                </span>
                <blockquote
                  className="text-white text-3xl md:text-5xl leading-tight font-serif tracking-tight relative z-10"
                  style={{ fontFamily: 'var(--font-newsreader)' }}
                >
                  {memoryVerseQuote.includes('cheerful giver') ? (
                    <>
                      Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a{' '}
                      <em
                        className="not-italic"
                        style={{
                          background: 'linear-gradient(135deg, #e36520, #f0a060)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        cheerful giver
                      </em>
                      .
                    </>
                  ) : (
                    memoryVerseQuote
                  )}
                </blockquote>
                <cite className="block text-white/50 text-sm tracking-widest uppercase font-bold mt-6 not-italic font-mono">
                  — {memoryVerseRef}
                </cite>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#methods"
                  className="bg-white text-[#0c0818] font-bold py-3.5 px-8 rounded-full text-sm hover:bg-[#e36520] hover:text-white transition-all duration-300 shadow-lg shadow-white/5"
                >
                  Ways to Give
                </a>
                <a
                  href="#stewardship"
                  className="text-white/60 hover:text-white font-semibold text-sm py-3.5 transition-colors flex items-center gap-2"
                >
                  Biblical Stewardship
                  <span className="material-symbols-outlined text-sm">arrow_downward</span>
                </a>
              </div>
            </div>

            {/* Right: Visual Image Card */}
            <div className="relative aspect-[3/2] w-full max-w-2xl lg:max-w-none mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <Image
                src={GIVING_IMG}
                alt="Worship and Giving at Seventh Day Adventist English Church, Vellore"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-[#0c0818]/40 group-hover:bg-[#0c0818]/25 transition-colors duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0818]/70 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            2. HOW TO GIVE SECTION — UPI & Bank Transfer
        ════════════════════════════════════════════════════ */}
        <div id="methods">
          <GiveMethods
            upiId={givingSettings?.upiId}
            qrCodeImage={givingSettings?.qrCodeImage}
            bankDetails={givingSettings?.bankDetails}
          />
        </div>

        {/* ═══════════════════════════════════════════════════
            3. STEWARDSHIP INFO — Tithe, Offering, Why Give
        ════════════════════════════════════════════════════ */}
        <div id="stewardship">
          <StewardshipSection stewardshipQAs={givingSettings?.stewardshipQAs} />
        </div>
      </div>

      <Footer />
    </SmoothScroll>
  );
}
