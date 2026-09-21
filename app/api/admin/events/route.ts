import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ events })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 })
    }

    const body = await req.json()
    const { id, title, theme, speaker, designation, date, time, venue, capacity, isPublished, isFeatured, registrationDeadline, description } = body

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        theme,
        speaker,
        designation,
        date,
        time,
        venue: venue || 'FIEM Campus',
        capacity: parseInt(capacity || 200),
        isPublished: Boolean(isPublished),
        isFeatured: Boolean(isFeatured),
        registrationDeadline,
        description
      }
    })

    return NextResponse.json({ success: true, event: updatedEvent })
  } catch (error: any) {
    console.error('[ADMIN EVENT UPDATE ERROR]', error)
    return NextResponse.json({ error: 'Failed to update event details' }, { status: 500 })
  }
}
