'use client';

import { useState } from 'react';

type Source = 'homepage' | 'workbook' | 'quotes' | 'universe';

export function WaitlistForm({ source = 'homepage' }: { source?: Source }) {
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
      setMsg(data.duplicate ? "You're already on the list." : "You're on the list.");
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
        placeholder="you@yourdomain.com"
        className="flex-1 rounded-full border border-ink-600 bg-ink-800/60 px-5 py-3 text-sm placeholder:text-ink-400 focus:border-ember-400 focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="rounded-full bg-ember-500 px-6 py-3 text-sm font-medium uppercase tracking-widest text-ink-900 transition-colors hover:bg-ember-400 disabled:opacity-60"
      >
        {state === 'loading' ? 'Adding…' : 'Join waitlist'}
      </button>
      {msg && (
        <p
          role="status"
          className={`text-xs sm:ml-2 ${state === 'error' ? 'text-red-400' : 'text-ink-200'}`}
        >
          {msg}
        </p>
      )}
    </form>
  );
}
