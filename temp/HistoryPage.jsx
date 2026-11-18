"use client";

// HistoryPage.jsx
// Drop this into your Next.js app/pages directory.
// Requirements:
//   - Tailwind CSS configured in your project
//   - Google Fonts: add to your layout.jsx or _document.jsx (see bottom of this file)
//     <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=IM+Fell+English:ital@0;1&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
//   - Add to tailwind.config.js fontFamily (see bottom of this file)

import { useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const STATS = [
  { num: "23",  label: "Charter members" },
  { num: "7",   label: "Continents reached" },
  { num: "120", label: "Members by 1975" },
  { num: "21+", label: "CMC graduates" },
];

const MILESTONES = [
  { year: "1947", event: "First Adventist student Dr. John Quinn admitted to CMC", featured: false },
  { year: "1953", event: "Missionary faculty arrive; Sabbath worship begins at Mission Bungalow", featured: false },
  { year: "1954", event: "Chitteri Branch Sabbath School founded; 70+ children attend", featured: false },
  { year: "1958", event: "Church officially organized — 23 charter members at Maranatha Bungalow", featured: true },
  { year: "1966", event: "Evangelistic campaigns; membership reaches 40", featured: false },
  { year: "1970", event: "Youth Centre built and dedicated near Bagayam", featured: false },
  { year: "1975", event: "Church building dedicated; 120 members; designed by R. S. Senseman", featured: true },
];

const COUNTRIES = ["India","Pakistan","Nepal","Bhutan","Sri Lanka","Burma","Malaysia","Singapore"];

const LEGACY_STATS = [
  { num: "79+", label: "Years of ministry" },
  { num: "8",   label: "Countries served" },
  { num: "2",   label: "Divisions reached" },
  { num: "∞",   label: "Lives transformed" },
];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function Kicker({ children }) {
  return (
    <p className="font-baskerville text-[9px] tracking-[3px] uppercase text-stone-500 border-t-2 border-stone-900 pt-1.5 mb-2">
      {children}
    </p>
  );
}

function Byline({ children }) {
  return (
    <p className="font-baskerville text-[9px] tracking-[2px] uppercase text-stone-400 mb-3">
      {children}
    </p>
  );
}

function PullQuote({ children }) {
  return (
    <blockquote className="border-t-[3px] border-b-[3px] border-stone-900 py-2.5 my-4 font-playfair italic text-base leading-snug text-stone-900 text-center">
      {children}
    </blockquote>
  );
}

function ColDivider() {
  return <div className="hidden lg:block w-px bg-stone-900 mx-0 self-stretch" />;
}

function PhotoPlaceholder({ caption, height = "h-36", label = "PHOTOGRAPH" }) {
  return (
    <figure className={`border border-stone-900 bg-[#ede8dc] ${height} flex flex-col items-center justify-center my-3`}>
      <div className="flex flex-col items-center gap-1 opacity-40">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-stone-700">
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <span className="font-baskerville text-[8px] tracking-[3px] uppercase text-stone-600">{label}</span>
      </div>
      {caption && (
        <figcaption className="font-baskerville text-[9px] italic text-stone-500 mt-2 px-3 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function NumberBox({ num, label, inverted = false }) {
  return (
    <div className={`border-2 border-stone-900 text-center py-4 px-2 my-3 ${inverted ? "bg-stone-900 text-[#f5f0e8]" : "bg-[#f5f0e8] text-stone-900"}`}>
      <span className={`font-playfair text-5xl font-black leading-none block ${inverted ? "text-[#f5f0e8]" : "text-stone-900"}`}>{num}</span>
      <span className={`font-baskerville text-[9px] tracking-[2px] uppercase mt-1 block ${inverted ? "text-stone-400" : "text-stone-500"}`}>{label}</span>
    </div>
  );
}

function BodyCopy({ children, dropCap = false }) {
  return (
    <div className={`font-baskerville text-[12px] leading-[1.85] text-stone-800 space-y-2 ${dropCap ? "drop-cap-text" : ""}`}>
      {children}
    </div>
  );
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

function Masthead() {
  const today = new Date().toLocaleDateString("en-GB", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  return (
    <header className="border-b-[3px] border-stone-900 px-4 md:px-8 pt-5 pb-0">
      {/* Top meta */}
      <div className="flex flex-wrap justify-between items-center gap-1 border-b border-stone-900 pb-2 mb-0">
        <span className="font-baskerville text-[8px] tracking-[2px] uppercase text-stone-700">Vol. LXXIX · No. 1</span>
        <span className="font-baskerville text-[8px] tracking-[2px] uppercase text-stone-700 hidden sm:block">Established 1947 · Vellore, Tamil Nadu</span>
        <span className="font-baskerville text-[8px] tracking-[2px] uppercase text-stone-700">Special History Edition</span>
      </div>

      {/* Flag */}
      <div className="text-center py-3 border-b border-stone-900">
        <h1 className="font-fraktur text-4xl sm:text-5xl md:text-6xl text-stone-900 leading-none">
          The Vellore Witness
        </h1>
        <p className="font-fell italic text-xs text-stone-500 tracking-[2px] mt-1">
          "Dedicated to nurturing young Christian leaders since 1947"
        </p>
      </div>

      {/* Bottom meta */}
      <div className="flex flex-wrap justify-between items-center gap-1 py-1.5 border-t border-stone-900 mt-1">
        <span className="font-baskerville text-[8px] tracking-[1.5px] uppercase text-stone-700">Seventh-day Adventist English Church</span>
        <span className="font-baskerville text-[8px] tracking-[1.5px] uppercase text-stone-700 border border-stone-900 px-2 py-0.5">Special History Edition</span>
        <span className="font-baskerville text-[8px] tracking-[1.5px] uppercase text-stone-700 hidden sm:block">Southern Asia Division · CMC Vellore</span>
      </div>
    </header>
  );
}

function SectionRule({ label }) {
  return (
    <div className="bg-stone-900 px-4 md:px-8 py-2">
      <span className="font-playfair text-[10px] tracking-[4px] uppercase text-[#f5f0e8] font-bold">
        {label}
      </span>
    </div>
  );
}

function HeroColumns() {
  return (
    <section className="border-b-2 border-stone-900 px-4 md:px-8 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_2fr_1px_1fr] gap-0">

        {/* Column A — Origins */}
        <div className="py-4 lg:pr-5">
          <Kicker>Origins · 1945–1953</Kicker>
          <h2 className="font-playfair text-2xl font-bold leading-tight text-stone-900 mb-2">
            The <em className="italic font-normal">Healers</em> Who First Prayed Together
          </h2>
          <p className="font-fell italic text-[13px] leading-snug text-stone-600 border-b border-stone-300 pb-3 mb-3">
            How a sponsorship programme at CMC became the seed of a congregation.
          </p>
          <Byline>By Samuel Vijayakumar &amp; Gordon E Christo</Byline>
          <BodyCopy dropCap>
            <p>
              In 1945, the Southern Asia Division entered negotiations with Christian Medical College, Vellore — envisioning a programme where Adventist students could receive world-class medical training while remaining rooted in faith.
            </p>
            <p>
              Dr. Theodore R. Flaiz was appointed to lead the sponsorship effort, and advertisements were published across the division.
            </p>
          </BodyCopy>
          <hr className="border-stone-300 my-3" />
          <PullQuote>
            "Dr. John Quinn — the first Adventist to enter CMC's co-educational programme in 1947."
          </PullQuote>
          <BodyCopy>
            <p>
              By 1953, Drs. Jacob and Ernestine Janzen had joined CMC as missionary faculty, and Sabbath worship services had found a home at the Mission Bungalow.
            </p>
          </BodyCopy>

          {/* Index Box */}
          <div className="border border-stone-900 p-3 mt-4 bg-[#ede8dc]">
            <p className="font-baskerville text-[9px] tracking-[2px] uppercase font-bold mb-2 border-b border-stone-900 pb-1">
              Inside this edition
            </p>
            {[
              ["Founding of the church", "Col. B"],
              ["The Chitteri village school", "Col. C"],
              ["Youth Centre dedicated", "Pg. 2"],
              ["The building, 1975", "Pg. 2"],
              ["Alumni: every continent", "Pg. 3"],
            ].map(([item, ref]) => (
              <div key={item} className="flex justify-between font-baskerville text-[11px] py-1 border-b border-dotted border-stone-300 last:border-0">
                <span>{item}</span>
                <span className="text-stone-500">{ref}</span>
              </div>
            ))}
          </div>
        </div>

        <ColDivider />

        {/* Column B — Founding (centre, wider) */}
        <div className="py-4 lg:px-6 border-t-2 lg:border-t-0 border-stone-200">
          <Kicker>Founding · November 29, 1958</Kicker>
          <h2 className="font-playfair text-4xl md:text-5xl font-black leading-[1.0] text-stone-900 mb-2">
            Vellore's <em className="italic font-normal">Adventist</em> Church Is Organized
          </h2>
          <p className="font-fell italic text-sm leading-snug text-stone-600 border-b border-stone-300 pb-3 mb-3">
            Twenty-three charter members gather in a living room — and write history.
          </p>
          <Byline>Staff Correspondent · Vellore</Byline>

          {/* Founding stats bar */}
          <div className="border border-stone-900 bg-[#ede8dc] p-4 mb-4">
            <div className="grid grid-cols-3 divide-x divide-stone-900 text-center">
              {[
                { icon: "✝", label: "Maranatha Bungalow" },
                { num: "23", label: "Charter members" },
                { num: "2", label: "Languages" },
              ].map((s, i) => (
                <div key={i} className="px-3">
                  {s.icon
                    ? <p className="font-fraktur text-3xl leading-none">{s.icon}</p>
                    : <p className="font-playfair text-4xl font-black leading-none">{s.num}</p>
                  }
                  <p className="font-baskerville text-[9px] tracking-[1px] uppercase text-stone-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="font-baskerville text-[9px] italic text-stone-500 text-center mt-3">
              English and Tamil Sabbath Schools operated simultaneously from day one.
            </p>
          </div>

          <PhotoPlaceholder
            caption="Dr. Albert J. Patt's Maranatha Bungalow — the first home of the Vellore Adventist Church, 1958."
            height="h-44"
            label="Photograph: Maranatha Bungalow"
          />

          <BodyCopy dropCap>
            <p>
              On the twenty-ninth day of November, 1958, the Vellore Adventist Church was officially organized — its charter signed by twenty-three faithful members who had been meeting informally for years in the living room of Dr. Albert J. Patt's Maranatha Bungalow on the CMC campus.
            </p>
            <p>
              English and Tamil Sabbath Schools operated simultaneously under the same roof. Members were trained in church leadership and evangelism — quietly building a pipeline that would send workers into India, Pakistan, Nepal, Burma, Malaysia, and Singapore.
            </p>
            <p>
              By 1963 the membership had grown to thirty-five. Midweek prayer meetings, singing bands, literature ministry, and village Sabbath Schools had all become established ministries.
            </p>
          </BodyCopy>
          <PullQuote>
            "Two languages. One calling. Twenty-three people who changed everything."
          </PullQuote>
          <BodyCopy>
            <p>
              Dr. Patt and Dr. Small were later acknowledged for their singular contributions to the congregation's early shape and character.
            </p>
          </BodyCopy>
        </div>

        <ColDivider />

        {/* Column C — Sidebar stories */}
        <div className="py-4 lg:pl-5 border-t-2 lg:border-t-0 border-stone-200 space-y-4">
          <NumberBox num="79" label="Years of unbroken ministry" inverted />

          <Kicker>Village Ministry · 1954</Kicker>
          <h3 className="font-playfair text-lg font-bold leading-snug text-stone-900 mb-1">
            A Courtyard School in Chitteri <em className="italic font-normal">Village</em>
          </h3>
          <p className="font-fell italic text-xs text-stone-600 mb-2">
            Dr. Patt, six students, and seventy children — born in a headman's courtyard.
          </p>
          <PhotoPlaceholder
            caption="Chitteri village, where Branch Sabbath School was founded in 1954."
            height="h-28"
            label="Photograph: Chitteri village"
          />
          <BodyCopy>
            <p>
              In 1954, Dr. Patt and six students founded a Branch Sabbath School in Chitteri village. The headman offered his family courtyard. Over seventy children gathered weekly. Several were helped into Adventist education at Lowry Memorial College.
            </p>
          </BodyCopy>
          <hr className="border-stone-300" />

          <Kicker>Eye Camps · 1968</Kicker>
          <h3 className="font-playfair text-base font-bold leading-snug text-stone-900 mb-1">
            Dr. Abraham Organises <em className="italic font-normal">Cataract Surgeries</em>
          </h3>
          <BodyCopy>
            <p>
              Adventist ophthalmologist Dr. John C. Abraham organised eye camps for surrounding communities in 1968, as sixteen Adventist students were enrolled in medical training.
            </p>
          </BodyCopy>
          <hr className="border-stone-300" />

          <Kicker>Retreat · 1969</Kicker>
          <h3 className="font-playfair text-base font-bold leading-snug text-stone-900 mb-1">
            First Retreat at <em className="italic font-normal">Horsley Hills</em>
          </h3>
          <BodyCopy>
            <p>
              Medical students, staff, pastors, and alumni gathered at Horsley Hills for the first Adventist church retreat — a tradition of fellowship and renewal.
            </p>
          </BodyCopy>
        </div>

      </div>
    </section>
  );
}

function MilestoneBand() {
  return (
    <section className="px-4 md:px-8 py-5 border-b-2 border-stone-900">
      <h2 className="font-playfair text-[13px] font-bold tracking-[3px] uppercase border-b-2 border-stone-900 pb-2 mb-4">
        Chronicle of Milestones — 1947 to 1975
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-x divide-stone-900 border border-stone-900">
        {MILESTONES.map((m) => (
          <div
            key={m.year}
            className={`p-3 ${m.featured ? "bg-stone-900 text-[#f5f0e8]" : "bg-[#f5f0e8] text-stone-900"}`}
          >
            <p className={`font-playfair text-xl font-black leading-none ${m.featured ? "text-[#f5f0e8]" : "text-stone-900"}`}>
              {m.year}
            </p>
            <div className={`w-2 h-2 rounded-full my-2 ${m.featured ? "bg-[#f5f0e8]" : "bg-stone-900"}`} />
            <p className={`font-baskerville text-[10px] leading-snug ${m.featured ? "text-stone-300" : "text-stone-700"}`}>
              {m.event}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BottomColumns() {
  return (
    <section className="border-b-2 border-stone-900 px-4 md:px-8 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1px_1fr_1px_1fr] gap-0">

        {/* Col A — Dedication */}
        <div className="py-4 lg:pr-6">
          <Kicker>Dedication · 1975</Kicker>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold leading-tight text-stone-900 mb-2">
            After 17 Years, <em className="italic font-normal">A Building of Their Own</em>
          </h2>
          <p className="font-fell italic text-sm leading-snug text-stone-600 border-b border-stone-300 pb-3 mb-3">
            Construction began in 1973. Pastor C. P. Jonahs presided over the dedication.
          </p>

          <PhotoPlaceholder
            caption="The Vellore Seventh-day Adventist Church building, dedicated 1975. Designed by R. S. Senseman."
            height="h-52"
            label="Photograph: Church building, 1975"
          />

          <BodyCopy dropCap>
            <p>
              The congregation had worshipped in borrowed rooms for nearly two decades. In 1973, construction finally began on a permanent church building — designed by R. S. Senseman to seat one hundred and twenty worshippers — funded entirely by donations from members and supporters who had long believed this day would come.
            </p>
            <p>
              Two years later, under the pastoral care of C. P. Jonahs, the Vellore Seventh-day Adventist Church was officially dedicated. The membership stood at 120 — five times what it had been at founding.
            </p>
          </BodyCopy>
          <PullQuote>
            "From a living room to a sanctuary — 17 years of faithfulness made permanent in stone and timber."
          </PullQuote>
          <BodyCopy>
            <p>
              Today the building stands as a testament to the vision of those twenty-three who first signed the charter in 1958, and to every student, doctor, pastor, and layperson who gave their faith practical form.
            </p>
          </BodyCopy>
        </div>

        <ColDivider />

        {/* Col B — Global reach */}
        <div className="py-4 lg:px-5 border-t-2 lg:border-t-0 border-stone-200">
          <Kicker>Global Reach</Kicker>
          <h3 className="font-playfair text-xl font-bold leading-snug text-stone-900 mb-1">
            Alumni Serve on <em className="italic font-normal">Every Continent</em>
          </h3>
          <p className="font-fell italic text-xs text-stone-600 mb-3">
            A legacy measured not in buildings, but in lives carried across the world.
          </p>
          <BodyCopy>
            <p>
              Graduates have established Adventist hospitals, sanatoriums, and medical educational services spanning two major divisions of the world church.
            </p>
          </BodyCopy>

          <div className="border border-stone-900 p-3 my-3 bg-[#ede8dc]">
            <p className="font-baskerville text-[9px] tracking-[2px] uppercase font-bold mb-2 text-center">
              Countries reached
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {COUNTRIES.map(c => (
                <span key={c} className="font-baskerville text-[10px] border border-stone-900 px-2 py-0.5 bg-[#f5f0e8]">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <BodyCopy>
            <p>
              The Southern Asia Division and the Southern Asia Pacific Ocean Division have both been shaped by graduates of this small congregation in Vellore.
            </p>
          </BodyCopy>

          <PhotoPlaceholder
            caption="Church alumni in service across South and Southeast Asia."
            height="h-32"
            label="Photograph: Alumni outreach"
          />
        </div>

        <ColDivider />

        {/* Col C — Numbers + Legacy ad */}
        <div className="py-4 lg:pl-5 border-t-2 lg:border-t-0 border-stone-200">
          <NumberBox num="120" label="Members by 1975" inverted />
          <NumberBox num="21+" label="CMC graduates" />

          <div className="border-2 border-stone-900 p-4 mt-3 text-center bg-[#ede8dc]">
            <p className="font-fraktur text-2xl text-stone-900 leading-none mb-2">The Vellore Witness</p>
            <hr className="border-stone-900 mb-2" />
            <p className="font-fell italic text-[11px] leading-relaxed text-stone-600">
              "We invite your continued prayers and support as this church empowers a new generation to carry the mission of the Gospel to the ends of the earth."
            </p>
            <hr className="border-stone-900 mt-2 mb-2" />
            <p className="font-baskerville text-[8px] tracking-[2px] uppercase text-stone-500">
              Est. 1947 · Vellore, India
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {LEGACY_STATS.map(s => (
              <div key={s.label} className="flex items-baseline gap-3 border-b border-dotted border-stone-300 pb-2 last:border-0">
                <span className="font-playfair text-2xl font-black text-stone-900 leading-none w-12 shrink-0">{s.num}</span>
                <span className="font-baskerville text-[10px] tracking-[1.5px] uppercase text-stone-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-4 md:px-8 py-3 border-t-[3px] border-double border-stone-900 flex flex-wrap justify-between gap-2">
      <span className="font-baskerville text-[9px] tracking-[1.5px] uppercase text-stone-500">
        © Seventh-day Adventist English Church, Vellore
      </span>
      <span className="font-baskerville text-[9px] tracking-[1.5px] uppercase text-stone-500">
        Samuel Vijayakumar · Gordon E Christo
      </span>
      <span className="font-baskerville text-[9px] tracking-[1.5px] uppercase text-stone-500">
        Southern Asia Division · 79 years of ministry
      </span>
    </footer>
  );
}

// ─── SCROLL REVEAL HOOK ───────────────────────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  useScrollReveal();

  return (
    <>
      {/* Inline global styles for fonts + paper texture + drop cap + reveal animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=IM+Fell+English:ital@0;1&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

        .font-fraktur  { font-family: 'UnifrakturMaguntia', cursive; }
        .font-playfair { font-family: 'Playfair Display', Georgia, serif; }
        .font-fell     { font-family: 'IM Fell English', Georgia, serif; }
        .font-baskerville { font-family: 'Libre Baskerville', Georgia, serif; }

        .paper-bg {
          background-color: #f5f0e8;
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 27px,
            rgba(0,0,0,0.035) 27px,
            rgba(0,0,0,0.035) 28px
          );
        }

        .drop-cap-text > p:first-child::first-letter {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          font-weight: 900;
          float: left;
          line-height: 0.78;
          margin: 5px 6px 0 0;
          color: #1c1917;
        }

        .reveal {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* Paper top/bottom edge texture */
        .paper-edge {
          height: 5px;
          background: repeating-linear-gradient(
            90deg,
            #1c1917 0px, #1c1917 3px,
            transparent 3px, transparent 6px
          );
        }
      `}</style>

      <main className="paper-bg min-h-screen">
        <div className="paper-edge" />
        <Masthead />
        <SectionRule label="Faith · Medicine · Mission · Legacy" />
        <div className="reveal"><HeroColumns /></div>
        <div className="reveal"><MilestoneBand /></div>
        <SectionRule label="Dedication · Global Legacy · By The Numbers" />
        <div className="reveal"><BottomColumns /></div>
        <Footer />
        <div className="paper-edge" />
      </main>
    </>
  );
}

/*
──────────────────────────────────────────────────────────────────────────────
SETUP NOTES
──────────────────────────────────────────────────────────────────────────────

1. TAILWIND CONFIG — add custom fonts to tailwind.config.js:

   module.exports = {
     theme: {
       extend: {
         fontFamily: {
           fraktur:     ['UnifrakturMaguntia', 'cursive'],
           playfair:    ['Playfair Display', 'Georgia', 'serif'],
           fell:        ['IM Fell English', 'Georgia', 'serif'],
           baskerville: ['Libre Baskerville', 'Georgia', 'serif'],
         },
       },
     },
   }

2. GOOGLE FONTS — add to app/layout.jsx <head>:

   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
   <link
     href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=IM+Fell+English:ital@0;1&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
     rel="stylesheet"
   />

3. PHOTO PLACEHOLDERS — replace <PhotoPlaceholder /> with Next.js <Image />:

   import Image from "next/image";
   <Image src="/images/maranatha-bungalow.jpg" alt="..." fill className="object-cover" />

4. USAGE — place in:
   - App Router:  app/history/page.jsx
   - Pages Router: pages/history.jsx   (remove "use client", hooks still work)

──────────────────────────────────────────────────────────────────────────────
*/
