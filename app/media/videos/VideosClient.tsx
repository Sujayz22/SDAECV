'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Search, X, Calendar, Clock, Tv, Volume2, Sparkles } from 'lucide-react';
import { ServiceTimeSlot, getTimingsSummary } from '@/lib/timings';

/* ── Types & Interfaces ─────────────────────────────────────────────────── */
interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  category: 'graceful-giants' | 'sing-wednesdays';
  duration: string;
  date: string;
  views?: string;
}

/* ── Video Data ─────────────────────────────────────────────────────────── */
const VIDEOS_DATA: Video[] = [
  // Graceful Giants Series
  {
    id: 'gg-1',
    youtubeId: 'tFIUd2ic1Rw',
    title: 'Graceful Giants: Exploring the Women of the Bible',
    description: 'An introduction to the Graceful Giants series, examining the monumental impacts of women of faith throughout biblical history.',
    category: 'graceful-giants',
    duration: '2:27',
    date: 'Oct 12, 2022',
  },
  {
    id: 'gg-2',
    youtubeId: 'dm9bFGfzSno',
    title: 'Miriam - Service and Forgiveness',
    description: 'A study on Miriam\'s journey of leadership, her musical worship, and the deep lessons of humility, service, and reconciliation.',
    category: 'graceful-giants',
    duration: '4:26',
    date: 'Oct 19, 2022',
  },
  {
    id: 'gg-3',
    youtubeId: 'JEdJkXpqTFk',
    title: 'Hannah - The Fulfilment and Joy',
    description: 'Exploring Hannah\'s heart-wrenching prayers, her unwavering trust in God, and the ultimate joy of her dedicated vow.',
    category: 'graceful-giants',
    duration: '5:48',
    date: 'Oct 26, 2022',
  },
  {
    id: 'gg-4',
    youtubeId: 'U6L-EiI2t58',
    title: 'Naomi, A Mentor',
    description: 'Understanding the power of mentorship, legacy, and support as seen through Naomi\'s relationship with Ruth in times of harvest.',
    category: 'graceful-giants',
    duration: '4:18',
    date: 'Nov 02, 2022',
  },
  {
    id: 'gg-5',
    youtubeId: 'BP7XL8trtUs',
    title: 'Rahab - Mercy and Respect',
    description: 'How Rahab\'s faith and hospitality transformed her family\'s destiny, illustrating God\'s boundless grace and redemption.',
    category: 'graceful-giants',
    duration: '5:28',
    date: 'Nov 09, 2022',
  },
  {
    id: 'gg-6',
    youtubeId: '1LYRSGXkSBg',
    title: 'Phoebe - A Helper, A Protector',
    description: 'A look at Phoebe\'s active role in the early church as a trusted deaconess, helper of many, and key messenger for the Apostle Paul.',
    category: 'graceful-giants',
    duration: '3:53',
    date: 'Nov 16, 2022',
  },
  {
    id: 'gg-7',
    youtubeId: 'PJ_u0-n49w8',
    title: 'The Captive Maid: Peace and Mercy',
    description: 'A small servant girl\'s mighty witness of faith and healing, bringing Naaman the Syrian commander to the true God.',
    category: 'graceful-giants',
    duration: '3:17',
    date: 'Nov 23, 2022',
  },
  {
    id: 'gg-8',
    youtubeId: '-UpJvFQ1ujM',
    title: 'The Healed Woman - Faith and Healing',
    description: 'Reflecting on the woman who touched the hem of Jesus\' garment, demonstrating that faith is the key to restoration and peace.',
    category: 'graceful-giants',
    duration: '5:13',
    date: 'Nov 30, 2022',
  },
  {
    id: 'gg-9',
    youtubeId: 'V9z4iqTH7Zk',
    title: 'Mary - Acceptance',
    description: 'A devotional on Mary\'s willing submission, saying "Let it be to me according to your word" in the face of the miraculous.',
    category: 'graceful-giants',
    duration: '5:22',
    date: 'Dec 07, 2022',
  },
  {
    id: 'gg-10',
    youtubeId: 'XXjVrcicqqc',
    title: 'Anna - Patience and Prayer',
    description: 'The story of the prophetess Anna, whose decades of devotion and prayer in the temple culminated in seeing the Savior.',
    category: 'graceful-giants',
    duration: '3:53',
    date: 'Dec 14, 2022',
  },
  {
    id: 'gg-11',
    youtubeId: 'de5_n99kI_Y',
    title: 'The Elect Lady - Loved and Respected',
    description: 'Lessons on walking in truth, love, and spiritual boundaries from the Apostle John\'s letter to the Elect Lady.',
    category: 'graceful-giants',
    duration: '5:20',
    date: 'Dec 21, 2022',
  },
  {
    id: 'gg-12',
    youtubeId: 'tfSKgNbEPbM',
    title: 'Lydia - A Hospitable Businesswoman',
    description: 'A study on Lydia\'s open heart and open home, marking the start of the early church\'s growth in Philippi.',
    category: 'graceful-giants',
    duration: '2:34',
    date: 'Dec 28, 2022',
  },
  {
    id: 'gg-13',
    youtubeId: '-sGAOr7IiG4',
    title: 'Rhoda - Faithful Servant Girl',
    description: 'A joyful message about Rhoda\'s persistent, simple faith that Peter was indeed at the gate, inspiring the church to believe.',
    category: 'graceful-giants',
    duration: '2:33',
    date: 'Jan 04, 2023',
  },

  // Let's sing - Wednesdays
  {
    id: 'sw-1',
    youtubeId: '4YNFaFkreq4',
    title: 'Jesus and Me — Let\'s Sing #7',
    description: 'A beautiful evening of music and praise focusing on our personal walk with Jesus. Originally broadcast on July 28, 2021.',
    category: 'sing-wednesdays',
    duration: '41:10',
    date: 'Jul 28, 2021',
  },
  {
    id: 'sw-2',
    youtubeId: 'f6vhCMLp39U',
    title: 'In the Garden — Let\'s Sing #6',
    description: 'Reflective singing session centered around the classic hymn "In the Garden" and the peace of early morning devotion. July 07, 2021.',
    category: 'sing-wednesdays',
    duration: '51:02',
    date: 'Jul 07, 2021',
  },
  {
    id: 'sw-3',
    youtubeId: 'jd_yAR8ccsI',
    title: 'Freedom in Christ (Part II) — Let\'s Sing #5',
    description: 'Part two of our mid-week singing band celebration of the freedom and grace we receive in Christ Jesus.',
    category: 'sing-wednesdays',
    duration: '42:56',
    date: 'Jul 02, 2021',
  },
  {
    id: 'sw-4',
    youtubeId: '-QTNtfoamUs',
    title: 'Freedom in Christ — Let\'s Sing #5',
    description: 'Part one of our Wednesday evening worship exploring spiritual liberty, singing praise hymns of deliverance. June 29, 2021.',
    category: 'sing-wednesdays',
    duration: '16:32',
    date: 'Jun 29, 2021',
  },
  {
    id: 'sw-5',
    youtubeId: '6TN-CO8CQS4',
    title: 'Jesus & Me — Let\'s Sing #4',
    description: 'Congregational praise, string accompaniment, and testimony during our fourth installment of Wednesday Let\'s Sing. June 23, 2021.',
    category: 'sing-wednesdays',
    duration: '48:02',
    date: 'Jun 23, 2021',
  },
  {
    id: 'sw-6',
    youtubeId: 'Bbeju_xS5Ms',
    title: 'Let\'s Sing #3',
    description: 'Mid-week singing service of praise and adoration featuring local vocalists and prayer request intercessions. June 16, 2021.',
    category: 'sing-wednesdays',
    duration: '53:12',
    date: 'Jun 16, 2021',
  },
  {
    id: 'sw-7',
    youtubeId: 'IX4Mc2GpQho',
    title: 'Let\'s Sing #2',
    description: 'Weekly congregational hymn session coordinating vocal harmonies and instrumental dedication. June 09, 2021.',
    category: 'sing-wednesdays',
    duration: '51:53',
    date: 'Jun 09, 2021',
  },
  {
    id: 'sw-8',
    youtubeId: '4ulRecP1008',
    title: 'Let\'s Sing #1',
    description: 'Inaugural mid-week praise service by the SDAECV Singing Band to bring encouragement and fellowship. June 02, 2021.',
    category: 'sing-wednesdays',
    duration: '40:10',
    date: 'Jun 02, 2021',
  },
  {
    id: 'sw-9',
    youtubeId: 'DmiPf9cxz0Y',
    title: 'Jesus & Me — Let\'s Sing #8',
    description: 'An extended evening worship praise set focused on Jesus our Savior. Broadcast live on August 04, 2021.',
    category: 'sing-wednesdays',
    duration: '1:13:50',
    date: 'Aug 04, 2021',
  },
];

const LIVESTREAM_YT_ID = 'jfKfPfyJRdk'; // Placeholder for the latest or active livestream

interface SanitySermonVideo {
  youtubeId: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  date: string;
}

interface VideosClientProps {
  channelId: string;
  videos?: SanitySermonVideo[];
  serviceTimes?: ServiceTimeSlot[];
}

export default function VideosClient({ channelId, videos: propVideos, serviceTimes }: VideosClientProps) {
  const timings = getTimingsSummary(serviceTimes);
  const [activeTab, setActiveTab] = useState<'all' | 'graceful-giants' | 'sing-wednesdays'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveInfo, setLiveInfo] = useState<{ isLive: boolean; videoId: string | null }>({
    isLive: false,
    videoId: null,
  });
  const [liveLoading, setLiveLoading] = useState(true);

  const resolvedVideos = useMemo((): Video[] => {
    if (!propVideos || propVideos.length === 0) return VIDEOS_DATA;
    return propVideos.map((v, idx) => ({
      id: `sv-${idx + 1}`,
      youtubeId: v.youtubeId,
      title: v.title,
      description: v.description,
      category: v.category as 'graceful-giants' | 'sing-wednesdays',
      duration: v.duration,
      date: v.date,
      views: undefined
    }));
  }, [propVideos]);

  useEffect(() => {
    async function getLiveInfo() {
      try {
        const res = await fetch('/api/live-check');
        if (res.ok) {
          const data = await res.json();
          setLiveInfo({
            isLive: !!data.isLive,
            videoId: data.videoId || null,
          });
        }
      } catch (e) {
        console.error('Failed to fetch live info:', e);
      } finally {
        setLiveLoading(false);
      }
    }
    getLiveInfo();
  }, []);

  const activeLiveId = liveInfo.videoId || LIVESTREAM_YT_ID;

  // Filters logic
  const filteredVideos = useMemo(() => {
    return resolvedVideos.filter((video) => {
      const matchesTab = activeTab === 'all' || video.category === activeTab;
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, resolvedVideos]);

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto">
      {/* ── Page Header ── */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="h-px w-8 bg-[#e36520]" />
          <span className="text-[#e36520] font-bold tracking-[0.2em] uppercase text-xs">
            Media Library
          </span>
          <span className="h-px w-8 bg-[#e36520]" />
        </div>
        <h1
          className="text-5xl md:text-6xl text-[#140d23] mb-6 leading-tight tracking-tight"
          style={{ fontFamily: 'var(--font-newsreader)' }}
        >
          Our <em className="italic text-[#5b2d9c]">Video</em> Archive
        </h1>
        <p className="text-[#7a6d8e] text-base leading-relaxed">
          Browse our mid-week singing band collections, natural reflections, and weekly live broadcasts to stay connected and inspired.
        </p>
      </div>

      {/* ── Featured / Live Stream Section ── */}
      <section className="mb-20 -mx-6 sm:mx-0">
        <div className="bg-[#140d23] rounded-none sm:rounded-3xl overflow-hidden border-y sm:border border-white/10 shadow-2xl relative">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5b2d9c]/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#e36520]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] xl:grid-cols-[1.35fr_1fr] gap-0 items-stretch">
            {/* Live Player Container */}
            <div className="relative aspect-[16/10] sm:aspect-video lg:aspect-auto lg:h-full w-full bg-black min-h-[220px] sm:min-h-[320px] lg:min-h-full">
              {isLiveActive ? (
                <iframe
                  className="w-full h-full lg:absolute lg:inset-0"
                  src={`https://www.youtube.com/embed/${activeLiveId}?autoplay=1&rel=0`}
                  title="SDAECV Live Stream"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full group lg:absolute lg:inset-0">
                  <Image
                    src={`https://img.youtube.com/vi/${activeLiveId}/maxresdefault.jpg`}
                    alt="Live Stream Preview"
                    fill
                    className="object-cover opacity-80"
                    priority
                  />
                  <div className="absolute inset-0 bg-[#140d23]/40 group-hover:bg-[#140d23]/25 transition-colors duration-500" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsLiveActive(true)}
                      className="size-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:bg-[#e36520] hover:border-[#e36520] hover:shadow-[0_0_30px_rgba(227,101,32,0.4)]"
                    >
                      <Play className="fill-current size-8 translate-x-0.5 animate-pulse" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Live Description / Meta */}
            <div className="p-8 sm:p-12 flex flex-col justify-center text-white relative z-10 min-h-[320px] lg:min-h-[400px]">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-3 w-3 relative">
                    {liveInfo.isLive && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${liveInfo.isLive ? 'bg-red-600' : 'bg-gray-500'}`}></span>
                  </span>
                  <span className={`${liveInfo.isLive ? 'text-red-500' : 'text-gray-400'} font-bold tracking-[0.15em] uppercase text-xs`}>
                    {liveInfo.isLive ? 'Latest Live Broadcast' : 'Latest Recorded Broadcast'}
                  </span>
                </div>

                <h2
                  className="text-3xl md:text-4xl text-white mb-4 leading-tight font-light"
                  style={{ fontFamily: 'var(--font-newsreader)' }}
                >
                  SDA English Church, Vellore <br />
                  <em className="italic text-[#f5d78e] font-normal">
                    {liveInfo.isLive ? 'Worship Service' : 'Recorded Service'}
                  </em>
                </h2>

                <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xl">
                  Join us online every {timings.ay.day} evening at {timings.ay.timeOnly} for AY Service, and Saturday (Sabbath) morning starting at {timings.sabbathSchool.timeOnly} for Sabbath School and {timings.divineService.timeOnly} for Divine Worship, special praise reports, and community announcements. Tune in live or replay our latest broadcast.
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-white/50 mb-8 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-1.5 bg-white/5 px-3.5 py-2 rounded-full border border-white/5">
                    <Tv className="size-3.5" />
                    <span>Weekly Stream</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://www.youtube.com/channel/${channelId || 'UC4ZIopIZwN-f9kYzGYmPWbA'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#e36520] text-white font-bold py-3.5 px-8 rounded-full text-sm transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto bg-[#e36520] hover:bg-[#c9571a] hover:border-[#c9571a] hover:shadow-lg hover:shadow-[#e36520]/20 text-center cursor-pointer"
                >
                  <Tv className="size-4" />
                  Subscribe on YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Filter & Search Bar ── */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white/50 backdrop-blur-sm p-3.5 rounded-2xl border border-[#140d23]/5 shadow-sm">
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto p-1 bg-[#140d23]/5 rounded-xl">
            {(['all', 'graceful-giants', 'sing-wednesdays'] as const).map((tab) => {
              const label =
                tab === 'all'
                  ? 'All Archive'
                  : tab === 'graceful-giants'
                    ? 'Graceful Giants'
                    : "Let's Sing - Wednesdays";
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg transition-all duration-300 cursor-pointer ${active
                    ? 'bg-white text-[#140d23] shadow-sm'
                    : 'text-[#140d23]/60 hover:text-[#140d23] hover:bg-white/30'
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#7a6d8e]" />
            <input
              type="text"
              placeholder="Search videos by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3 bg-[#f8f4ef] border border-[#140d23]/10 focus:border-[#5b2d9c] focus:outline-none rounded-xl text-sm transition-all placeholder:text-[#7a6d8e]/60 text-[#140d23]"
            />
          </div>
        </div>
      </section>

      {/* ── Video Grid ── */}
      <section className="min-h-[400px]">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video) => (
              <motion.div
                layout
                key={video.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#140d23]/5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
                onClick={() => setActiveVideo(video)}
              >
                {/* Thumbnail Area */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                  <Image
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#0c0818]/20 group-hover:bg-[#0c0818]/10 transition-colors duration-500" />

                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur text-[#140d23] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-black/5 shadow-sm">
                    {video.category === 'graceful-giants' ? 'Graceful Giants' : "Let's Sing"}
                  </span>

                  {/* Play Button Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="size-14 rounded-full bg-[#5b2d9c] text-white flex items-center justify-center shadow-lg shadow-[#5b2d9c]/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="fill-current size-5 translate-x-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <span className="absolute bottom-4 right-4 bg-black/75 backdrop-blur text-white text-[10px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Clock className="size-3" />
                    {video.duration}
                  </span>
                </div>

                {/* Metadata & Title */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-[#7a6d8e] mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span>{video.date}</span>
                      </div>
                      {video.views && (
                        <>
                          <span className="size-1 rounded-full bg-[#7a6d8e]/35" />
                          <span>{video.views}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-[#140d23] group-hover:text-[#5b2d9c] transition-colors duration-300 line-clamp-2 leading-snug mb-3">
                      {video.title}
                    </h3>

                    <p className="text-sm text-[#7a6d8e] leading-relaxed line-clamp-3">
                      {video.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#140d23]/5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#5b2d9c] group-hover:text-[#e36520] transition-colors">
                    <span>Watch Now</span>
                    <Play className="size-3 fill-current" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty Search State */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-24 bg-white/20 border border-dashed border-[#140d23]/10 rounded-3xl">
            <Sparkles className="size-12 text-[#7a6d8e]/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#140d23] mb-2">No videos found</h3>
            <p className="text-[#7a6d8e] max-w-sm mx-auto text-sm leading-relaxed">
              We couldn&apos;t find any videos matching &ldquo;{searchQuery}&rdquo;. Try checking the category tabs or simplifying your terms.
            </p>
          </div>
        )}
      </section>

      {/* ── Immersive Lightbox Modal ── */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0c0818]/95 flex items-center justify-center p-4 md:p-8"
          >
            {/* Background click to close */}
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => setActiveVideo(null)}
            />

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="bg-[#140d23] rounded-3xl overflow-hidden border border-white/10 w-full max-w-4xl relative z-10 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
              >
                <X className="size-5" />
              </button>

              {/* Responsive Video Container */}
              <div className="aspect-video w-full bg-black relative">
                <iframe
                  className="w-full h-full absolute inset-0"
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Text Info Area */}
              <div className="p-6 md:p-8 text-white">
                <span className="inline-block bg-[#e36520] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                  {activeVideo.category === 'graceful-giants' ? 'Graceful Giants' : "Let's Sing - Wednesdays"}
                </span>
                <h3
                  className="text-2xl md:text-3xl text-white mb-3 font-medium leading-tight"
                  style={{ fontFamily: 'var(--font-newsreader)' }}
                >
                  {activeVideo.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
                  {activeVideo.description}
                </p>
                <div className="mt-6 flex items-center gap-4 text-xs text-white/40">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>Uploaded on {activeVideo.date}</span>
                  </div>
                  <span className="size-1 rounded-full bg-white/10" />
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    <span>{activeVideo.duration} mins</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
