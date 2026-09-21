import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')

    const whereClause = eventId ? { eventId } : {}
    const registrations = await prisma.registration.findMany({
      where: whereClause,
      include: { event: true },
      orderBy: { createdAt: 'desc' }
    })

    const headers = ['Registration ID', 'Event Title', 'Full Name', 'Email', 'College', 'Department', 'Year of Study', 'Phone', 'Check-In Status', 'Registered At']
    const rows = registrations.map(r => [
      `"${r.registrationId}"`,
      `"${r.event.title.replace(/"/g, '""')}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.college.replace(/"/g, '""')}"`,
      `"${r.department.replace(/"/g, '""')}"`,
      `"${r.yearOfStudy}"`,
      `"${r.phone || 'N/A'}"`,
      `"${r.isCheckedIn ? 'Checked-In' : 'Pending'}"`,
      `"${r.createdAt.toISOString()}"`
    ])

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="gdg-fiem-registrations-${new Date().toISOString().slice(0,10)}.csv"`
      }
    })
  } catch (error) {
    console.error('[EXPORT API ERROR]', error)
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 })
  }
}
