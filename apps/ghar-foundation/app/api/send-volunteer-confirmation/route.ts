import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email } = await request.json();

  try {
    await resend.emails.send({
      from: "GHAR Organization <info@ghar-ngo.com>",
      to: email,
      replyTo: "info@ghar-ngo.com",
      subject: "Your Volunteer Application has been Received",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1A6FA0; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">GHAR Organization</h1>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <h2 style="color: #2A2A2A;">Dear ${name},</h2>
            <p style="color: #555; line-height: 1.6;">
              Thank you for applying to volunteer with GHAR Organization. We have received your application and are truly grateful for your interest in supporting our humanitarian mission.
            </p>
            <div style="background: #f0f9ff; border-left: 4px solid #1A6FA0; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
              <p style="color: #1A6FA0; font-weight: bold; margin: 0 0 8px 0;">What happens next?</p>
              <p style="color: #555; margin: 0; line-height: 1.6;">
                Our team will review your application and get back to you within <strong>3–5 business days</strong>. If your profile matches our current volunteer needs, we will contact you to arrange a brief interview.
              </p>
            </div>
            <p style="color: #555; line-height: 1.6;">
              In the meantime, you can learn more about our work and projects on our website:
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://www.ghar-ngo.com/en/projects"
                style="background: #2D8F16; color: white; padding: 14px 32px;
                border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                View Our Projects
              </a>
            </div>
            <p style="color: #555; line-height: 1.6;">
              If you have any questions, please don't hesitate to contact us at
              <a href="mailto:info@ghar-ngo.com" style="color: #1A6FA0;">info@ghar-ngo.com</a>.
            </p>
            <p style="color: #555; margin-bottom: 0;">
              With gratitude,<br/>
              <strong>The GHAR Organization Team</strong>
            </p>
          </div>
          <div style="background: #f5f5f5; padding: 16px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              German Humanitarian Relief Organization e.V. | Kulenkampffallee 193, 28213 Bremen, Germany
            </p>
            <p style="color: #aaa; font-size: 11px; margin: 8px 0 0 0;">
              Your personal data will be processed in accordance with GHAR's Privacy Policy and applicable data protection regulations.
            </p>
          </div>
        </div>
      `,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}