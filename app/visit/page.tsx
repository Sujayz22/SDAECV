import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import VisitClient from './VisitClient';
import { sanityFetch } from '@/lib/sanity/live';

export const metadata: Metadata = {
  title: 'Plan Your Visit — SDAECV | Seventh-day Adventist English Church, Vellore',
  description:
    'You are welcome here. Find service times, directions, and everything you need to know for your first visit to the Seventh-day Adventist English Church, Vellore.',
};

export default async function VisitPage() {
  // Fetch visit settings singleton
  const visitSettingsResult = await sanityFetch({
    query: `*[_type == "visitPageSettings"][0]{
      expectSteps,
      schedule
    }`
  });
  const visitSettings = (visitSettingsResult?.data as any) || null;

  // Fetch FAQs
  const faqsResult = await sanityFetch({
    query: `*[_type == "faq" && category == "visit"] | order(question asc){
      question,
      answer
    }`
  });
  const faqs = (faqsResult?.data as any[]) || [];

  return (
    <SmoothScroll>
      <div className="relative z-10 bg-[#f8f4ef]">
        <Navbar dark={true} />
        <VisitClient
          expectSteps={visitSettings?.expectSteps}
          schedule={visitSettings?.schedule}
          faqs={faqs}
        />
      </div>
      <Footer />
    </SmoothScroll>
  );
}
