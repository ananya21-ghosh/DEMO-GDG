import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendRegistrationConfirmationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { registrationId } = await req.json()

    if (!registrationId) {
      return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 })
    }

    const registration = await prisma.registration.findUnique({
      where: { registrationId },
      include: { event: true }
    })

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const ticketUrl = `${protocol}://${host}/ticket/${registrationId}`

    const result = await sendRegistrationConfirmationEmail({
      registrationId,
      fullName: registration.fullName,
      email: registration.email,
      eventTitle: registration.event.title,
      eventDate: registration.event.date,
      eventTime: registration.event.time,
      eventVenue: registration.event.venue,
      speaker: `${registration.event.speaker} (${registration.event.designation})`,
      ticketUrl
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[RESEND EMAIL API ERROR]', error)
    return NextResponse.json({ error: 'Server error dispatching email' }, { status: 500 })
  }
}
