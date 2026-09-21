import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'
import AdminDashboardClient from './AdminDashboardClient'

export const revalidate = 0

export default async function AdminDashboardPage() {
  const session = getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  // Fetch all events
  const events = await prisma.event.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Fetch all registrations with event details
  const registrations = await prisma.registration.findMany({
    include: { event: true },
    orderBy: { createdAt: 'desc' }
  })

  // Fetch email delivery logs
  const emailLogs = await prisma.emailLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <AdminDashboardClient
        adminName={session.name}
        adminEmail={session.email}
        initialEvents={events}
        initialRegistrations={registrations}
        initialEmailLogs={emailLogs}
      />
    </div>
  )
}
