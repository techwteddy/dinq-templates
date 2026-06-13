import nodemailer from 'nodemailer'

function createTransport() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10)
  const user = process.env.BREVO_SMTP_USER
  const pass = process.env.BREVO_SMTP_KEY

  if (!host || !user || !pass) return null

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
  })
}

export async function sendManagementEmail(
  to: string,
  driverName: string,
  rideLabel: string,
  manageUrl: string,
  rideType: 'offer' | 'seek' = 'offer'
) {
  console.log(`[email] Management link for ${to}: ${manageUrl}`)

  const transport = createTransport()
  if (!transport) return

  const from = process.env.BREVO_SENDER_EMAIL ?? process.env.BREVO_SMTP_USER!

  const isSeek = rideType === 'seek'
  const noun = isSeek ? 'ricerca' : 'passaggio'
  const bodyLine = isSeek
    ? `La tua ricerca passaggio <strong>${rideLabel}</strong> è stata pubblicata su Carpooling.`
    : `Il tuo passaggio <strong>${rideLabel}</strong> è stato pubblicato su Carpooling.`
  const ctaLine = isSeek
    ? 'Usa questo link per gestirla — modificarla o cancellarla:'
    : 'Usa questo link per gestirlo — modificarlo, vedere le richieste e accettare i passeggeri:'

  try {
    await transport.sendMail({
      from: `Carpooling <${from}>`,
      to,
      subject: `Gestisci la tua ${noun} — ${rideLabel}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #221c11;">
          <h2 style="font-size: 22px; margin-bottom: 8px;">Ciao ${driverName}!</h2>
          <p style="margin-bottom: 16px;">${bodyLine}</p>
          <p style="margin-bottom: 24px;">${ctaLine}</p>
          <a href="${manageUrl}" style="
            display: inline-block;
            background: #2d5a27;
            color: #faf6ef;
            padding: 14px 28px;
            border-radius: 999px;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
          ">Gestisci la ${noun}</a>
          <p style="margin-top: 24px; font-size: 13px; color: #9c8e6e;">
            Salva questa email — il link ti servirà per gestire la tua ${noun}.
          </p>
          <p style="margin-top: 8px; font-size: 13px; color: #9c8e6e;">
            Non riesci a trovare questa email? Controlla la cartella <strong>Spam</strong> o <strong>Promozioni</strong> e segnala come &quot;non spam&quot;.
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('[email] Failed to send management email:', err)
  }
}

export async function sendRequestNotificationEmail(
  to: string,
  driverName: string,
  passengerName: string,
  passengerContact: string | null,
  message: string | null,
  rideLabel: string,
  manageUrl: string
) {
  const transport = createTransport()
  if (!transport) return

  const from = process.env.BREVO_SENDER_EMAIL ?? process.env.BREVO_SMTP_USER!

  try {
    await transport.sendMail({
      from: `Carpooling <${from}>`,
      to,
      subject: `Nuova richiesta da ${passengerName} — ${rideLabel}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #221c11;">
          <h2 style="font-size: 22px; margin-bottom: 8px;">Ciao ${driverName}!</h2>
          <p style="margin-bottom: 16px;">
            <strong>${passengerName}</strong> ha richiesto un posto sul tuo passaggio <strong>${rideLabel}</strong>.
          </p>
          ${passengerContact ? `<p style="margin-bottom: 8px;"><strong>Contatto:</strong> ${passengerContact}</p>` : ''}
          ${message ? `<p style="margin-bottom: 16px;"><strong>Messaggio:</strong> ${message}</p>` : ''}
          <a href="${manageUrl}" style="
            display: inline-block;
            background: #2d5a27;
            color: #faf6ef;
            padding: 14px 28px;
            border-radius: 999px;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
          ">Accetta o rifiuta</a>
        </div>
      `,
    })
  } catch (err) {
    console.error('[email] Failed to send request notification:', err)
  }
}
