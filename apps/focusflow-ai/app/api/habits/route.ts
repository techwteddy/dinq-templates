import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const habitSchema = z.object({
  name: z.string().min(1).max(120),
  emoji: z.string().max(10).optional(),
  reminder_time: z.string().optional().nullable(),
});

async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const supabase = createClient();
  const { data, error } = await supabase.from('habits').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = habitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('habits')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });

  const supabase = createClient();

  // If completing today, update streak logic
  if (rest.completed_today) {
    const today = new Date().toISOString().slice(0, 10);
    const { data: habit } = await supabase.from('habits').select('*').eq('id', id).single();
    if (habit) {
      const dates = new Set(habit.completed_dates || []);
      const alreadyDone = dates.has(today);
      if (!alreadyDone) {
        dates.add(today);
        const arr = Array.from(dates);
        // Compute streak
        let streak = 0;
        const d = new Date();
        while (arr.includes(d.toISOString().slice(0, 10))) {
          streak++;
          d.setDate(d.getDate() - 1);
        }
        const longest = Math.max(habit.longest_streak || 0, streak);
        const { data, error } = await supabase
          .from('habits')
          .update({ completed_dates: arr, streak, longest_streak: longest })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();
        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, data });
      }
    }
  }

  const { data, error } = await supabase.from('habits').update(rest).eq('id', id).eq('user_id', user.id).select().single();
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}
