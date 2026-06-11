import nodemailer from "nodemailer";

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escapeIcs(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function sanitizeSenderName(name: string): string {
  return name.replace(/["\n\r<>]/g, "");
}

function generateIcs({
  title,
  description,
  startDate,
  startTime,
  endDate,
  endTime,
}: {
  title: string;
  description: string | null;
  startDate: string;
  startTime: string | null;
  endDate: string | null;
  endTime: string | null;
}): string {
  // Format: YYYYMMDD or YYYYMMDDTHHMMSS
  const dtStart = startTime
    ? `${startDate.replace(/-/g, "")}T${startTime.replace(/:/g, "")}00`
    : startDate.replace(/-/g, "");

  const dtEnd = endDate
    ? endTime
      ? `${endDate.replace(/-/g, "")}T${endTime.replace(/:/g, "")}00`
      : endDate.replace(/-/g, "")
    : startTime
    ? `${startDate.replace(/-/g, "")}T${startTime.replace(/:/g, "")}00`
    : startDate.replace(/-/g, "");

  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@my-family-genius`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//My Family Genius//EN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcs(title)}`,
    description ? `DESCRIPTION:${escapeIcs(description)}` : "",
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

// Gmail accounts are configured via env vars following the pattern:
// GMAIL_USER_<NAME> and GMAIL_APP_PASSWORD_<NAME>
// e.g., GMAIL_USER_ALICE=alice@gmail.com, GMAIL_APP_PASSWORD_ALICE=xxxx
function getGmailAccount(senderName: string): { user: string; pass: string } | null {
  const key = senderName.toUpperCase();
  const user = process.env[`GMAIL_USER_${key}`];
  const pass = process.env[`GMAIL_APP_PASSWORD_${key}`];
  if (!user || !pass) return null;
  return { user, pass };
}

export async function sendInviteEmail(
  recipients: string[],
  event: {
    title: string;
    description: string | null;
    start_date: string;
    start_time: string | null;
    end_date: string | null;
    end_time: string | null;
  },
  senderName: string
) {
  const account = getGmailAccount(senderName);
  if (!account) {
    console.log(`[email] no Gmail account configured for ${senderName}, skipping`);
    return;
  }

  const { user, pass } = account;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user, pass },
  });

  const icsContent = generateIcs({
    title: event.title,
    description: event.description,
    startDate: event.start_date,
    startTime: event.start_time,
    endDate: event.end_date,
    endTime: event.end_time,
  });

  const dateStr = event.start_date;
  const timeStr = event.start_time ? ` at ${event.start_time}` : "";

  const safeSender = sanitizeSenderName(senderName);
  const safeTitle = escapeHtml(event.title);
  const safeDesc = event.description ? escapeHtml(event.description) : null;

  await Promise.allSettled(
    recipients.map(async (to) => {
      try {
        await transporter.sendMail({
          from: `"${safeSender} (My Family Genius)" <${user}>`,
          to,
          subject: `Event invite: ${event.title}`,
          text: `You're invited to: ${event.title}\nDate: ${dateStr}${timeStr}\n${event.description ? `\n${event.description}` : ""}\n\nSee the attached .ics file to add this event to your calendar.`,
          html: `<div style="font-family:sans-serif;max-width:500px">
            <h2 style="color:#8b7ec8">You're invited!</h2>
            <p><strong>${safeTitle}</strong></p>
            <p>Date: ${escapeHtml(dateStr)}${escapeHtml(timeStr)}</p>
            ${safeDesc ? `<p>${safeDesc}</p>` : ""}
            <p style="color:#888;font-size:13px">Open the attached .ics file to add this event to your calendar.</p>
          </div>`,
          attachments: [
            {
              filename: "invite.ics",
              content: icsContent,
              contentType: "text/calendar; method=PUBLISH",
            },
          ],
        });
        console.log(`[email] invite sent to ${to}`);
      } catch (err) {
        console.error(`[email] failed to send to ${to}:`, err);
      }
    })
  );
}
