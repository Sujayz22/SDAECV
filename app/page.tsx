import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WelcomeSection from "@/components/WelcomeSection";
import MissionSection from "@/components/MissionSection";
import MessageSection from "@/components/MessageSection";
import AnnouncementsSection from "@/components/AnnouncementsSection";
import EventsSection from "@/components/EventsSection";
import PrayerWallSection from "@/components/PrayerWallSection";
import FirstVisitSection from "@/components/FirstVisitSection";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { sanityFetch } from "@/lib/sanity/live";

export default async function Home() {
  // Fetch home page settings singleton
  const homeSettingsResult = await sanityFetch({
    query: `*[_type == "homePageSettings"][0]{
      heroHeadline,
      heroSubheadline,
      heroCtaText,
      heroCtaUrl,
      welcomeTitle,
      welcomeSubtitle,
      welcomeDescription,
      welcomeImage {
        asset->{
          _id,
          url
        }
      },
      serviceTimes
    }`
  });
  const homeSettings = (homeSettingsResult?.data as any) || null;

  // Fetch announcements
  const announcementsResult = await sanityFetch({
    query: `*[_type == "announcement"] | order(date desc)[0...10]{
      _id,
      title,
      date,
      category,
      content,
      linkText,
      linkUrl
    }`
  });
  const announcements = (announcementsResult?.data as any[]) || [];

  // Fetch events
  const eventsResult = await sanityFetch({
    query: `*[_type == "event"] | order(year desc, monthIndex desc, day desc)[0...10]{
      _id,
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

  // Fetch prayer requests (pinned first, both active & answered)
  const prayersResult = await sanityFetch({
    query: `*[_type == "prayerRequest" && status in ["active", "answered"]] | order(pinned desc, _createdAt desc)[0...12]{
      _id,
      name,
      date,
      request,
      answer,
      status,
      likes,
      pinned
    }`
  });
  const prayers = (prayersResult?.data as any[]) || [];

  return (
    <SmoothScroll>
      <div className="relative z-10">
        <Navbar />
        <Hero
          headline={homeSettings?.heroHeadline}
          subheadline={homeSettings?.heroSubheadline}
          ctaText={homeSettings?.heroCtaText}
          ctaUrl={homeSettings?.heroCtaUrl}
          serviceTimes={homeSettings?.serviceTimes}
        />
        <WelcomeSection
          welcomeTitle={homeSettings?.welcomeTitle}
          welcomeSubtitle={homeSettings?.welcomeSubtitle}
          welcomeDescription={homeSettings?.welcomeDescription}
          welcomeImage={homeSettings?.welcomeImage}
          serviceTimes={homeSettings?.serviceTimes}
        />
        <MissionSection />
        <MessageSection
          channelId={process.env.YOUTUBE_CHANNEL_ID || ''}
          serviceTimes={homeSettings?.serviceTimes}
        />
        <AnnouncementsSection announcements={announcements} />
        <EventsSection events={events} />
        <PrayerWallSection prayers={prayers} />
        <FirstVisitSection />
      </div>
      <Footer />
    </SmoothScroll>
  );
}
