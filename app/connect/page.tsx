import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import ConnectClient from './ConnectClient';
import { sanityFetch } from '@/lib/sanity/live';
import { getServiceTimes } from '@/lib/sanity/timings';

export const metadata: Metadata = {
  title: 'Connect & Prayer Requests — SDAECV | Seventh Day Adventist English Church, Vellore',
  description:
    'Get in touch, submit a prayer request, find our worship schedule and location, and connect with the Seventh-day Adventist English Church community in Vellore.',
};

export default async function ConnectPage() {
  // Fetch FAQs from Sanity
  const faqsResult = await sanityFetch({
    query: `*[_type == "faq" && category == "connect"] | order(question asc){
      question,
      answer
    }`
  });
  const faqs = (faqsResult?.data as any[]) || [];

  // Fetch Ministries from Sanity
  const ministriesResult = await sanityFetch({
    query: `*[_type == "ministry"] | order(name asc){
      name,
      tagline,
      icon,
      gradient,
      description
    }`
  });
  const ministries = (ministriesResult?.data as any[]) || [];
  const serviceTimes = await getServiceTimes();

  return (
    <SmoothScroll>
      <div className="relative z-10 bg-[#f8f4ef]">
        <Navbar dark={true} />
        <ConnectClient
          faqs={faqs}
          ministries={ministries}
          serviceTimes={serviceTimes}
        />
      </div>
      <Footer />
    </SmoothScroll>
  );
}
