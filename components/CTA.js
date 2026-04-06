"use client";

import { useState } from 'react';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = value => /^(?:[^\s@]+)@(?:[^\s@]+)\.[^\s@]+$/.test(value);

  const handleSubmit = event => {
    event.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email to join the waitlist.');
      setSubmitted(false);
      return;
    }

    if (!isValidEmail(trimmed)) {
      setError('Please enter a valid email address.');
      setSubmitted(false);
      return;
    }

    setError('');
    setSubmitted(true);
    setEmail('');
    window.setTimeout(() => setSubmitted(false), 2400);
  };

  const handleEmailChange = event => {
    setEmail(event.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <section id="waitlist" className="section-wrap pb-24 pt-16 sm:pt-20">
      <div className="fade-up section-inner soft-ring rounded-3xl border border-brand-orange/55 bg-gradient-to-r from-brand-card via-brand-card to-[#121b2c] p-9 shadow-[0_34px_90px_rgba(8,14,28,0.62)] sm:p-12">
        <div className="flex flex-col items-start justify-between gap-9 md:flex-row md:items-start md:gap-10">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-blue">Call To Action</p>
            <h2 className="mt-2 text-4xl font-semibold text-brand-text sm:text-5xl">Start saving time on every job today</h2>
            <p className="mt-3 max-w-xl text-sm text-brand-muted/88 sm:text-base">Join the waitlist before public launch and get early access.</p>
          </div>
          <form className="w-full max-w-xl md:pt-1" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="email">Email</label>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
                aria-invalid={Boolean(error)}
                aria-describedby="waitlist-feedback"
                className={`w-full rounded-full border bg-brand-bg px-6 py-4 text-base text-brand-text placeholder:text-brand-muted outline-none transition duration-300 sm:flex-1 ${
                  error ? 'border-red-400/80 focus:border-red-300' : 'border-white/25 focus:border-brand-blue'
                }`}
              />
              <button
                type="submit"
                className="rounded-full bg-brand-orange px-7 py-4 font-semibold text-brand-text transition duration-300 hover:-translate-y-0.5 hover:bg-[#fb8b3d] hover:shadow-[0_12px_30px_rgba(249,115,22,0.35)] sm:min-w-[190px]"
              >
                Join Waitlist
              </button>
            </div>
            <p className="mt-3 text-xs text-brand-muted/90 sm:text-sm">
              By joining, you agree to our{' '}
              <a href="/privacy-policy" className="text-brand-blue transition duration-300 hover:underline hover:underline-offset-4">
                Privacy Policy
              </a>
              .
            </p>
            <p
              id="waitlist-feedback"
              className={`mt-3 text-sm transition duration-300 ${
                error
                  ? 'text-red-300 opacity-100 translate-y-0'
                  : submitted
                    ? 'text-emerald-300 opacity-100 translate-y-0'
                    : 'text-emerald-300 opacity-0 -translate-y-1'
              }`}
            >
              {error || 'Thanks, you are on the list.'}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
