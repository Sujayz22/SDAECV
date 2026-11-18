import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import EventsClient from './EventsClient';
import { sanityFetch } from '@/lib/sanity/live';

export const metadata: Metadata = {
  title: 'Events & Calendar — SDAECV | Seventh Day Adventist English Church, Vellore',
  description:
    'Browse upcoming events, worship services, community gatherings, and the full calendar of the Seventh-day Adventist English Church in Vellore.',
};

export default async function EventsPage() {
  // Fetch events from Sanity
  const eventsResult = await sanityFetch({
    query: `*[_type == "event"] | order(year asc, month asc, day asc){
      title,
      category,
      day,
      month,
      year,
      time,
      location,
      description,
      image {
        asset->{
          _id,
          url
        }
      },
      featured
    }`
  });
  const events = (eventsResult?.data as any[]) || [];

  return (
    <SmoothScroll>
      <div className="relative z-10 bg-[#f8f4ef]">
        <Navbar dark={true} />
        <EventsClient events={events} />
      </div>
      <Footer />
    </SmoothScroll>
  );
}
