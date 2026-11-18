'use client';

import { useState } from 'react';

interface NewsletterFormProps {
  variant?: 'page' | 'post';
}

export default function NewsletterForm({ variant = 'page' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      setError(err.message || 'Failed to subscribe. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  const buttonColor = variant === 'page' ? '#ffb800' : '#f2b824';
  const buttonHoverColor = variant === 'page' ? 'hover:bg-white' : 'hover:bg-[#f2b824]/90';
  const textColor = variant === 'page' ? '#004d40' : '#004b49';
  const inputBg = variant === 'page' ? 'bg-white/5 focus:bg-white/10' : 'bg-white/10 focus:bg-white/15';
  const inputBorder = variant === 'page' ? 'border-2 border-white/10' : 'border-0';
  const inputPadding = variant === 'page' ? 'px-8 py-5' : 'px-6 py-4';
  const buttonPadding = variant === 'page' ? 'px-12 py-5' : 'px-8 py-4';
  const ringFocus = variant === 'page' ? 'focus:ring-[#ffb800]' : 'focus:ring-[#f2b824]';

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 animate-fade-in p-6 bg-white/5 rounded-2xl w-full border border-white/10 backdrop-blur-sm">
        <span className="material-symbols-outlined text-green-400 text-3xl">check_circle</span>
        <p className="text-white text-lg font-medium">Thank you for subscribing!</p>
        <p className="text-gray-300 text-sm">We have added you to our weekly update list.</p>
        <button
          onClick={() => setSuccess(false)}
          className="text-xs text-white/50 hover:text-white underline mt-2 transition-colors cursor-pointer"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full gap-4 mt-6">
        <input
          required
          disabled={loading}
          className={`flex-1 rounded-full text-white placeholder-gray-400 focus:ring-2 ${ringFocus} ${inputBg} ${inputBorder} ${inputPadding} transition-all outline-none text-base`}
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          placeholder={variant === 'page' ? 'Email address' : 'Enter your email address'}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className={`rounded-full transition-all shadow-xl font-bold uppercase tracking-wider cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${buttonHoverColor} ${buttonPadding}`}
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            backgroundColor: buttonColor,
            color: textColor,
          }}
        >
          {loading ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {error && <p className="text-red-400 text-xs text-center font-medium mt-1">{error}</p>}
    </div>
  );
}
