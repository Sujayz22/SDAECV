import * as webpush from 'web-push';
import { client, writeClient } from '@/lib/sanity/client';

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || 'mailto:sdaecv.it@gmail.com';

if (publicKey && privateKey) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  image?: string;
  tag?: string;
}

export async function sendPushToAllSubscribers(payload: PushPayload) {
  if (!publicKey || !privateKey) {
    console.warn('[Push] VAPID keys not configured. Skipping push notification.');
    return { success: false, reason: 'VAPID keys not configured' };
  }

  // Fetch all active subscriptions from Sanity
  let subscriptions: any[] = [];
  try {
    subscriptions = await client.fetch(`*[_type == "pushSubscription"]{
      _id,
      endpoint,
      p256dh,
      auth
    }`);
  } catch (err) {
    console.error('[Push] Failed to fetch push subscriptions from Sanity:', err);
    return { success: false, error: err };
  }

  if (!subscriptions || subscriptions.length === 0) {
    return { success: true, count: 0, message: 'No active subscribers' };
  }

  const notificationString = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url || '/',
    icon: payload.icon || '/logo.png',
    image: payload.image,
    tag: payload.tag || 'sdaecv-update',
  });

  let sentCount = 0;
  let failedCount = 0;
  let removedCount = 0;

  const pushPromises = subscriptions.map(async (sub) => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth,
      },
    };

    try {
      await webpush.sendNotification(pushSubscription, notificationString);
      sentCount++;
    } catch (error: any) {
      failedCount++;
      // If subscription has expired or is unsubscribed (HTTP 404 or 410 Gone)
      if (error?.statusCode === 404 || error?.statusCode === 410) {
        try {
          await writeClient.delete(sub._id);
          removedCount++;
        } catch (delErr) {
          console.error('[Push] Failed to remove expired subscription:', delErr);
        }
      }
    }
  });

  await Promise.allSettled(pushPromises);

  return {
    success: true,
    total: subscriptions.length,
    sent: sentCount,
    failed: failedCount,
    removedExpired: removedCount,
  };
}
