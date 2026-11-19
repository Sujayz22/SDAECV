import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import VideosClient from './VideosClient';
import { sanityFetch } from '@/lib/sanity/live';
import { getServiceTimes } from '@/lib/sanity/timings';

export const metadata: Metadata = {
  title: 'Videos — SDAECV | Seventh Day Adventist English Church, Vellore',
  description:
    'Watch sermons, musical specials, and live streams from the Seventh-day Adventist English Church, Vellore. Browse Graceful Giants, Let\'s Sing Wednesdays, and more.',
};

export default async function VideosPage() {
  const channelId = process.env.YOUTUBE_CHANNEL_ID || '';

  // Fetch sermon videos from Sanity
  const videosResult = await sanityFetch({
    query: `*[_type == "sermonVideo"] | order(date desc){
      youtubeId,
      title,
      description,
      category,
      duration,
      date
    }`
  });
  const videos = (videosResult?.data as any[]) || [];
  const serviceTimes = await getServiceTimes();

  return (
    <SmoothScroll>
      <div className="relative z-10 bg-[#f8f4ef]">
        <Navbar dark={false} />
        <VideosClient channelId={channelId} videos={videos} serviceTimes={serviceTimes} />
      </div>
      <Footer />
    </SmoothScroll>
  );
}
