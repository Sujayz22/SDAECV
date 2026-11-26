import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata: Metadata = {
  title: 'Privacy Policy — SDAECV | Seventh-day Adventist English Church, Vellore',
  description:
    'Our commitment to protecting your privacy and personal data at the Seventh-day Adventist English Church, Vellore.',
};

export default function PrivacyPage() {
  return (
    <SmoothScroll>
      <div className="relative z-10 bg-[#f8f4ef] min-h-screen">
        <Navbar dark={false} />

        {/* ── Main Content Container ────────────────────────── */}
        <main className="mx-auto w-full max-w-4xl px-5 sm:px-8 pt-36 sm:pt-44 pb-20">
          
          {/* Header */}
          <div className="mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5b2d9c]/10 text-[#5b2d9c] text-[11px] font-black uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Legal & Privacy
            </span>
            <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#140d23] font-display">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-[#7a6d8e] font-medium">
              Effective Date: November 2026 · Seventh-day Adventist English Church, Vellore (SDAECV)
            </p>
          </div>

          {/* Policy Body */}
          <div className="bg-white rounded-3xl border border-[#140d23]/8 p-8 sm:p-12 shadow-[0_10px_40px_-10px_rgba(20,13,35,0.06)] space-y-10 text-[#140d23]/80 text-sm sm:text-base leading-relaxed">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#5b2d9c]/10 text-[#5b2d9c] inline-flex items-center justify-center text-sm font-black">1</span>
                Our Commitment to Your Privacy
              </h2>
              <p>
                The Seventh-day Adventist English Church, Vellore (&ldquo;SDAECV&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is dedicated to fostering a safe, respectful, and faith-filled community. We hold the trust of our congregation and digital visitors in high regard. This Privacy Policy describes how we collect, use, and protect the personal information you entrust to us through our website (<strong className="text-[#140d23]">sdaecv.org</strong>).
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#5b2d9c]/10 text-[#5b2d9c] inline-flex items-center justify-center text-sm font-black">2</span>
                Information We Collect
              </h2>
              <p className="mb-3">
                We only collect personal information that you knowingly and voluntarily provide to us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-[#140d23]">Inquiries & Contact Details:</strong> When you reach out via our contact forms or ministry connections, we collect your name, email address, phone number, and message content.
                </li>
                <li>
                  <strong className="text-[#140d23]">Prayer Requests:</strong> Information submitted through our prayer request portal. You have the option to mark prayer requests as private (shared exclusively with the pastoral team) or public (shared on our church community prayer wall).
                </li>
                <li>
                  <strong className="text-[#140d23]">Event Participation:</strong> Information provided when registering for church retreats, youth programs, or special services.
                </li>
                <li>
                  <strong className="text-[#140d23]">Push Notifications & Reminders:</strong> If you opt in to browser event reminders, an anonymous push token is stored so our system can deliver reminders at the scheduled event time. You can unremind or revoke this permission in your browser settings anytime.
                </li>
                <li>
                  <strong className="text-[#140d23]">Digital Giving:</strong> Online tithes and offerings are processed securely through accredited banking and payment gateways. We never store credit/debit card numbers or sensitive financial credentials on our servers.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#5b2d9c]/10 text-[#5b2d9c] inline-flex items-center justify-center text-sm font-black">3</span>
                How We Use Your Information
              </h2>
              <p className="mb-3">
                The information you share is used strictly to support church ministry and fellowship:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing pastoral support, counseling, and prayer ministry.</li>
                <li>Responding to questions regarding worship schedules, Sabbath School, and Adventist beliefs.</li>
                <li>Sending reminders and updates about church programmes you have subscribed to.</li>
                <li>Managing church logistics, volunteer activities, and worship services.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#5b2d9c]/10 text-[#5b2d9c] inline-flex items-center justify-center text-sm font-black">4</span>
                Confidentiality & Non-Disclosure
              </h2>
              <p>
                <strong className="text-[#140d23]">We do not sell, rent, lease, or trade your personal information</strong> to any third parties or commercial advertisers. Personal information is accessible only to authorized pastoral staff and church officers directly involved in ministry administration.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#5b2d9c]/10 text-[#5b2d9c] inline-flex items-center justify-center text-sm font-black">5</span>
                Data Security
              </h2>
              <p>
                We employ standard encryption protocols (HTTPS/TLS) and secure cloud infrastructure to safeguard your information against unauthorized access, alteration, or disclosure. While no digital platform is invulnerable, we take all reasonable and standard precautions to protect your data.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#5b2d9c]/10 text-[#5b2d9c] inline-flex items-center justify-center text-sm font-black">6</span>
                Your Rights & Data Requests
              </h2>
              <p>
                You have the right to request a copy of the personal information we hold about you, request corrections, or request that your contact details or public prayer requests be removed from our records.
              </p>
            </section>

            {/* Section 7 */}
            <section className="pt-4 border-t border-[#140d23]/8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#140d23] mb-3 flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[#e36520]/10 text-[#e36520] inline-flex items-center justify-center text-sm font-black">7</span>
                Questions & Contact Information
              </h2>
              <p className="mb-4">
                If you have any questions or concerns regarding this Privacy Policy or how your data is handled, please contact our church administration:
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
