import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import ResourcesClient from './ResourcesClient';
import { sanityFetch } from '@/lib/sanity/live';

export const metadata: Metadata = {
  title: 'Resources — SDAECV | Spiritual Growth & Bible Study Tools',
  description:
    'Explore our curated collection of spiritual growth resources — Sabbath School study guides, Bible study tools, apologetics, children\'s programmes, and live streaming channels, all in one place.',
};

export default async function ResourcesPage() {
  // Fetch resource links from Sanity
  const resourcesResult = await sanityFetch({
    query: `*[_type == "resourceLink"] | order(title asc){
      title,
      description,
      href,
      category,
      icon,
      ageGroup,
      tag
    }`
  });
  const resources = (resourcesResult?.data as any[]) || [];

  return (
    <SmoothScroll>
      <div className="relative z-10 bg-[#f8f4ef]">
        <Navbar dark={true} />
        <ResourcesClient resources={resources} />
      </div>
      <Footer />
    </SmoothScroll>
  );
}
