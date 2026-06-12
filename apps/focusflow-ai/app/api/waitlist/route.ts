import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { waitlistRatelimit, checkRateLimit } from '@/lib/ratelimit';
import { hashIp } from '@/lib/utils';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(80).optional(),
  referral_source: z.string().optional(),
});

function getIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { email, name, referral_source } = parsed.data;
    const ip = getIp(req);
    const ipHash = hashIp(ip);

    // Rate limit
    const rateLimitKey = `waitlist:${ipHash}`;
    const rate = await checkRateLimit(waitlistRatelimit, rateLimitKey);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Try again later.', code: 'RATE_LIMITED' },
        { status: 429, headers: { 'Retry-After': String(rate.reset || 3600) } }
      );
    }

    const supabase = createAdminClient();

    // Check duplicate
    const { data: existing } = await supabase.from('waitlist').select('*').eq('email', email).single();

    if (existing) {
      if (existing.confirmed) {
        return NextResponse.json(
          { success: false, error: 'Already on the waitlist.', code: 'CONFLICT' },
          { status: 409 }
        );
      }
      // Resend confirmation flow could go here
      return NextResponse.json(
        { success: true, position: existing.position, message: 'Check your email to confirm.' },
        { status: 200 }
      );
    }

    // Insert
    const { data: inserted, error } = await supabase
      .from('waitlist')
      .insert({ email, name: name || null, referral_source: referral_source || null, ip_hash: ipHash })
      .select('position')
      .single();

    if (error) throw error;

    // Track analytics
    await supabase.from('page_analytics').insert({
      event_name: 'waitlist_signup',
      page_path: '/',
      session_id: ipHash.slice(0, 16),
      metadata: { email_domain: email.split('@')[1] },
    });

    return NextResponse.json(
      {
        success: true,
        position: inserted?.position ?? 0,
        message: "You're on the list! Check your inbox to confirm.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('waitlist error', err);
    return NextResponse.json(
      { success: false, error: 'Something went wrong.', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
