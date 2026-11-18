'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Tv, BookOpen, Volume2 } from 'lucide-react';

interface MessageSectionProps {
  channelId?: string;
}

export default function MessageSection({ channelId = '' }: MessageSectionProps) {
  const [liveInfo, setLiveInfo] = useState<{
    isLive: boolean;
    videoId: string | null;
    title: string | null;
    description: string | null;
  }>({
    isLive: false,
    videoId: null,
    title: null,
    description: null,
  });
  const [loading, setLoading] = useState(true);
  const [isPlayActive, setIsPlayActive] = useState(false);

  useEffect(() => {
    async function checkLiveStatus() {
      try {
        const res = await fetch('/api/live-check');
        if (res.ok) {
          const data = await res.json();
          setLiveInfo({
            isLive: !!data.isLive,
            videoId: data.videoId || null,
            title: data.title || null,
            description: data.description || null,
          });
        }
      } catch (err) {
        console.error('Failed to load home page live check:', err);
      } finally {
        setLoading(false);
      }
    }
    checkLiveStatus();
  }, []);

  const activeVideoId = liveInfo.videoId || 'jfKfPfyJRdk'; // Fallback video ID
  const rawTitle = liveInfo.title || 'Walking in Faith';
  
  // Clean up title (remove common trailing suffixes like channel names or pipe separators)
  const displayTitle = rawTitle.split(' | ')[0].split(' - ')[0];

  const displayDesc = liveInfo.description
    ? liveInfo.description.length > 180
      ? liveInfo.description.substring(0, 180) + '...'
      : liveInfo.description
    : 'Join us as we explore the scriptures, trust in God in the unknown, and seek spiritual growth through our weekly worship streams.';

  return (
    <section className="py-24 md:py-36 bg-[#f8f4ef] overflow-hidden relative">
      {/* Decorative ruled lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-[#140d23]/8" />
      </div>

      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Video Column — 7 cols */}
          <div className="lg:col-span-7 relative group">
            <div className="relative aspect-video overflow-hidden rounded-[2.5rem] shadow-[0_60px_120px_-30px_rgba(20,13,35,0.22)] bg-black border border-[#140d23]/5">
              {isPlayActive ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                  title="Featured Sermon Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div 
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => setIsPlayActive(true)}
                >
                  <Image
                    src={`https://img.youtube.com/vi/${activeVideoId}/maxresdefault.jpg`}
                    alt="Sermon Preview Thumbnail"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140d23]/60 via-[#140d23]/10 to-transparent transition-colors duration-300 group-hover:from-[#140d23]/40" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex size-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/30 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#5b2d9c] group-hover:border-[#5b2d9c] shadow-xl shadow-[#140d23]/30">
                      <Play className="fill-current text-white size-8 translate-x-0.5" />
                    </div>
                  </div>

                  {/* Progress bar simulation for design aesthetics */}
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/10">
                    <div className="h-full w-1/3 bg-[#e36520]" />
                  </div>
                </div>
              )}
            </div>

            {/* Floating Live / Status badge */}
            <div className="absolute -bottom-6 right-6 bg-[#5b2d9c] text-white rounded-2xl px-6 py-4 hidden md:block shadow-[0_20px_50px_-10px_rgba(91,45,156,0.5)] border border-white/10 relative z-20">
              <p className="text-[9px] uppercase tracking-[0.35em] text-white/50 mb-1 font-body">
                {liveInfo.isLive ? 'Broadcasting' : 'Latest Upload'}
              </p>
              <p className="font-display font-bold text-sm leading-tight flex items-center gap-2">
                {liveInfo.isLive ? (
                  <>
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    LIVE STREAM
                  </>
                ) : (
                  'Recorded Broadcast'
                )}
              </p>
            </div>
          </div>

          {/* Text Column — 5 cols */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-3">
              <span className={`flex h-2.5 w-2.5 rounded-full ${liveInfo.isLive ? 'bg-red-500 animate-pulse shadow-[0_0_8px_2px_rgba(239,68,68,0.5)]' : 'bg-[#5b2d9c]'}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5b2d9c] font-body">
                {liveInfo.isLive ? 'LIVE NOW' : 'LATEST MESSAGE'}
              </span>
            </div>

            <h2
              className="tracking-tight text-[#140d23] font-light leading-[1.1] mb-2"
              style={{ fontFamily: 'var(--font-newsreader), serif', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
            >
              {displayTitle}
            </h2>

            <p className="text-[#7a6d8e] text-[15px] leading-relaxed font-body max-w-md">
              {displayDesc}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => setIsPlayActive(true)}
                className="group flex h-13 items-center gap-2.5 rounded-full bg-[#5b2d9c] px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#5b2d9c]/30 hover:bg-[#4b2088] hover:-translate-y-0.5 transition-all cursor-pointer font-body"
              >
                <Play className="size-4 fill-current" />
                Watch Now
              </button>
              
              <a 
                href={`https://www.youtube.com/channel/${channelId || 'UC4ZIopIZwN-f9kYzGYmPWbA'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-13 items-center gap-2.5 rounded-full border border-[#140d23]/15 px-8 py-3.5 text-sm font-bold text-[#140d23] hover:border-[#140d23]/30 hover:bg-[#140d23]/[0.04] transition-all cursor-pointer font-body text-center"
              >
                <Volume2 className="size-4" />
                Subscribe
              </a>
            </div>

            {/* Broadcast Schedule strip */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-6 border-t border-[#140d23]/8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#5b2d9c] font-body">AY Service</p>
                <p className="text-lg font-bold font-display text-[#140d23] mt-0.5">Friday, 7:30 PM (IST)</p>
              </div>
              <div className="hidden sm:block w-px h-8 self-center bg-[#140d23]/10" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#5b2d9c] font-body">Divine Worship</p>
                <p className="text-lg font-bold font-display text-[#140d23] mt-0.5">Saturday, 10:30 AM (IST)</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
