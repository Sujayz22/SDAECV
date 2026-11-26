import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata: Metadata = {
  title: 'Terms of Use — SDAECV | Seventh-day Adventist English Church, Vellore',
  description:
    'Terms of use and community guidelines for visiting and interacting with the Seventh-day Adventist English Church, Vellore digital platforms.',
};

export default function TermsPage() {
  return (
    <SmoothScroll>
      <div className="relative z-10 bg-[#f8f4ef] min-h-screen">
        <Navbar dark={false} />

        {/* ── Main Content Container ────────────────────────── */}
        <main className="mx-auto w-full max-w-4xl px-5 sm:px-8 pt-36 sm:pt-44 pb-20">
          
          {/* Header */}
          <div className="mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5b2d9c]/10 text-[#5b2d9c] text-[11px] font-black uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-sm">gavel</span>
              Terms & Conditions
            </span>
            <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#140d23] font-display">
              Terms of Use
            </h1>
            <p className="mt-3 text-sm text-[#7a6d8e] font-medium">
              Effective Date: November 2026 · Seventh-day Adventist English Church, Vellore (SDAECV)
            </p>
          </div>

          {/* Terms Body */}
          <div className="bg-white rounded-3xl border border-[#140d23]/8 p-8 sm:p-12 shadow-[0_10px_40px_-10px_rgba(20,13_35,0.06)] space-y-10 text-[#140d23]/80 text-sm sm:text-base leading-relaxed">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#5b2d9c]/10 text-[#5b2d9c] inline-flex items-center justify-center text-sm font-black">1</span>
                Acceptance of Terms
              </h2>
              <p>
                Welcome to the official website of the Seventh-day Adventist English Church, Vellore (&ldquo;SDAECV&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), located at <strong className="text-[#140d23]">sdaecv.org</strong>. By browsing, accessing, or using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our <Link href="/privacy" className="text-[#5b2d9c] font-semibold hover:underline">Privacy Policy</Link>.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#5b2d9c]/10 text-[#5b2d9c] inline-flex items-center justify-center text-sm font-black">2</span>
                Purpose & Mission
              </h2>
              <p>
                This website is maintained solely as a religious, charitable, and non-profit ministry platform to share biblical teachings, facilitate worship and fellowship, announce church events, broadcast live services, and provide spiritual study resources aligned with the Seventh-day Adventist faith.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#5b2d9c]/10 text-[#5b2d9c] inline-flex items-center justify-center text-sm font-black">3</span>
                Acceptable Conduct & Community Guidelines
              </h2>
              <p className="mb-3">
                When using our interactive features (including the prayer request portal, contact submissions, and newsletter subscriptions), you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Submit honest, respectful, and considerate messages.</li>
                <li>Refrain from posting unlawful, defamatory, abusive, threatening, or sexually explicit material.</li>
                <li>Refrain from using the website for unauthorized commercial advertising, spamming, or soliciting.</li>
                <li>Respect the sacred and spiritual nature of church communications and community prayer requests.</li>
              </ul>
              <p className="mt-3">
                SDAECV reserves the right, in its sole discretion, to moderate, review, or decline to publish any prayer requests or messages that violate these community standards.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#5b2d9c]/10 text-[#5b2d9c] inline-flex items-center justify-center text-sm font-black">4</span>
                Intellectual Property & Media Use
              </h2>
              <p>
                All content published on this website—including sermons, worship live stream recordings, sacred choral music, photographs, logos, articles, and graphic design—is the property of SDAECV or used with appropriate permission.
              </p>
              <p className="mt-2">
                You are encouraged to share links to sermons, services, and spiritual articles for personal spiritual encouragement and non-commercial evangelism. Any commercial reproduction, alteration, or republication of church media without prior written consent from the church board is strictly prohibited.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#5b2d9c]/10 text-[#5b2d9c] inline-flex items-center justify-center text-sm font-black">5</span>
                Online Giving & Contributions
              </h2>
              <p>
                Tithes, freewill offerings, and charitable donations made through our digital giving links support church ministries, local community outreach, and global missionary work. All contributions are voluntary. If you have questions regarding allocation or receipts, please contact our Church Treasury.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#5b2d9c]/10 text-[#5b2d9c] inline-flex items-center justify-center text-sm font-black">6</span>
                External Links & Third-Party Platforms
              </h2>
              <p>
                Our site may provide links to external websites, including official Seventh-day Adventist denominational portals, YouTube for livestreams, and Google Maps for directions. We do not control or endorse the content or practices of these external services and encourage you to review their respective policies.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#5b2d9c]/10 text-[#5b2d9c] inline-flex items-center justify-center text-sm font-black">7</span>
                Disclaimer & Limitation of Liability
              </h2>
              <p>
                While we make every effort to ensure that worship timings, event dates, and resource links are accurate and up to date, information is provided on an &ldquo;as is&rdquo; basis without warranties of any kind. SDAECV shall not be liable for any temporary service interruptions or technical downtime.
              </p>
            </section>

            {/* Section 8 */}
            <section className="pt-4 border-t border-[#140d23]/8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#e36520]/10 text-[#e36520] inline-flex items-center justify-center text-sm font-black">8</span>
                Contact & Governance
              </h2>
              <p className="mb-4">
                These terms are governed by the bylaws of the Seventh-day Adventist Church organization and relevant local laws in Vellore, Tamil Nadu, India. For questions regarding these terms, please contact:
              </p>
              <div className="bg-[#f8f4ef] rounded-2xl p-5 border border-[#140d23]/5 flex flex-col gap-1 text-sm">
                <p className="font-bold text-[#140d23]">Seventh-day Adventist English Church, Vellore</p>
                <p className="text-[#7a6d8e]">Otteri Road, Bagayam, Vellore, Tamil Nadu — 632002</p>
                <p className="mt-1">
                  Email:{' '}
                  <a href="mailto:sdaecv.it@gmail.com" className="text-[#5b2d9c] font-semibold hover:underline">
                    sdaecv.it@gmail.com
                  </a>
                </p>
                <p>
                  Connect:{' '}
                  <Link href="/connect" className="text-[#5b2d9c] font-semibold hover:underline">
                    sdaecv.org/connect
                  </Link>
                </p>
              </div>
            </section>

          </div>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
