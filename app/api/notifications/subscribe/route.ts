import { NextRequest, NextResponse } from 'next/server';
import { client, writeClient } from '@/lib/sanity/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription, userAgent } = body;

    if (!subscription || !subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      return NextResponse.json(
        { success: false, error: 'Invalid push subscription payload' },
        { status: 400 }
      );
    }

    if (!process.env.SANITY_API_WRITE_TOKEN) {
      console.warn('[Push] SANITY_API_WRITE_TOKEN is not configured.');
      return NextResponse.json({
        success: true,
        persisted: false,
        message: 'Write token not configured; subscription registered in browser only.',
      });
    }

    const endpoint = subscription.endpoint;
    const p256dh = subscription.keys.p256dh;
    const auth = subscription.keys.auth;

    // Check if subscription already exists to avoid duplicates
    const existing = await client.fetch(
      `*[_type == "pushSubscription" && endpoint == $endpoint][0]._id`,
      { endpoint }
    );

    if (existing) {
      // Update existing record
      await writeClient
        .patch(existing)
        .set({
          p256dh,
          auth,
          userAgent: userAgent || 'Browser',
          updatedAt: new Date().toISOString(),
        })
        .commit();
      return NextResponse.json({ success: true, updated: true });
    }

    // Create new push subscription document in Sanity
    await writeClient.create({
      _type: 'pushSubscription',
      endpoint,
      p256dh,
      auth,
      userAgent: userAgent || 'Browser',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, created: true });
  } catch (error: any) {
    console.error('[API/notifications/subscribe] Error saving subscription:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { endpoint } = body;

    if (!endpoint || !process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json({ success: true });
    }

    const existing = await client.fetch(
      `*[_type == "pushSubscription" && endpoint == $endpoint][0]._id`,
      { endpoint }
    );

    if (existing) {
      await writeClient.delete(existing);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API/notifications/subscribe] Error deleting subscription:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete subscription' },
      { status: 500 }
    );
  }
}
