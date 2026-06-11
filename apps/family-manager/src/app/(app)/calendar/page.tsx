import { Suspense } from "react";
import { getCurrentMember } from "@/lib/supabase-server";
import type { Event, Project, ProjectTask, CalendarEntry, GoogleCalendarLink, SchoolTest } from "@/lib/database.types";
import CalendarView from "@/components/calendar/CalendarView";
import GoogleCalendarSettings from "@/components/calendar/GoogleCalendarSettings";

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function addYears(dateStr: string, years: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
}

function expandRecurringEvent(ev: Event): CalendarEntry[] {
  const entries: CalendarEntry[] = [];
  const repeat = ev.repeat ?? "none";
  if (repeat === "none") {
    entries.push({
      id: `event-${ev.id}`,
      title: ev.title,
      date: ev.start_date,
      time: ev.start_time,
      type: "event",
      source_id: ev.id,
    });
    return entries;
  }

  // Expand up to repeat_end_date or 1 year from now
  const now = new Date();
  const oneYearOut = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    .toISOString()
    .slice(0, 10);
  const endDate = ev.repeat_end_date ?? oneYearOut;

  let current = ev.start_date;
  let i = 0;
  while (current <= endDate && i < 365) {
    entries.push({
      id: `event-${ev.id}-${i}`,
      title: ev.title,
      date: current,
      time: ev.start_time,
      type: "event",
      source_id: ev.id,
      repeat,
    });

    i++;
    if (repeat === "daily") current = addDays(ev.start_date, i);
    else if (repeat === "weekly") current = addDays(ev.start_date, i * 7);
    else if (repeat === "monthly") current = addMonths(ev.start_date, i);
    else if (repeat === "yearly") current = addYears(ev.start_date, i);
    else break;
  }

  return entries;
}

interface IcalEvent {
  summary: string;
  uid: string;
  dtstart: string; // YYYYMMDD or YYYYMMDDTHHMMSSZ
}

function parseIcal(text: string): IcalEvent[] {
  const events: IcalEvent[] = [];
  const blocks = text.split("BEGIN:VEVENT");
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split("END:VEVENT")[0];
    const get = (key: string) => {
      // Handle lines like "DTSTART:20260301" or "DTSTART;VALUE=DATE:20260301"
      const re = new RegExp(`^${key}[;:](.*)$`, "m");
      const m = block.match(re);
      if (!m) return "";
      // If there's a colon after params, take the value part
      const val = m[1];
      const colonIdx = val.indexOf(":");
      return colonIdx >= 0 ? val.slice(colonIdx + 1).trim() : val.trim();
    };
    const summary = get("SUMMARY");
    const uid = get("UID");
    const dtstart = get("DTSTART");
    if (dtstart) {
      events.push({ summary: summary || "Google Event", uid, dtstart });
    }
  }
  return events;
}

function icalDateToStrings(dtstart: string): { date: string; time: string | null } {
  // Formats: 20260301, 20260301T140000Z, 20260301T140000
  const clean = dtstart.replace(/\r/g, "");
  if (clean.length === 8) {
    // All-day event: YYYYMMDD
    return {
      date: `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`,
      time: null,
    };
  }

  if (clean.endsWith("Z") && clean.length >= 16) {
    // UTC timestamp — convert to Israel time
    const year = parseInt(clean.slice(0, 4));
    const month = parseInt(clean.slice(4, 6)) - 1;
    const day = parseInt(clean.slice(6, 8));
    const hour = parseInt(clean.slice(9, 11));
    const min = parseInt(clean.slice(11, 13));
    const utc = new Date(Date.UTC(year, month, day, hour, min));
    const local = new Date(utc.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }));
    const localDate = `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}-${String(local.getDate()).padStart(2, "0")}`;
    const localTime = `${String(local.getHours()).padStart(2, "0")}:${String(local.getMinutes()).padStart(2, "0")}`;
    return { date: localDate, time: localTime };
  }

  // Local time (no Z suffix) — use as-is
  const datePart = `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`;
  const timePart = clean.length >= 15
    ? `${clean.slice(9, 11)}:${clean.slice(11, 13)}`
    : null;
  return { date: datePart, time: timePart };
}

async function fetchIcalEvents(link: GoogleCalendarLink): Promise<CalendarEntry[]> {
  const entries: CalendarEntry[] = [];
  try {
    const res = await fetch(link.ical_url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return entries;
    const text = await res.text();
    const parsed = parseIcal(text);
    for (const ev of parsed) {
      const { date, time } = icalDateToStrings(ev.dtstart);
      entries.push({
        id: `google-${link.id}-${ev.uid || date}`,
        title: ev.summary,
        date,
        time,
        type: "google",
        source_id: link.id,
        memberName: link.member_name,
      });
    }
  } catch {
    // Silently skip failed fetches
  }
  return entries;
}

export default async function CalendarPage() {
  const { supabase, member } = await getCurrentMember();
  const isKid = member.role === "kid";
  const [{ data: events }, { data: projects }, { data: projectTasks }, { data: calendarLinks }, { data: schoolTests }, { data: allMembers }] =
    await Promise.all([
      supabase.from("events").select("id, title, description, start_date, start_time, end_date, end_time, assignee, repeat, repeat_end_date, invitees, external_emails").order("start_date", { ascending: true }),
      supabase.from("projects").select("id, name, status, due_date, assignee").order("created_at", { ascending: true }),
      supabase.from("project_tasks").select("id, project_id, name, done, due_date").order("created_at", { ascending: true }),
      supabase.from("google_calendar_links").select("id, member_name, ical_url").order("member_name"),
      supabase.from("school_tests").select("id, kid_name, subject, test_date").order("test_date", { ascending: true }),
      supabase.from("family_members").select("name").order("name"),
    ]);

  const familyMembers = allMembers?.map((m) => m.name) ?? [];

  const entries: CalendarEntry[] = [];

  const allEvents = ((events as Event[]) ?? []).filter(
    (ev) =>
      !isKid ||
      (!ev.assignee && (!ev.invitees || ev.invitees.length === 0)) ||
      ev.assignee === member.name ||
      (ev.invitees && ev.invitees.includes(member.name))
  );
  for (const ev of allEvents) {
    entries.push(...expandRecurringEvent(ev));
  }

  const allProjects = ((projects as Project[]) ?? []).filter(
    (p) => !isKid || !p.assignee || p.assignee === member.name
  );
  for (const proj of allProjects) {
    if (proj.due_date) {
      entries.push({
        id: `project-${proj.id}`,
        title: `🔨 ${proj.name}`,
        date: proj.due_date,
        time: null,
        type: "project",
        source_id: proj.id,
      });
    }
  }

  for (const task of (projectTasks as ProjectTask[]) ?? []) {
    if (task.due_date && !task.done) {
      const project = ((projects as Project[]) ?? []).find((p) => p.id === task.project_id);
      entries.push({
        id: `task-${task.id}`,
        title: `${project ? project.name + ": " : ""}${task.name}`,
        date: task.due_date,
        time: null,
        type: "task",
        source_id: task.id,
      });
    }
  }

  // School tests
  const allTests = ((schoolTests as SchoolTest[]) ?? []).filter(
    (t) => !isKid || t.kid_name === member.name
  );
  for (const test of allTests) {
    entries.push({
      id: `test-${test.id}`,
      title: `${test.kid_name}: ${test.subject}`,
      date: test.test_date,
      time: null,
      type: "test",
      source_id: test.id,
    });
  }

  const allLinks = (calendarLinks as GoogleCalendarLink[]) ?? [];
  const links = isKid ? allLinks.filter((l) => l.member_name === member.name) : allLinks;

  // Start iCal fetches immediately but don't await — let Suspense handle it
  const icalPromise = Promise.all(links.map(fetchIcalEvents));

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>
      <Suspense fallback={
        <CalendarView events={allEvents} entries={entries} today={new Date().toISOString().slice(0, 10)} memberName={member.name} familyMembers={familyMembers} />
      }>
        <CalendarWithIcal
          events={allEvents}
          dbEntries={entries}
          today={new Date().toISOString().slice(0, 10)}
          memberName={member.name}
          icalPromise={icalPromise}
          familyMembers={familyMembers}
        />
      </Suspense>
      <GoogleCalendarSettings links={links} members={familyMembers} />
    </>
  );
}

async function CalendarWithIcal({
  events,
  dbEntries,
  today,
  memberName,
  icalPromise,
  familyMembers,
}: {
  events: Event[];
  dbEntries: CalendarEntry[];
  today: string;
  memberName: string;
  icalPromise: Promise<CalendarEntry[][]>;
  familyMembers: string[];
}) {
  const icalResults = await icalPromise;
  const allEntries = [...dbEntries];
  for (const icalEntries of icalResults) {
    allEntries.push(...icalEntries);
  }

  return (
    <CalendarView events={events} entries={allEntries} today={today} memberName={memberName} familyMembers={familyMembers} />
  );
}
