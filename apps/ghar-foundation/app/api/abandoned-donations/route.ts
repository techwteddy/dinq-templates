import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const REMINDER_INTERVALS = [
  { hours: 24, reminderNumber: 1, fromStatus: "abandoned", toStatus: "abandoned2" },
  { hours: 48, reminderNumber: 2, fromStatus: "abandoned2", toStatus: "abandoned2" },
  { hours: 168, reminderNumber: 3, fromStatus: "abandoned2", toStatus: "expired" },
];

function getEmailContent(donor: {
  name: string;
  amount: number;
  project: string;
  reminderNumber: number;
}) {
  const projectLabel = donor.project === "general"
    ? "General Donation"
    : donor.project === "zakat"
    ? "Zakat"
    : donor.project;

  if (donor.reminderNumber === 1) {
    return {
      subject: `Your donation to GHAR Organization is waiting`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1A6FA0; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">GHAR Organization</h1>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <h2 style="color: #2A2A2A;">Dear ${donor.name},</h2>
            <p style="color: #555; line-height: 1.6;">
              We noticed you started a donation of <strong>€${donor.amount}</strong> 
              for <strong>${projectLabel}</strong>, but it wasn't completed.
            </p>
            <p style="color: #555; line-height: 1.6;">
              Your support makes a real difference. Families in Sudan and Yemen are 
              counting on generous people like you.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://www.ghar-ngo.com/en/donate" 
                style="background: #1A6FA0; color: white; padding: 14px 32px; 
                border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Complete My Donation
              </a>
            </div>
            <p style="color: #888; font-size: 13px;">
              If you have any questions or faced any issues, simply reply to this email 
              and we'll be happy to help.
            </p>
          </div>
          <div style="background: #f5f5f5; padding: 16px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              German Humanitarian Relief Organization e.V. | Kullenkampffallee 193, 28217 Bremen
            </p>
          </div>
        </div>
      `,
    };
  }

  if (donor.reminderNumber === 2) {
    return {
      subject: `Your impact is waiting — Complete your donation to GHAR`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1A6FA0; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">GHAR Organization</h1>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <h2 style="color: #2A2A2A;">Dear ${donor.name},</h2>
            <p style="color: #555; line-height: 1.6;">
              Your donation of <strong>€${donor.amount}</strong> to <strong>${projectLabel}</strong> 
              is still waiting to be completed.
            </p>
            <p style="color: #555; line-height: 1.6;">
              Did you know? €${donor.amount} can provide a family with food for an entire week 
              in Sudan or Yemen.
            </p>
            <div style="background: #fff8ee; border-left: 4px solid #EF8800; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <p style="color: #2A2A2A; margin: 0; font-weight: bold;">
                Every euro counts. Every family matters.
              </p>
            </div>
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://www.ghar-ngo.com/en/donate" 
                style="background: #EF8800; color: white; padding: 14px 32px; 
                border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Complete My Donation Now
              </a>
            </div>
            <p style="color: #888; font-size: 13px;">
              Having trouble? Reply to this email and we'll help you complete your donation.
            </p>
          </div>
          <div style="background: #f5f5f5; padding: 16px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              German Humanitarian Relief Organization e.V. | Kullenkampffallee 193, 28217 Bremen
            </p>
          </div>
        </div>
      `,
    };
  }

  return {
    subject: `Last chance — Your donation to GHAR Organization`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A6FA0; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">GHAR Organization</h1>
        </div>
        <div style="padding: 32px; background: #ffffff;">
          <h2 style="color: #2A2A2A;">Dear ${donor.name},</h2>
          <p style="color: #555; line-height: 1.6;">
            This is our final reminder about your donation of <strong>€${donor.amount}</strong> 
            to <strong>${projectLabel}</strong>.
          </p>
          <p style="color: #555; line-height: 1.6;">
            We understand that life gets busy. If you still wish to help, 
            we would be truly grateful. If not, we completely understand.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://www.ghar-ngo.com/en/donate" 
              style="background: #2D8F16; color: white; padding: 14px 32px; 
              border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Complete My Donation
            </a>
          </div>
          <p style="color: #888; font-size: 13px;">
            You won't receive any more reminders after this email. 
            If you have any questions, reply to this email anytime.
          </p>
        </div>
        <div style="background: #f5f5f5; padding: 16px; text-align: center;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            German Humanitarian Relief Organization e.V. | Kullenkampffallee 193, 28217 bremen
          </p>
        </div>
      </div>
    `,
  };
}

export async function GET() {
  try {
    const now = new Date();

    for (const interval of REMINDER_INTERVALS) {
      const fromTime = new Date(now.getTime() - interval.hours * 60 * 60 * 1000);
      const toTime = new Date(now.getTime() - (interval.hours - 24) * 60 * 60 * 1000);

      let query = supabase
        .from("donors")
        .select("*")
        .eq("status", interval.fromStatus)
        .gte("created_at", fromTime.toISOString())
        .lt("created_at", toTime.toISOString());

      if (interval.reminderNumber === 1) {
        query = query.neq("payment_method", "bank");
      }

const { data: donors } = await query;

      if (!donors || donors.length === 0) continue;

      for (const donor of donors) {
        const { subject, html } = getEmailContent({
          name: donor.name,
          amount: donor.amount,
          project: donor.project,
          reminderNumber: interval.reminderNumber,
        });

        await resend.emails.send({
          from: "GHAR Organization <info@ghar-ngo.com>",
          to: donor.email,
          replyTo: "info@ghar-ngo.com",
          subject,
          html,
        });

        await supabase
          .from("donors")
          .update({ status: interval.toStatus })
          .eq("id", donor.id);
      }
    }

    return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (_error) {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}