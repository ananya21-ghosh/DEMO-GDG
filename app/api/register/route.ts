import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { sendRegistrationConfirmationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

const registerSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address format'),
  college: z.string().min(2, 'College/Institution is required'),
  department: z.string().min(1, 'Department/Branch is required'),
  yearOfStudy: z.string().min(1, 'Year of study is required'),
  phone: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = registerSchema.parse(body)

    // 1. Verify Event exists & is published
    const event = await prisma.event.findUnique({
      where: { id: validated.eventId }
    })

    if (!event || !event.isPublished) {
      return NextResponse.json(
        { error: 'This event is not available for registration.' },
        { status: 400 }
      )
    }

    // 2. Check Capacity
    const registrationCount = await prisma.registration.count({
      where: { eventId: validated.eventId }
    })

    if (registrationCount >= event.capacity) {
      return NextResponse.json(
        { error: 'Registration is full. Maximum event capacity reached.' },
        { status: 400 }
      )
    }

    // 3. Check Duplicate Registration
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        eventId_email: {
          eventId: validated.eventId,
          email: validated.email.toLowerCase().trim()
        }
      }
    })

    if (existingRegistration) {
      return NextResponse.json(
        {
          error: 'You are already registered for this event.',
          registrationId: existingRegistration.registrationId
        },
        { status: 409 }
      )
    }

    // 4. Generate Unique Registration ID (e.g. GDG-FIEM-2026-X89A)
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase()
    const registrationId = `GDG-FIEM-2026-${randomSuffix}`

    // 5. Create Database Record
    const registration = await prisma.registration.create({
      data: {
        registrationId,
        eventId: validated.eventId,
        fullName: validated.fullName.trim(),
        email: validated.email.toLowerCase().trim(),
        college: validated.college.trim(),
        department: validated.department.trim(),
        yearOfStudy: validated.yearOfStudy.trim(),
        phone: validated.phone?.trim() || null,
      }
    })

    // 6. Build Ticket Pass URL
    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const ticketUrl = `${protocol}://${host}/ticket/${registrationId}`

    // 7. Dispatch Confirmation Email via Controller (logged in DB)
    await sendRegistrationConfirmationEmail({
      registrationId,
      fullName: registration.fullName,
      email: registration.email,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      speaker: `${event.speaker} (${event.designation})`,
      ticketUrl
    })

    return NextResponse.json({
      success: true,
      registrationId,
      ticketUrl,
      message: 'Registration successful! Confirmation ticket generated.'
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('[REGISTRATION API ERROR]', error)
    return NextResponse.json(
      { error: 'Server error processing registration. Please try again.' },
      { status: 500 }
    )
  }
}
