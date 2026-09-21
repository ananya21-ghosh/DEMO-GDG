import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized organizer access' }, { status: 401 })
    }

    const { registrationId } = await req.json()

    if (!registrationId) {
      return NextResponse.json({ error: 'Registration ID or payload is required' }, { status: 400 })
    }

    // Handle parsed JSON payload if scanned from QR directly
    let cleanId = registrationId.trim()
    try {
      const parsed = JSON.parse(registrationId)
      if (parsed.ticketId) cleanId = parsed.ticketId
    } catch {
      // Raw string ID
    }

    const registration = await prisma.registration.findUnique({
      where: { registrationId: cleanId },
      include: { event: true }
    })

    if (!registration) {
      return NextResponse.json({ error: `Ticket #${cleanId} not found in system` }, { status: 404 })
    }

    if (registration.isCheckedIn) {
      return NextResponse.json({
        alreadyCheckedIn: true,
        message: `Ticket #${cleanId} was ALREADY checked in at ${registration.checkedInAt?.toLocaleTimeString()}`,
        registration
      }, { status: 409 })
    }

    // Perform check-in transaction
    const updated = await prisma.registration.update({
      where: { registrationId: cleanId },
      data: {
        isCheckedIn: true,
        checkedInAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: `Check-in Verified! Welcome ${registration.fullName} to FIEM Campus.`,
      registration: updated
    })
  } catch (error: any) {
    console.error('[CHECKIN API ERROR]', error)
    return NextResponse.json({ error: 'Server error processing check-in' }, { status: 500 })
  }
}
