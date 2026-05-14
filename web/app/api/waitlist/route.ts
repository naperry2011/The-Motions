import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServer } from '@/lib/supabase/server';

const Body = z.object({
  email: z.string().email(),
  source: z.enum(['homepage', 'workbook', 'quotes', 'universe']).default('homepage')
});

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = Body.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Soft-fail when Supabase isn't configured yet (preview / local without env).
    return NextResponse.json({ ok: true, queued: false });
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from('waitlist')
    .insert({ email: parsed.data.email, source: parsed.data.source });

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    return NextResponse.json({ error: 'Could not save right now.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
