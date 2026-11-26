import { NextRequest, NextResponse } from 'next/server';
import { sendPushToAllSubscribers } from '@/lib/notifications';

/**
 * Endpoint to broadcast push notifications.
 * Can be triggered:
 * 1. Automatically by Sanity Webhook (when an announcement or event is published)
 * 2. Manually by an admin via POST with secret or document ID
 */
export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-webhook-secret') || req.nextUrl.searchParams.get('secret');
    const configuredSecret = process.env.SANITY_WEBHOOK_SECRET;

    if (configuredSecret && secret && secret !== configuredSecret) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Check if the payload is from a Sanity webhook or custom request
    // Sanity document could be in body or body._id / body.title
    const doc = body.document || body;
    const docType = doc._type || body._type;

    let title = body.title;
    let messageBody = body.body || body.message;
    let url = body.url || '/';
    let image = body.image;

    // Handle Sanity Announcement publish
    if (docType === 'announcement') {
      // If document explicitly turned off notifications, ignore
      if (doc.sendNotification === false) {
        return NextResponse.json({ success: true, message: 'Notification disabled for this announcement' });
      }

      title = doc.title ? `Announcement: ${doc.title}` : 'New Announcement from SDA Church Vellore';
      messageBody = doc.content
        ? (doc.content.length > 130 ? `${doc.content.substring(0, 127)}...` : doc.content)
        : (doc.date ? `Date: ${doc.date}` : 'Read the latest announcement on our website.');
      url = doc.linkUrl || '/#announcements';
    } else if (docType === 'event') {
      // Handle Sanity Event publish
      title = doc.title ? `Upcoming Event: ${doc.title}` : 'New Event at SDA Church Vellore';
      const eventDateStr = [doc.day, doc.month, doc.year].filter(Boolean).join(' ');
      const timeStr = doc.time ? ` · ${doc.time}` : '';
      messageBody = `${eventDateStr}${timeStr} - ${doc.description ? (doc.description.length > 100 ? doc.description.substring(0, 97) + '...' : doc.description) : 'Click to view event details.'}`;
      url = '/events';
    }

    if (!title || !messageBody) {
      return NextResponse.json(
        { success: false, error: 'Title and body are required for push notification' },
        { status: 400 }
      );
    }

    const result = await sendPushToAllSubscribers({
      title,
      body: messageBody,
      url,
      image,
      tag: docType || 'sdaecv-update',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API/notifications/broadcast] Error broadcasting push notification:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to broadcast notification' },
      { status: 500 }
    );
  }
}
