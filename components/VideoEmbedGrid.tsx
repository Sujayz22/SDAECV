'use client';

import { useState } from 'react';
import { Play, PlayCircle, Calendar, Clock } from 'lucide-react';

interface MockVideo {
  id: string;
  youtubeId: string; // 11-character YouTube ID
  title: string;
  description: string;
  duration: string;
  date: string;
  speaker?: string;
}

const DEFAULT_MOCK_VIDEOS: MockVideo[] = [
  {
    id: '1',
    youtubeId: 'tFIUd2ic1Rw',
    title: 'Graceful Giants: Exploring the Women of the Bible',
    description: 'An overview of the lives and leadership of pivotal women throughout biblical history, demonstrating courage, faith, and influence.',
    duration: '2:27',
    date: 'Oct 12, 2022',
    speaker: 'Pr. Abraham Mani',
  },
  {
    id: '2',
    youtubeId: '4YNFaFkreq4',
    title: 'Jesus and Me — Let\'s Sing #7',
    description: 'Join our mid-week singing band fellowship in sacred hymns and worship choruses focusing on personal devotion and walk with Christ.',
    duration: '41:10',
    date: 'Jul 28, 2021',
    speaker: 'Singing Band Team',
  },
  {
    id: '3',
    youtubeId: 'dm9bFGfzSno',
    title: 'Miriam - Service and Forgiveness',
    description: 'Examining Miriam\'s contributions to Israel\'s exodus, her praise leader role, and lessons from her restoration and forgiveness.',
    duration: '4:26',
    date: 'Oct 19, 2022',
    speaker: 'SDAECV Panel',
  },
  {
    id: '4',
    youtubeId: 'f6vhCMLp39U',
    title: 'In the Garden — Let\'s Sing #6',
    description: 'A beautiful evening devotional service featuring peace-filled hymns of sanctuary praise and mid-week prayer intercessions.',
    duration: '51:02',
    date: 'Jul 07, 2021',
    speaker: 'Worship Team',
  },
];

interface VideoEmbedGridProps {
  videos?: MockVideo[];
}

export default function VideoEmbedGrid({ videos = DEFAULT_MOCK_VIDEOS }: VideoEmbedGridProps) {
  const [selectedVideo, setSelectedVideo] = useState<MockVideo>(videos[0] || DEFAULT_MOCK_VIDEOS[0]);

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 text-[#7a6d8e]">
        No videos available in this showcase.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Spotlight Video Player */}
      <div className="bg-white rounded-3xl overflow-hidden border border-[#140d23]/5 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-0">
          {/* Main Video iframe */}
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1`}
              title={selectedVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Details & Metadata Panel */}
          <div className="p-8 flex flex-col justify-between bg-[#f8f4ef]/30">
            <div>
              <div className="flex items-center gap-3 text-xs text-[#7a6d8e] mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {selectedVideo.date}
                </span>
                <span className="size-1 rounded-full bg-[#7a6d8e]/35" />
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {selectedVideo.duration}
                </span>
              </div>

              <h2
                className="text-2xl md:text-3xl text-[#140d23] font-medium leading-snug mb-4"
                style={{ fontFamily: 'var(--font-newsreader)' }}
              >
                {selectedVideo.title}
              </h2>

              <p className="text-sm text-[#7a6d8e] leading-relaxed mb-6">
                {selectedVideo.description}
              </p>
            </div>

            {selectedVideo.speaker && (
              <div className="border-t border-[#140d23]/5 pt-4 flex items-center gap-3">
                <div className="size-8 rounded-full bg-[#5b2d9c]/10 text-[#5b2d9c] flex items-center justify-center text-xs font-bold uppercase tracking-wider">
                  {selectedVideo.speaker.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-xs text-[#7a6d8e] font-semibold">Speaker / Presenter</div>
                  <div className="text-sm font-bold text-[#140d23]">{selectedVideo.speaker}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Selection List */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#7a6d8e] mb-6 flex items-center gap-2">
          <Play className="size-3.5 fill-current text-[#e36520]" />
          Browse Showcase Collection
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video) => {
            const isPlaying = video.id === selectedVideo.id;
            return (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className={`group cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex flex-col gap-3 ${
                  isPlaying
                    ? 'bg-[#140d23] border-[#140d23] text-white shadow-md'
                    : 'bg-white border-[#140d23]/5 hover:border-[#5b2d9c]/30 hover:shadow-md text-[#140d23]'
                }`}
              >
                {/* Miniature Thumbnail Placeholder with Play Overlay */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#0c0818]/15 group-hover:bg-[#0c0818]/5 transition-colors" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className={`size-10 transition-transform duration-300 ${
                      isPlaying 
                        ? 'text-[#e36520] scale-110' 
                        : 'text-white/80 group-hover:scale-115 group-hover:text-white'
                    }`} />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <h4 className={`text-sm font-bold leading-snug line-clamp-2 transition-colors ${
                    isPlaying ? 'text-[#f5d78e]' : 'group-hover:text-[#5b2d9c]'
                  }`}>
                    {video.title}
                  </h4>
                  
                  <div className="flex items-center justify-between text-[11px] opacity-60 mt-3 font-semibold">
                    <span>{video.date}</span>
                    <span>{video.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
