import { Resend } from "resend";
import ContactEmail from "../../../components/emails/ContactEmail";
import * as z from "zod";
import { NextResponse } from "next/server";
import { render } from "@react-email/components";

const sendRouteSchema = z.object({
  name: z.string().min(3),
  emailAddress: z.string().email(),
  phoneNumber: z.string().min(8),
  subject: z.string().min(2),
  content: z.string().min(2),
});

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const contactEmail = process.env.KONTAKT_EMAIL || "";
  const { name, emailAddress, subject, phoneNumber, content } = await req
    .json()
    .then((body) => sendRouteSchema.parse(body));

  try {
    await resend.emails.send({
      from: `Kontakt ${name} <${contactEmail}>`,
      to: [contactEmail],
      subject: subject,
      reply_to: emailAddress,
      html: render(
        ContactEmail({
          name,
          emailAddress,
          subject,
          phoneNumber,
          content,
        }),
      ),
    });
    return NextResponse.json(
      {
        status: "Ok",
      },
      {
        status: 200,
      },
    );
  } catch (e: unknown) {
    console.error("Error sending email:", e);
    return NextResponse.json(
      { error: "Intern server fejl! - Kontakt support" },
      { status: 500 },
    );
  }
}
