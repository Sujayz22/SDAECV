'use client';

import { useState, useRef, useEffect } from 'react';
import { googleCalendarUrl, icsDataUri } from '@/lib/calendar';
import type { CalendarEvent } from '@/lib/calendar';

interface AddToCalendarProps {
  event: CalendarEvent;
  /** Visual variant: 'light' for dark backgrounds, 'dark' for light backgrounds */
  variant?: 'light' | 'dark';
  className?: string;
}

export default function AddToCalendar({
  event,
  variant = 'dark',
  className = '',
}: AddToCalendarProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const gUrl = googleCalendarUrl(event);
  const icsUri = icsDataUri(event);
  const fileName = `${event.title.replace(/\s+/g, '-').toLowerCase()}.ics`;

  /* ── Style tokens ─────────────────────────────────────── */
  const btnBase =
    variant === 'light'
      ? 'border-white/25 text-white/75 hover:border-white hover:text-white hover:bg-white/10'
      : 'border-[#5b2d9c]/25 text-[#5b2d9c]/80 hover:border-[#5b2d9c] hover:text-[#5b2d9c] hover:bg-[#5b2d9c]/5';

  const dropdownBase =
    variant === 'light'
      ? 'bg-[#1a0d35]/90 border-white/10 shadow-2xl'
      : 'bg-white border-[#140d23]/8 shadow-xl';

  const itemBase =
    variant === 'light'
      ? 'text-white/75 hover:text-white hover:bg-white/10'
      : 'text-[#140d23]/80 hover:text-[#5b2d9c] hover:bg-[#5b2d9c]/5';

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger button */}
      <button
        id={`add-to-calendar-${event.title.replace(/\s+/g, '-').toLowerCase()}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-haspopup="true"
        className={`group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-widest transition-all duration-200 active:scale-95 ${btnBase}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3.5 shrink-0"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="12" y1="15" x2="12" y2="15" />
          <path d="M8 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01" />
        </svg>
        Add to Calendar
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-3 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className={`absolute bottom-full mb-2 left-0 z-50 min-w-[200px] rounded-2xl border backdrop-blur-xl overflow-hidden
            animate-in fade-in slide-in-from-bottom-2 duration-150 ${dropdownBase}`}
        >
          {/* Google Calendar */}
          <a
            href={gUrl}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors duration-150 ${itemBase}`}
          >
            {/* Google Calendar "G" icon (SVG) */}
            <svg
              viewBox="0 0 24 24"
              className="size-5 shrink-0"
              aria-hidden="true"
            >
              <path
                d="M21.805 10.023H12v4.04h5.638C16.876 16.64 14.693 18 12 18a6 6 0 1 1 0-12c1.506 0 2.88.553 3.927 1.46l2.932-2.93A9.96 9.96 0 0 0 12 2C6.477 2 2 6.477 2 12s4.477 10 10 10c5.09 0 9.5-3.8 9.5-10 0-.66-.067-1.306-.195-1.977Z"
                fill="#4285F4"
              />
              <path
                d="M3.153 7.345 6.58 9.755A5.999 5.999 0 0 1 12 6c1.506 0 2.88.553 3.927 1.46l2.932-2.93A9.96 9.96 0 0 0 12 2c-3.767 0-7.03 2.096-8.847 5.345Z"
                fill="#EA4335"
              />
              <path
                d="M12 22c2.619 0 4.99-.855 6.859-2.313l-3.166-2.683A5.976 5.976 0 0 1 12 18a5.999 5.999 0 0 1-5.638-3.938L3 16.56C4.78 19.81 8.133 22 12 22Z"
                fill="#34A853"
              />
              <path
                d="M21.805 10.023H12v4.04h5.638a5.975 5.975 0 0 1-1.945 2.944l3.166 2.683C21.021 17.855 22 15.104 22 12c0-.66-.067-1.306-.195-1.977Z"
                fill="#FBBC05"
              />
            </svg>
            Google Calendar
          </a>

          {/* Divider */}
          <div className={`h-px mx-3 ${variant === 'light' ? 'bg-white/10' : 'bg-[#140d23]/6'}`} />

          {/* Apple Calendar (.ics) */}
          <a
            href={icsUri}
            download={fileName}
            role="menuitem"
            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors duration-150 ${itemBase}`}
          >
            {/* Apple-style calendar icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-5 shrink-0"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="20" height="18" rx="3" fill="#FF3B30" />
              <rect x="2" y="4" width="20" height="7" rx="3" fill="#FF3B30" />
              <rect x="2" y="8" width="20" height="3" fill="#FF3B30" />
              <rect x="2" y="9" width="20" height="13" rx="0" fill="white" />
              <rect x="2" y="9" width="20" height="4" fill="white" />
              <text
                x="12"
                y="19"
                textAnchor="middle"
                fontSize="7"
                fontWeight="bold"
                fill="#FF3B30"
                fontFamily="system-ui"
              >
                {String(new Date().getDate())}
              </text>
            </svg>
            Apple Calendar
          </a>
        </div>
      )}
    </div>
  );
}
