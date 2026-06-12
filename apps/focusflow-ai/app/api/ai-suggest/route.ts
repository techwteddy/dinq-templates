import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { aiSuggestRatelimit, checkRateLimit } from '@/lib/ratelimit';
import { createAdminClient } from '@/lib/supabase/admin';
import { hashIp } from '@/lib/utils';

function getIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

// Deterministic "AI" suggestion engine based on user data patterns
function generateSuggestions(userId: string, tasks: any[], habits: any[], sessions: any[]) {
  const suggestions: Record<string, any>[] = [];

  // Overdue tasks insight
  const overdue = tasks.filter((t: any) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done');
  if (overdue.length > 0) {
    suggestions.push({
      user_id: userId,
      type: 'task',
      content: `You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}. Consider rescheduling or breaking them into smaller steps.`,
      reason: 'overdue_tasks',
    });
  }

  // High load insight
  const todo = tasks.filter((t: any) => t.status === 'todo').length;
  if (todo > 7) {
    suggestions.push({
      user_id: userId,
      type: 'task',
      content: 'Your task list is getting long. Try the "2-minute rule": if a task takes <2 mins, do it now.',
      reason: 'high_backlog',
    });
  }

  // Focus streak insight
  const today = new Date().toISOString().slice(0, 10);
  const todaySessions = sessions.filter((s: any) => s.started_at.startsWith(today));
  const totalFocusMin = todaySessions.reduce((acc: number, s: any) => acc + (s.duration_seconds || 0), 0) / 60;

  if (totalFocusMin < 30 && sessions.length > 0) {
    suggestions.push({
      user_id: userId,
      type: 'focus',
      content: "You've focused less than 30 minutes today. A quick 25-minute pomodoro could build momentum.",
      reason: 'low_focus_today',
    });
  }
  if (totalFocusMin > 120) {
    suggestions.push({
      user_id: userId,
      type: 'focus',
      content: "Great focus today! Remember to take a 5-minute walk to avoid burnout.",
      reason: 'high_focus_today',
    });
  }

  // Habit streak insight
  const weakHabits = habits.filter((h: any) => h.streak === 0);
  if (weakHabits.length > 0) {
    suggestions.push({
      user_id: userId,
      type: 'habit',
      content: `Restart your "${weakHabits[0].name}" habit today. Streaks are easier to rebuild than you think.`,
      reason: 'broken_streak',
    });
  }

  // Generic if none matched
  if (suggestions.length === 0) {
    suggestions.push({
      user_id: userId,
      type: 'general',
      content: 'Plan your top 3 priorities for tomorrow before ending the day.',
      reason: 'default',
    });
  }

  return suggestions;
}

export async function POST(req: NextRequest) {
  try {
    const supabaseUser = createClient();
    const {
      data: { user },
    } = await supabaseUser.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const ip = getIp(req);
    const ipHash = hashIp(ip);
    const rate = await checkRateLimit(aiSuggestRatelimit, `ai:${user.id}:${ipHash}`);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded.', code: 'RATE_LIMITED' },
        { status: 429 }
      );
    }

    const admin = createAdminClient();

    // Fetch user data
    const [{ data: tasks }, { data: habits }, { data: sessions }] = await Promise.all([
      admin.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
      admin.from('habits').select('*').eq('user_id', user.id).order('streak', { ascending: false }),
      admin.from('focus_sessions').select('*').eq('user_id', user.id).order('started_at', { ascending: false }).limit(30),
    ]);

    const suggestions = generateSuggestions(user.id, tasks || [], habits || [], sessions || []);

    // Save suggestions to DB — cast to bypass strict TS insert typing
    const { error } = await admin.from('ai_suggestions').insert(suggestions as any);
    if (error) throw error;

    return NextResponse.json({ success: true, data: suggestions }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to generate suggestions.', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
