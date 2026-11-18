'use client';

import { useState, useEffect } from 'react';

interface WatchLiveButtonProps {
  className?: string;
  onClick?: () => void;
  dark?: boolean;
  scrolled?: boolean;
  isOpen?: boolean;
  isMobile?: boolean;
}

// Custom self-contained SVG component for the YouTube logo to guarantee compile-safety
const YoutubeIcon = ({ className = 'size-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.109-2.108C19.53 3.53 12 3.53 12 3.53s-7.53 0-9.388.525a3.003 3.003 0 0 0-2.109 2.108C0 8.02 0 12 0 12s0 3.98.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.857.525 9.387.525 9.387.525s7.53 0 9.388-.525a3.003 3.003 0 0 0 2.11-2.108C24 15.98 24 12 24 12s0-3.98-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function WatchLiveButton({
  className = '',
  onClick,
  dark = true,
  scrolled = false,
  isOpen = false,
  isMobile = false,
}: WatchLiveButtonProps) {
  const [liveStatus, setLiveStatus] = useState<{
    isLive: boolean;
    videoId: string | null;
    channelId: string | null;
  }>({
    isLive: false,
    videoId: null,
    channelId: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkLiveStatus() {
      try {
        const res = await fetch('/api/live-check');
        if (res.ok) {
          const data = await res.json();
          setLiveStatus({
            isLive: !!data.isLive,
            videoId: data.videoId || null,
            channelId: data.channelId || null,
          });
        }
      } catch (err) {
        console.error('Failed to fetch live status:', err);
      } finally {
        setLoading(false);
      }
    }
    checkLiveStatus();
  }, []);

  if (loading) {
    return null;
  }

  const targetChannelId = liveStatus.channelId;

  // 1. Live State: Pulse action button
  if (liveStatus.isLive && liveStatus.videoId) {
    const liveStyle = isMobile
      ? 'text-base font-bold uppercase tracking-widest px-8 py-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2'
      : `inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] ${className}`;

    return (
      <a
        href={`https://www.youtube.com/watch?v=${liveStatus.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={liveStyle}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        Watch Live Now
      </a>
    );
  }

  // If there is no channel ID configured, do not render a link
  if (!targetChannelId) {
    return null;
  }

  // 2. Offline State: Render YouTube Channel Link Button
  if (isMobile) {
    return (
      <a
        href={`https://www.youtube.com/channel/${targetChannelId}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={`text-base font-bold uppercase tracking-widest px-8 py-3 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2 ${className}`}
      >
        <YoutubeIcon className="size-5 text-red-600" />
        YouTube
      </a>
    );
  }

  const isLightHeader = (isOpen || scrolled || !dark);
  const borderClass = isLightHeader
    ? 'border-[#140d23]/25 text-[#140d23]/80 hover:border-red-600 hover:text-red-600 hover:bg-red-50/50'
    : 'border-white/25 text-white/80 hover:border-red-500 hover:text-white hover:bg-red-600/90';

  return (
    <a
      href={`https://www.youtube.com/channel/${targetChannelId}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`text-xs font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-full border transition-all duration-300 flex items-center gap-1.5 ${borderClass} ${className}`}
    >
      <YoutubeIcon className="size-4" />
      YouTube
    </a>
  );
}
