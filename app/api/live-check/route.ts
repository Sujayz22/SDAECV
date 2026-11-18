import { NextResponse } from 'next/server';

export const revalidate = 300; // Edge cache for 5 minutes (300 seconds)

export async function GET() {
  const channelId = process.env.YOUTUBE_CHANNEL_ID || '';
  try {
    // 1. Time-zone conversion: Get current system time and adjust to India Standard Time (IST, UTC+5.5)
    const now = new Date();
    const utcOffsetMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const istTime = new Date(utcOffsetMs + 5.5 * 60 * 60 * 1000);

    const day = istTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
    const hour = istTime.getHours();

    // 2. Gatekeeping condition:
    // Permitted window: Friday 17:00 (5 PM) to Saturday 23:59
    // For testing: Bypassing the check to allow testing on any day of the week
    const isFridayActive = day === 5 && hour >= 17;
    const isSaturdayActive = day === 6;
    const isWithinStreamWindow = true; // Temporary bypass for testing

    if (!isWithinStreamWindow) {
      return NextResponse.json(
        { isLive: false, videoId: null, channelId, source: 'cache_shield_active' },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
          },
        }
      );
    }

    // 3. Environment variable safety check
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey || !channelId) {
      console.error('YouTube API Configuration missing. Check YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID environment variables.');
      return NextResponse.json(
        { isLive: false, videoId: null, channelId, error: 'Configuration missing' },
        { status: 500 }
      );
    }

    // 4. Query YouTube API for recent videos, ordered by date (to get latest streams and uploads immediately)
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=5&key=${apiKey}`;
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Fetch level revalidation
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`YouTube API returned error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { isLive: false, videoId: null, channelId, error: 'YouTube API failed' },
        {
          status: 502,
          headers: {
            'Cache-Control': 'public, s-maxage=60', // shorter cache on external failures
          },
        }
      );
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      // Look for any video in the recent list that is currently live
      const liveVideo = data.items.find(
        (item: any) => item.snippet && item.snippet.liveBroadcastContent === 'live'
      );

      if (liveVideo) {
        const videoId = liveVideo.id.videoId;
        const title = liveVideo.snippet.title || '';
        const description = liveVideo.snippet.description || '';
        return NextResponse.json(
          { isLive: true, videoId, channelId, title, description, source: 'active_live_stream' },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
            },
          }
        );
      }

      // If no active live stream, fallback to the single most recent video (recorded stream or upload)
      const latestVideo = data.items[0];
      const videoId = latestVideo.id.videoId;
      const title = latestVideo.snippet.title || '';
      const description = latestVideo.snippet.description || '';
      return NextResponse.json(
        { isLive: false, videoId, channelId, title, description, source: 'latest_upload_fallback' },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
          },
        }
      );
    }

    // Ultimate fallback if query returns empty
    return NextResponse.json(
      { isLive: false, videoId: null, channelId, source: 'no_videos_found' },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
        },
      }
    );
  } catch (error) {
    console.error('Unexpected error in live-check handler:', error);
    return NextResponse.json(
      { isLive: false, videoId: null, channelId, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
