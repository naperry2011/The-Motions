'use client';

import { useState } from 'react';

type Source =
  | 'homepage'
  | 'workbook'
  | 'workbook-leadmagnet'
  | 'quotes'
  | 'universe'
  | 'quiz'
  | 'story';

export function WaitlistForm({
  source = 'homepage',
  buttonLabel,
  successMessage,
  placeholder = 'you@yourdomain.com'
}: {
  source?: Source;
  buttonLabel?: string;
  successMessage?: string;
  placeholder?: string;
}) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    setMsg('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source })
      });
      const data = await res.json();
      if (!res.ok) {
        setState('error');
        setMsg(data.error ?? 'Something went sideways.');
        return;
      }
      setState('ok');
      setMsg(
        data.duplicate
          ? "You're already on the list."
          : successMessage ?? "You're on the list."
      );
      setEmail('');
    } catch {
      setState('error');
      setMsg('Network error. Try again?');
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center"
    >
      <label htmlFor="waitlist-email" className="sr-only">
        Email address
      </label>
      <input
        id="waitlist-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-full border-3 border-ink bg-cream px-5 py-3 text-sm text-ink placeholder:text-ink/50 focus:border-terracotta focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="rounded-full border-3 border-ink bg-terracotta px-6 py-3 text-xs font-display uppercase tracking-wider text-cream shadow-cartoon-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {state === 'loading' ? 'Sending…' : buttonLabel ?? 'Join waitlist'}
      </button>
      {msg && (
        <p
          role="status"
          className={`text-xs sm:ml-2 ${state === 'error' ? 'text-terracotta' : 'text-ink/70'}`}
        >
          {msg}
        </p>
      )}
    </form>
  );
}
