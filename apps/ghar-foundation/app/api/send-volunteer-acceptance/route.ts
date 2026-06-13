import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    await resend.emails.send({
      from: "GHAR Organization <info@ghar-ngo.com>",
      to: email,
      replyTo: "info@ghar-ngo.com",
      subject: "Welcome to the GHAR Organization Volunteer Team!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1A6FA0; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">GHAR Organization</h1>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <h2 style="color: #2A2A2A;">Dear ${name},</h2>
            <p style="color: #555; line-height: 1.6;">
              We are delighted to welcome you to the <strong>GHAR Organization Volunteer Team</strong>.
            </p>
            <p style="color: #555; line-height: 1.6;">
              After carefully reviewing your application and interview, we are pleased to confirm that you have been accepted as a volunteer with our organization.
            </p>
            <div style="background: #f0f9f0; border-left: 4px solid #2D8F16; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
              <p style="color: #2A2A2A; margin: 0; line-height: 1.6;">
                Over the next few days, you will receive information about your role, onboarding process, and the next steps to begin your volunteer journey with GHAR.
              </p>
            </div>
            <p style="color: #555; line-height: 1.6;">
              We are grateful for your willingness to contribute your time and skills to support vulnerable communities through humanitarian action and solidarity.
            </p>
            <p style="color: #555; line-height: 1.6;">
              If you have any questions in the meantime, please feel free to reply to this email.
            </p>
            <p style="color: #555; margin-bottom: 0;">
              Welcome to the team!<br/><br/>
              Warm regards,<br/>
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
  } catch (_error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}