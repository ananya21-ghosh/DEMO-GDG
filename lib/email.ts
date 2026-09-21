import nodemailer from 'nodemailer'
import { prisma } from './db'

const CONTROLLER_EMAIL = process.env.CONTROLLER_EMAIL || '21ananyaghosh21@gmail.com'

export interface EmailTicketParams {
  registrationId: string
  fullName: string
  email: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventVenue: string
  speaker: string
  ticketUrl: string
}

export async function sendRegistrationConfirmationEmail(params: EmailTicketParams) {
  const {
    registrationId,
    fullName,
    email,
    eventTitle,
    eventDate,
    eventTime,
    eventVenue,
    speaker,
    ticketUrl
  } = params

  const subject = `[Confirmed Ticket] #${registrationId} — ${eventTitle}`

  // Create EmailLog record in DB first
  const emailLog = await prisma.emailLog.create({
    data: {
      registrationId,
      recipient: email,
      sender: CONTROLLER_EMAIL,
      subject,
      status: 'PENDING'
    }
  })

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; color: #202124; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e8eaed; overflow: hidden; box-shadow: 0 4px 12px rgba(60,64,67,0.08); }
        .header { background: #ffffff; padding: 28px 24px; text-align: center; border-bottom: 2px solid #1a73e8; }
        .logo-text { font-size: 22px; font-weight: 800; color: #1a73e8; letter-spacing: -0.5px; }
        .logo-sub { font-size: 13px; color: #5f6368; font-weight: 500; margin-top: 4px; }
        .content { padding: 32px 24px; }
        .greeting { font-size: 18px; font-weight: 700; color: #202124; margin-bottom: 16px; }
        .event-box { background: #f8f9fa; border-left: 4px solid #1a73e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .event-title { font-size: 18px; font-weight: 700; color: #1a73e8; margin-bottom: 8px; }
        .detail-row { font-size: 14px; color: #3c4043; margin: 8px 0; }
        .badge { display: inline-block; background: #e8f0fe; color: #1a73e8; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 14px; margin-top: 12px; }
        .cta-btn { display: inline-block; background: #1a73e8; color: #ffffff !important; font-weight: 700; padding: 14px 28px; text-decoration: none; border-radius: 10px; margin-top: 24px; text-align: center; box-shadow: 0 2px 4px rgba(26,115,232,0.3); }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #5f6368; border-top: 1px solid #e8eaed; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo-text">Google Developer Group</div>
          <div class="logo-sub">Future Institute of Engineering & Management (FIEM)</div>
        </div>
        <div class="content">
          <div class="greeting">Hello ${fullName},</div>
          <p style="font-size: 15px; color: #5f6368; line-height: 1.5;">
            Your registration for <strong>${eventTitle}</strong> is confirmed! We look forward to seeing you at FIEM Campus.
          </p>

          <div class="badge">Registration ID: ${registrationId}</div>

          <div class="event-box">
            <div class="event-title">${eventTitle}</div>
            <div class="detail-row"><strong>Speaker:</strong> &nbsp;${speaker}</div>
            <div class="detail-row"><strong>Date:</strong> &nbsp;${eventDate}</div>
            <div class="detail-row"><strong>Time:</strong> &nbsp;${eventTime}</div>
            <div class="detail-row"><strong>Venue:</strong> &nbsp;${eventVenue}</div>
          </div>

          <p style="font-size: 14px; color: #5f6368;">
            Please keep your unique ticket pass and QR code ready for check-in at the entrance.
          </p>

          <div style="text-align: center;">
            <a href="${ticketUrl}" class="cta-btn" target="_blank">View & Download Digital Pass</a>
          </div>
        </div>
        <div class="footer">
          Organized by GDG on Campus FIEM • Sent from controller ${CONTROLLER_EMAIL}<br/>
          Future Institute of Engineering & Management, Sonarpur, Kolkata
        </div>
      </div>
    </body>
    </html>
  `

  const smtpHost = process.env.SMTP_HOST
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  try {
    let transporter: nodemailer.Transporter

    if (smtpHost && smtpUser && smtpPass) {
      // Use User's configured SMTP Server
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      })
    } else {
      // Create Auto-Generated Real Ethereal SMTP Test Account for Instant Live Verification
      const testAccount = await nodemailer.createTestAccount()
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      })
    }

    const info = await transporter.sendMail({
      from: `"GDG FIEM" <${CONTROLLER_EMAIL}>`,
      to: email,
      subject,
      html: htmlBody
    })

    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined

    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        errorMessage: previewUrl ? `Preview URL: ${previewUrl}` : null
      }
    })

    return {
      success: true,
      status: 'SENT',
      previewUrl,
      message: `Email dispatched successfully!`
    }
  } catch (err: any) {
    console.error('[EMAIL DISPATCH ERROR]', err)
    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: { status: 'FAILED', errorMessage: err?.message || 'Email delivery failed' }
    })
    return { success: false, status: 'FAILED', error: err?.message }
  }
}
