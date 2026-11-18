'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const prompts = [
  { text: 'Have a prayer request?', emoji: '🙏', color: '#5b2d9c' },
  { text: 'Planning a visit?', emoji: '⛪', color: '#e36520' },
  { text: 'Have any questions?', emoji: '💬', color: '#448d21' },
];

export default function QuickConnectWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Cycle the prompts when menu is closed
  useEffect(() => {
    if (isOpen) return;
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen]);

  const activePrompt = prompts[currentPromptIndex];

  return (
    <div className="quick-connect-widget fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="mb-4 w-80 backdrop-blur-xl bg-[#140d23]/95 text-white rounded-[2.5rem] border border-white/10 p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden relative"
          >
            {/* Ambient background glows */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#5b2d9c]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#e36520]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5 px-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                  How can we help?
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e36520] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e36520]"></span>
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {/* Option 1: Prayer Request */}
                <Link
                  href="/connect?tab=inquiries#connect-form"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-3.5 rounded-3xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.05] transition-all duration-300 group cursor-pointer text-left relative overflow-hidden"
                >
                  <div className="absolute inset-y-0 left-0 w-[4px] bg-[#5b2d9c] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center rounded-r" />
                  <div className="w-10 h-10 rounded-2xl bg-[#5b2d9c]/20 text-[#c8a2ff] flex items-center justify-center flex-shrink-0 group-hover:bg-[#5b2d9c] group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white transition-colors">Prayer Request</p>
                    <p className="text-[11px] text-white/50">Let us pray with &amp; for you</p>
                  </div>
                </Link>

                {/* Option 2: Plan a Visit */}
                <Link
                  href="/visit"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-3.5 rounded-3xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.05] transition-all duration-300 group cursor-pointer text-left relative overflow-hidden"
                >
                  <div className="absolute inset-y-0 left-0 w-[4px] bg-[#e36520] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center rounded-r" />
                  <div className="w-10 h-10 rounded-2xl bg-[#e36520]/20 text-[#ffd5c0] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e36520] group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white transition-colors">Plan a Visit</p>
                    <p className="text-[11px] text-white/50">Join us this Sabbath</p>
                  </div>
                </Link>

                {/* Option 3: General Questions */}
                <Link
                  href="/connect?tab=inquiries#connect-form"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-3.5 rounded-3xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.05] transition-all duration-300 group cursor-pointer text-left relative overflow-hidden"
                >
                  <div className="absolute inset-y-0 left-0 w-[4px] bg-[#448d21] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center rounded-r" />
                  <div className="w-10 h-10 rounded-2xl bg-[#448d21]/20 text-[#a9ff8b] flex items-center justify-center flex-shrink-0 group-hover:bg-[#448d21] group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white transition-colors">Have Questions?</p>
                    <p className="text-[11px] text-white/50">Get in touch with us</p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button + Prompt Pill */}
      <div className="flex items-center gap-3">
        {/* Sleek, Modern Prompt Pill */}
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 15, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={() => setIsOpen(true)}
              className="backdrop-blur-md bg-[#140d23]/80 hover:bg-[#140d23]/90 text-white border border-white/10 px-4 py-2.5 rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.15)] flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div
                className="w-2 h-2 rounded-full transition-colors duration-500"
                style={{ backgroundColor: activePrompt.color }}
              />
              <span className="text-[13px] font-medium tracking-wide">
                {activePrompt.text}
              </span>
              <span className="text-sm">{activePrompt.emoji}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Magnetic-like Floating Action Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer select-none transition-all duration-500 outline-none relative overflow-hidden border ${
            isOpen
              ? 'bg-[#e36520] border-white/20 text-white shadow-[0_8px_32px_rgba(227,101,32,0.45)]'
              : 'bg-[#5b2d9c] border-white/10 text-white shadow-[0_8px_32px_rgba(91,45,156,0.35)] hover:shadow-[0_12px_40px_rgba(91,45,156,0.5)]'
          }`}
          aria-label="Toggle Quick Options"
        >
          {/* Animated glow ring inside the button on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-[#e36520]/30 to-[#5b2d9c]/30 opacity-0 transition-opacity duration-500 rounded-full"
            style={{ opacity: isHovered && !isOpen ? 1 : 0 }}
          />

          <motion.span
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="material-symbols-outlined text-[26px] z-10"
          >
            {isOpen ? 'close' : 'chat_bubble'}
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}
