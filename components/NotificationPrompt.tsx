'use client';

import { useState, useEffect } from 'react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function NotificationPrompt({ compact = false }: { compact?: boolean }) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
      setIsSupported(true);
      if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then((reg) => {
          reg.pushManager.getSubscription().then((sub) => {
            if (sub) {
              setIsSubscribed(true);
            }
          });
        });
      }
    }
  }, []);

  const handleSubscribe = async () => {
    if (!isSupported) {
      alert('Push notifications are not supported in this browser.');
      return;
    }

    setLoading(true);
    setStatusText(null);

    try {
      // 1. Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatusText('Notifications not enabled');
        setLoading(false);
        return;
      }

      // 2. Register Service Worker
      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // 3. Subscribe with PushManager
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new Error('VAPID public key is not configured');
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // 4. Save to backend
      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription,
          userAgent: navigator.userAgent,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to register subscription with church server');
      }

      setIsSubscribed(true);
      setStatusText('Subscribed! You will receive new announcements & events.');
      setTimeout(() => setStatusText(null), 5000);
    } catch (err: any) {
      console.error('[Push Subscription Error]', err);
      setStatusText('Could not enable notifications. Please try again.');
      setTimeout(() => setStatusText(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) return null;

  if (compact) {
    return (
      <div className="relative inline-flex items-center">
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={loading || isSubscribed}
          title={isSubscribed ? 'Notifications Enabled for Announcements & Events' : 'Enable Announcements & Events Notifications'}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
            isSubscribed
              ? 'bg-[#448d21]/10 text-[#448d21] border border-[#448d21]/20'
              : 'bg-white hover:bg-[#5b2d9c]/10 text-[#5b2d9c] border border-[#5b2d9c]/20 hover:border-[#5b2d9c]/40 shadow-sm'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">
            {isSubscribed ? 'notifications_active' : 'notifications'}
          </span>
          <span>{loading ? 'Enabling…' : isSubscribed ? 'Subscribed' : 'Get Notified'}</span>
        </button>
        {statusText && (
          <span className="absolute top-full mt-1.5 left-0 whitespace-nowrap text-[11px] font-medium text-[#448d21] bg-white px-2.5 py-1 rounded-md shadow-md border border-[#448d21]/20 z-20">
            {statusText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={loading || isSubscribed}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
          isSubscribed
            ? 'bg-[#448d21]/10 text-[#448d21] border border-[#448d21]/20'
            : 'bg-[#5b2d9c] hover:bg-[#4a2480] text-white shadow-md shadow-[#5b2d9c]/20 hover:-translate-y-0.5'
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">
          {isSubscribed ? 'notifications_active' : 'notifications'}
        </span>
        <span>
          {loading ? 'Setting up…' : isSubscribed ? 'Notifications Active' : 'Notify Me of New Announcements'}
        </span>
      </button>
      {statusText && (
        <span className="text-xs font-medium text-[#448d21]">{statusText}</span>
      )}
    </div>
  );
}
