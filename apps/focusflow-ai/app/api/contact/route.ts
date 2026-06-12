import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { contactRatelimit, checkRateLimit } from '@/lib/ratelimit';
import { hashIp } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(2000),
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

    const ip = getIp(req);
    const ipHash = hashIp(ip);
    const rate = await checkRateLimit(contactRatelimit, `contact:${ipHash}`);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded.', code: 'RATE_LIMITED' },
        { status: 429, headers: { 'Retry-After': String(rate.reset || 3600) } }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('contact_submissions').insert(parsed.data);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Message sent!' }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong.', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
