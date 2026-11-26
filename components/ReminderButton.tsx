'use client';

import { useState, useEffect } from 'react';

interface ReminderButtonProps {
  event: {
    title: string;
    description?: string;
    location?: string;
    dateStr?: string;
    time?: string;
    eventDate?: Date;
  };
  variant?: 'light' | 'dark';
}

export default function ReminderButton({ event, variant = 'light' }: ReminderButtonProps) {
  const [reminded, setReminded] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);

  const storageKey = `event_reminder_${event.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

  // Read saved reminder state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved === 'true') {
          setReminded(true);
        }
      } catch (err) {
        // localStorage not available
      }
    }
  }, [storageKey]);

  const handleToggleReminder = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // If currently reminded -> Unremind
    if (reminded) {
      setReminded(false);
      try {
        localStorage.removeItem(storageKey);
      } catch (err) {}
      setTooltip('Reminder turned off');
      setTimeout(() => setTooltip(null), 2500);
      return;
    }

    // Otherwise -> Remind
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setTooltip('Notifications not supported');
      setTimeout(() => setTooltip(null), 2500);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setReminded(true);
        try {
          localStorage.setItem(storageKey, 'true');
        } catch (err) {}

        setTooltip('Reminder active for this event');

        // Show quick browser notification confirmation if service worker is ready
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification(`Reminder Set: ${event.title}`, {
              body: `We'll remind you about ${event.title}${event.time ? ` (${event.time})` : ''}. Location: ${event.location || 'Church Campus'}.`,
              icon: '/logo.png',
              badge: '/logo.png',
              tag: `reminder-${event.title.toLowerCase().replace(/\s+/g, '-')}`,
            });
          });
        }
        setTimeout(() => setTooltip(null), 3000);
      } else {
        setTooltip('Notifications blocked in browser');
        setTimeout(() => setTooltip(null), 3000);
      }
    } catch (err) {
      console.error('Error setting reminder:', err);
      setTooltip('Could not set reminder');
      setTimeout(() => setTooltip(null), 2500);
    }
  };

  const isLight = variant === 'light';

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleToggleReminder}
        aria-label={reminded ? 'Turn off reminder' : 'Turn on reminder'}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
          reminded
            ? isLight
              ? 'bg-[#e36520] text-white shadow-md shadow-[#e36520]/30 hover:bg-[#c9571a] scale-105'
              : 'bg-[#5b2d9c] text-white shadow-md shadow-[#5b2d9c]/30 hover:bg-[#4a2480] scale-105'
            : isLight
            ? 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/15'
            : 'bg-[#140d23]/5 hover:bg-[#140d23]/10 text-[#7a6d8e] hover:text-[#140d23] border border-[#140d23]/10'
        }`}
      >
        <span className="material-symbols-outlined text-[17px]">
          {reminded ? 'notifications_active' : 'add_alert'}
        </span>
      </button>

      {/* Dynamic Tooltip on Click */}
      {tooltip && (
        <div
          role="tooltip"
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[11px] font-semibold rounded-lg shadow-xl whitespace-nowrap z-40 pointer-events-none animate-fade-in ${
            isLight
              ? 'bg-white text-[#140d23] border border-white/20'
              : 'bg-[#140d23] text-white border border-white/10'
          }`}
        >
          {tooltip}
          <div
            className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${
              isLight ? 'border-t-white' : 'border-t-[#140d23]'
            }`}
          />
        </div>
      )}
    </div>
  );
}
