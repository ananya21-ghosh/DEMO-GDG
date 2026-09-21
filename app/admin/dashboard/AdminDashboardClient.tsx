'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Users,
  Calendar,
  CheckCircle2,
  Mail,
  Download,
  Search,
  QrCode,
  Edit,
  Save,
  LogOut,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Clock,
  UserCheck,
  Sparkles,
  Loader2
} from 'lucide-react'

interface AdminDashboardClientProps {
  adminName: string
  adminEmail: string
  initialEvents: any[]
  initialRegistrations: any[]
  initialEmailLogs: any[]
}

export default function AdminDashboardClient({
  adminName,
  adminEmail,
  initialEvents,
  initialRegistrations,
  initialEmailLogs
}: AdminDashboardClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'events' | 'participants' | 'checkin' | 'emails'>('participants')
  
  const [events, setEvents] = useState(initialEvents)
  const [registrations, setRegistrations] = useState(initialRegistrations)
  const [emailLogs, setEmailLogs] = useState(initialEmailLogs)

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('')
  const [deptFilter, setDeptFilter] = useState('ALL')

  // Check-in Scanner State
  const [checkinCode, setCheckinCode] = useState('')
  const [checkinStatus, setCheckinStatus] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)
  const [checkinLoading, setCheckinLoading] = useState(false)

  // Editing Event State
  const [editingEvent, setEditingEvent] = useState<any | null>(initialEvents[0] || null)
  const [eventUpdateSuccess, setEventUpdateSuccess] = useState(false)
  const [eventUpdateLoading, setEventUpdateLoading] = useState(false)

  // Computed Dashboard Analytics
  const totalRegistrations = registrations.length
  const totalCheckedIn = registrations.filter(r => r.isCheckedIn).length
  const checkinRate = totalRegistrations > 0 ? Math.round((totalCheckedIn / totalRegistrations) * 100) : 0

  const primaryEvent = events[0]
  const capacity = primaryEvent?.capacity || 300
  const capacityRate = Math.round((totalRegistrations / capacity) * 100)

  // Filtered Registrations
  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.registrationId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDept = deptFilter === 'ALL' || r.department.includes(deptFilter)
    return matchesSearch && matchesDept
  })

  // Handle Event Details Update
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEvent) return
    setEventUpdateLoading(true)
    setEventUpdateSuccess(false)

    try {
      const res = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update event')

      setEvents(events.map(ev => ev.id === editingEvent.id ? data.event : ev))
      setEventUpdateSuccess(true)
      setTimeout(() => setEventUpdateSuccess(false), 4000)
    } catch (err: any) {
      alert(err.message || 'Error updating event')
    } finally {
      setEventUpdateLoading(false)
    }
  }

  // Handle Live QR Check-in
  const handleCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkinCode.trim()) return
    setCheckinLoading(true)
    setCheckinStatus(null)

    try {
      const res = await fetch('/api/admin/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: checkinCode.trim() })
      })

      const data = await res.json()

      if (!res.ok) {
        setCheckinStatus({ error: data.error || 'Check-in failed' })
      } else {
        setCheckinStatus({ success: true, message: data.message })
        // Update local state
        setRegistrations(registrations.map(r => r.registrationId === data.registration.registrationId ? data.registration : r))
        setCheckinCode('')
      }
    } catch (err: any) {
      setCheckinStatus({ error: err.message || 'Server error during check-in' })
    } finally {
      setCheckinLoading(false)
    }
  }

  // Handle Logout
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="space-y-8">
      
      {/* Admin Top Header */}
      <div className="bg-white rounded-3xl border border-google-border p-6 sm:p-8 shadow-google-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative h-10 w-44">
            <Image src="/images/gdg-logo.jpeg" alt="GDG Logo" fill className="object-contain" />
          </div>
          <div className="h-8 w-[1px] bg-google-border hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-google-charcoal">GDG FIEM Organizer Dashboard</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-google-blue-light text-google-blue text-xs font-bold">
                Admin Active
              </span>
            </div>
            <p className="text-xs text-google-gray">Logged in as: <span className="font-semibold text-google-charcoal">{adminEmail}</span></p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-google-gray-light border border-google-border hover:bg-google-red-light hover:text-google-red text-google-charcoal text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-google-border shadow-google-card space-y-2">
          <div className="flex justify-between items-center text-google-blue">
            <span className="text-xs font-bold uppercase tracking-wider text-google-gray">Total Registrations</span>
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-google-charcoal">{totalRegistrations}</div>
          <div className="text-xs text-google-gray">{capacityRate}% of {capacity} seat capacity</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-google-border shadow-google-card space-y-2">
          <div className="flex justify-between items-center text-google-green">
            <span className="text-xs font-bold uppercase tracking-wider text-google-gray">Checked-In Attendees</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-google-charcoal">{totalCheckedIn}</div>
          <div className="text-xs text-google-gray">{checkinRate}% attendance rate</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-google-border shadow-google-card space-y-2">
          <div className="flex justify-between items-center text-google-yellow">
            <span className="text-xs font-bold uppercase tracking-wider text-google-gray">Primary Venue</span>
            <MapPin className="w-5 h-5" />
          </div>
          <div className="text-lg font-bold text-google-charcoal truncate">{primaryEvent?.venue || 'FIEM Campus'}</div>
          <div className="text-xs text-google-gray">Editable in Event Settings</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-google-border shadow-google-card space-y-2">
          <div className="flex justify-between items-center text-google-red">
            <span className="text-xs font-bold uppercase tracking-wider text-google-gray">Emails Dispatched</span>
            <Mail className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-google-charcoal">{emailLogs.length}</div>
          <div className="text-xs text-google-gray">Controller: 21ananyaghosh21@gmail.com</div>
        </div>

      </div>

      {/* Tab Navigation Controls */}
      <div className="border-b border-google-border flex space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('participants')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'participants'
              ? 'border-google-blue text-google-blue'
              : 'border-transparent text-google-gray hover:text-google-charcoal'
          }`}
        >
          <Users className="w-4 h-4" />
          Participant Directory ({totalRegistrations})
        </button>

        <button
          onClick={() => setActiveTab('checkin')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'checkin'
              ? 'border-google-blue text-google-blue'
              : 'border-transparent text-google-gray hover:text-google-charcoal'
          }`}
        >
          <QrCode className="w-4 h-4" />
          Door QR Check-In Tool
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'events'
              ? 'border-google-blue text-google-blue'
              : 'border-transparent text-google-gray hover:text-google-charcoal'
          }`}
        >
          <Edit className="w-4 h-4" />
          Event & Venue Settings
        </button>

        <button
          onClick={() => setActiveTab('emails')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'emails'
              ? 'border-google-blue text-google-blue'
              : 'border-transparent text-google-gray hover:text-google-charcoal'
          }`}
        >
          <Mail className="w-4 h-4" />
          Email Notification Logs
        </button>
      </div>

      {/* TAB 1: PARTICIPANT DIRECTORY */}
      {activeTab === 'participants' && (
        <div className="bg-white rounded-3xl border border-google-border p-6 shadow-google-card space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-google-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, email, or Ticket ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-google-border text-xs font-medium text-google-charcoal focus:outline-none focus:ring-2 focus:ring-google-blue"
                />
              </div>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-google-border text-xs font-medium text-google-charcoal focus:outline-none focus:ring-2 focus:ring-google-blue"
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science">CSE</option>
                <option value="Information Technology">IT</option>
                <option value="Electronics">ECE</option>
                <option value="Artificial Intelligence">AI & ML</option>
                <option value="Electrical">EE</option>
              </select>
            </div>

            <a
              href="/api/admin/export"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-google-green hover:bg-google-green/90 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Participant CSV
            </a>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-google-border rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-google-gray-light text-google-charcoal uppercase tracking-wider font-bold border-b border-google-border">
                <tr>
                  <th className="py-3.5 px-4">Ticket ID</th>
                  <th className="py-3.5 px-4">Full Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Department & Year</th>
                  <th className="py-3.5 px-4">Check-In Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-google-border">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-google-gray">
                      No matching participant registrations found.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-google-gray-light/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-google-blue">
                        {reg.registrationId}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-google-charcoal">
                        {reg.fullName}
                      </td>
                      <td className="py-3.5 px-4 text-google-gray">
                        {reg.email}
                      </td>
                      <td className="py-3.5 px-4 text-google-gray">
                        <div>{reg.department}</div>
                        <div className="text-[10px] text-google-gray/70">{reg.yearOfStudy}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {reg.isCheckedIn ? (
                          <span className="px-2.5 py-1 rounded-full bg-google-green-light text-google-green font-bold text-[10px]">
                            Checked-In ({reg.checkedInAt ? new Date(reg.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'OK'})
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-google-gray-light text-google-gray font-medium text-[10px]">
                            Pending Entrance
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={async () => {
                            const res = await fetch('/api/admin/checkin', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ registrationId: reg.registrationId })
                            })
                            const data = await res.json()
                            if (data.registration) {
                              setRegistrations(registrations.map(r => r.id === reg.id ? data.registration : r))
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                            reg.isCheckedIn
                              ? 'bg-google-gray-light text-google-gray'
                              : 'bg-google-blue text-white hover:bg-google-blue-dark'
                          }`}
                        >
                          {reg.isCheckedIn ? 'Checked' : 'Mark Entry'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: DOOR CHECK-IN TOOL */}
      {activeTab === 'checkin' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-google-border p-8 shadow-google-modal space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-google-blue-light text-google-blue flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-google-charcoal">FIEM Campus Door Check-In</h2>
            <p className="text-xs text-google-gray">
              Scan participant ticket QR code or type Registration ID (e.g. <code className="text-google-blue font-mono">GDG-FIEM-2026-X89A</code>) to verify entry.
            </p>
          </div>

          {checkinStatus?.success && (
            <div className="p-4 rounded-2xl bg-google-green-light border border-google-green/30 text-google-green text-sm font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              {checkinStatus.message}
            </div>
          )}

          {checkinStatus?.error && (
            <div className="p-4 rounded-2xl bg-google-red-light border border-google-red/30 text-google-red text-sm font-bold text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {checkinStatus.error}
            </div>
          )}

          <form onSubmit={handleCheckinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">
                Enter Ticket ID or QR Code String
              </label>
              <input
                type="text"
                autoFocus
                required
                placeholder="e.g. GDG-FIEM-2026-XXXXX"
                value={checkinCode}
                onChange={(e) => setCheckinCode(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-google-blue/40 text-center font-mono text-lg font-bold text-google-charcoal uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-google-blue"
              />
            </div>

            <button
              type="submit"
              disabled={checkinLoading}
              className="w-full py-4 rounded-2xl bg-google-blue hover:bg-google-blue-dark text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2"
            >
              {checkinLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying Ticket...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Verify & Confirm Attendance
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: EVENT & VENUE SETTINGS */}
      {activeTab === 'events' && editingEvent && (
        <div className="bg-white rounded-3xl border border-google-border p-8 shadow-google-card space-y-6">
          <div className="border-b border-google-border pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-extrabold text-google-charcoal">Edit Event & Venue Details</h2>
              <p className="text-xs text-google-gray">Update venue, speaker info, dates, capacity, and status for live public display.</p>
            </div>
            {eventUpdateSuccess && (
              <span className="px-3.5 py-1.5 rounded-full bg-google-green-light text-google-green text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Event updated successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveEvent} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">Event Title</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-google-border text-sm font-medium text-google-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">Event Theme</label>
                <input
                  type="text"
                  value={editingEvent.theme || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, theme: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-google-border text-sm font-medium text-google-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">Speaker Name</label>
                <input
                  type="text"
                  required
                  value={editingEvent.speaker}
                  onChange={(e) => setEditingEvent({ ...editingEvent, speaker: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-google-border text-sm font-medium text-google-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">Speaker Designation</label>
                <input
                  type="text"
                  required
                  value={editingEvent.designation}
                  onChange={(e) => setEditingEvent({ ...editingEvent, designation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-google-border text-sm font-medium text-google-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">Venue (Editable)</label>
                <input
                  type="text"
                  required
                  value={editingEvent.venue}
                  onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-google-border text-sm font-medium text-google-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">Seat Capacity</label>
                <input
                  type="number"
                  required
                  value={editingEvent.capacity}
                  onChange={(e) => setEditingEvent({ ...editingEvent, capacity: parseInt(e.target.value) || 200 })}
                  className="w-full px-4 py-3 rounded-xl border border-google-border text-sm font-medium text-google-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">Date</label>
                <input
                  type="text"
                  required
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-google-border text-sm font-medium text-google-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">Time</label>
                <input
                  type="text"
                  required
                  value={editingEvent.time}
                  onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-google-border text-sm font-medium text-google-charcoal"
                />
              </div>

            </div>

            <div className="flex items-center space-x-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-google-charcoal">
                <input
                  type="checkbox"
                  checked={editingEvent.isPublished}
                  onChange={(e) => setEditingEvent({ ...editingEvent, isPublished: e.target.checked })}
                  className="w-4 h-4 text-google-blue rounded"
                />
                Published (Publicly Visible)
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-google-charcoal">
                <input
                  type="checkbox"
                  checked={editingEvent.isFeatured}
                  onChange={(e) => setEditingEvent({ ...editingEvent, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-google-blue rounded"
                />
                Featured on Homepage
              </label>
            </div>

            <button
              type="submit"
              disabled={eventUpdateLoading}
              className="px-6 py-3.5 rounded-xl bg-google-blue hover:bg-google-blue-dark text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              {eventUpdateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Event & Venue Changes
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: EMAIL NOTIFICATION MONITOR */}
      {activeTab === 'emails' && (
        <div className="bg-white rounded-3xl border border-google-border p-6 shadow-google-card space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-google-charcoal">Email Dispatch & Delivery Monitor</h2>
            <p className="text-xs text-google-gray">
              Backend controller sender: <code className="text-google-blue font-mono">21ananyaghosh21@gmail.com</code>
            </p>
          </div>

          <div className="overflow-x-auto border border-google-border rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-google-gray-light text-google-charcoal uppercase tracking-wider font-bold border-b border-google-border">
                <tr>
                  <th className="py-3.5 px-4">Recipient</th>
                  <th className="py-3.5 px-4">Sender Controller</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Logged At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-google-border">
                {emailLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-google-gray">
                      No transactional email logs currently recorded.
                    </td>
                  </tr>
                ) : (
                  emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-google-gray-light/50">
                      <td className="py-3.5 px-4 font-bold text-google-charcoal">{log.recipient}</td>
                      <td className="py-3.5 px-4 text-google-gray font-mono">{log.sender}</td>
                      <td className="py-3.5 px-4 text-google-charcoal max-w-xs truncate">{log.subject}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          log.status === 'SENT' ? 'bg-google-green-light text-google-green' : 'bg-google-yellow-light text-google-yellow'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-google-gray">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
