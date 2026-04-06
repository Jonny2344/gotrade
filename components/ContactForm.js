"use client";

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: ''
  });

  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const isValidEmail = value => /^(?:[^\s@]+)@(?:[^\s@]+)\.[^\s@]+$/.test(value);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setError('Please complete all fields before sending your message.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSubmitted(false);
    setStatusMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          website: formData.website
        })
      });

      const payload = await response.json();

      if (payload?.fallback === 'mailto' && payload?.fallbackMailto) {
        window.location.href = payload.fallbackMailto;
        setStatusMessage('Email service is not fully configured yet. Your email app was opened to send this manually.');
        return;
      }

      if (!response.ok) {
        const providerDetails = payload?.details
          ? Object.values(payload.details)
              .filter(Boolean)
              .join(' ')
          : '';

        const baseError = payload?.error || 'Something went wrong. Please try again.';
        setError(providerDetails ? `${baseError} ${providerDetails}` : baseError);
        return;
      }

      setFormData({ name: '', email: '', message: '', website: '' });
      setSubmitted(true);
      setStatusMessage('Message sent. Check your inbox for a confirmation email.');
    } catch {
      setError('Unable to send your message right now. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-brand-text">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          className="w-full rounded-2xl border border-white/16 bg-brand-bg px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted/80 outline-none transition duration-300 hover:border-white/30 focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(59,130,246,0.18)] sm:text-base"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-brand-text">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full rounded-2xl border border-white/16 bg-brand-bg px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted/80 outline-none transition duration-300 hover:border-white/30 focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(59,130,246,0.18)] sm:text-base"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-brand-text">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          placeholder="Tell us how we can help"
          className="w-full resize-y rounded-2xl border border-white/16 bg-brand-bg px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted/80 outline-none transition duration-300 hover:border-white/30 focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(59,130,246,0.18)] sm:text-base"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex rounded-full bg-brand-orange px-8 py-3.5 text-sm font-semibold text-brand-text transition duration-300 hover:-translate-y-0.5 hover:bg-[#fb8b3d] hover:shadow-[0_12px_30px_rgba(249,115,22,0.35)] disabled:cursor-not-allowed disabled:opacity-65 sm:text-base"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>

      <p className="text-xs text-brand-muted/90 sm:text-sm">We'll get back to you as soon as possible. No spam, ever.</p>

      {submitted || statusMessage ? <p className="text-sm text-emerald-300">{statusMessage}</p> : null}

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </form>
  );
}
