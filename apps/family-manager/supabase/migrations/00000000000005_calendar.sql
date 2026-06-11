-- Add recurrence columns to events
ALTER TABLE public.events ADD COLUMN repeat text DEFAULT 'none'
  CHECK (repeat IN ('none', 'daily', 'weekly', 'monthly', 'yearly'));
ALTER TABLE public.events ADD COLUMN repeat_end_date date;

-- Google Calendar iCal links per family member
CREATE TABLE public.google_calendar_links (
  id bigint generated always as identity primary key,
  member_name text not null unique,
  ical_url text not null,
  created_at timestamptz default now()
);

ALTER TABLE public.google_calendar_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family access on google_calendar_links" ON public.google_calendar_links
  FOR ALL USING (auth.role() = 'authenticated' AND public.is_allowed_user())
  WITH CHECK (auth.role() = 'authenticated' AND public.is_allowed_user());
