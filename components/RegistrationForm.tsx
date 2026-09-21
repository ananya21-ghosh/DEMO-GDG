'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Building, Phone, Send, CheckCircle2, AlertCircle, Loader2, Video, MapPin, Clock, Sparkles, Ticket } from 'lucide-react'

export default function RegistrationForm({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'rsvp' | 'full'>('rsvp')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    rsvpStatus: 'Attending In-Person',
    college: 'Future Institute of Engineering and Management (FIEM)',
    department: 'Computer Science & Engineering (CSE)',
    yearOfStudy: '3rd Year',
    phone: '',
    consent: true
  })

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [alreadyRegisteredId, setAlreadyRegisteredId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setAlreadyRegisteredId(null)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          fullName: formData.fullName,
          email: formData.email,
          rsvpStatus: formData.rsvpStatus,
          college: formData.college,
          department: formData.department,
          yearOfStudy: formData.yearOfStudy,
          phone: formData.phone
        })
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409 && data.registrationId) {
          setAlreadyRegisteredId(data.registrationId)
        }
        throw new Error(data.error || 'Failed to submit registration.')
      }

      // Success! Redirect to digital ticket confirmation page
      router.push(`/ticket/${data.registrationId}`)
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-google-border p-6 sm:p-8 shadow-google-hover space-y-6">
      
      {/* RSVP Navigation Tabs */}
      <div className="flex rounded-2xl bg-google-gray-light p-1 border border-google-border">
        <button
          type="button"
          onClick={() => setActiveTab('rsvp')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'rsvp'
              ? 'bg-white text-google-blue shadow-sm border border-google-border'
              : 'text-google-gray hover:text-google-charcoal'
          }`}
        >
          <Sparkles className="w-4 h-4 text-google-yellow" />
          <span>Quick RSVP Pass</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('full')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'full'
              ? 'bg-white text-google-blue shadow-sm border border-google-border'
              : 'text-google-gray hover:text-google-charcoal'
          }`}
        >
          <Ticket className="w-4 h-4 text-google-blue" />
          <span>Detailed Registration</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="border-b border-google-border pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-google-charcoal flex items-center gap-2">
            <Send className="w-5 h-5 text-google-blue" />
            {activeTab === 'rsvp' ? 'Instant RSVP & Ticket Pass' : 'Complete Event Registration'}
          </h3>
          <span className="px-3 py-1 rounded-full bg-google-green-light border border-google-green/30 text-google-green text-[11px] font-bold uppercase tracking-wider">
            Free Pass
          </span>
        </div>
        <p className="text-xs text-google-gray mt-1">
          RSVP to reserve your seat and instantly generate your digital QR pass for <span className="font-semibold text-google-charcoal">{eventTitle}</span>.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-google-red-light border border-google-red/30 text-google-red text-sm font-medium flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div>{errorMessage}</div>
            {alreadyRegisteredId && (
              <button
                type="button"
                onClick={() => router.push(`/ticket/${alreadyRegisteredId}`)}
                className="mt-2 text-xs font-bold underline hover:text-google-charcoal transition-colors"
              >
                Click here to view your existing ticket pass #{alreadyRegisteredId}
              </button>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* RSVP ATTENDANCE MODE PORTION */}
        <div className="space-y-3 bg-google-blue-light/30 p-4 sm:p-5 rounded-2xl border border-google-blue/20">
          <label className="block text-xs font-bold text-google-charcoal uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-google-blue" />
            Select Your RSVP Attendance Option <span className="text-google-red">*</span>
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Option 1: In-Person */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, rsvpStatus: 'Attending In-Person' })}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                formData.rsvpStatus === 'Attending In-Person'
                  ? 'bg-white border-google-green ring-2 ring-google-green/20 shadow-xs'
                  : 'bg-white/80 border-google-border hover:border-google-gray'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <MapPin className={`w-4 h-4 ${formData.rsvpStatus === 'Attending In-Person' ? 'text-google-green' : 'text-google-gray'}`} />
                {formData.rsvpStatus === 'Attending In-Person' && <CheckCircle2 className="w-4 h-4 text-google-green" />}
              </div>
              <div className="text-xs font-bold text-google-charcoal">In-Person at FIEM</div>
              <div className="text-[10px] text-google-gray mt-0.5">Live campus seat & QR pass</div>
            </button>

            {/* Option 2: Online Stream */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, rsvpStatus: 'Online Stream' })}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                formData.rsvpStatus === 'Online Stream'
                  ? 'bg-white border-google-blue ring-2 ring-google-blue/20 shadow-xs'
                  : 'bg-white/80 border-google-border hover:border-google-gray'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Video className={`w-4 h-4 ${formData.rsvpStatus === 'Online Stream' ? 'text-google-blue' : 'text-google-gray'}`} />
                {formData.rsvpStatus === 'Online Stream' && <CheckCircle2 className="w-4 h-4 text-google-blue" />}
              </div>
              <div className="text-xs font-bold text-google-charcoal">Online Stream</div>
              <div className="text-[10px] text-google-gray mt-0.5">Virtual link & slide deck</div>
            </button>

            {/* Option 3: Tentative */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, rsvpStatus: 'Tentative / Interested' })}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                formData.rsvpStatus === 'Tentative / Interested'
                  ? 'bg-white border-google-yellow ring-2 ring-google-yellow/30 shadow-xs'
                  : 'bg-white/80 border-google-border hover:border-google-gray'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Clock className={`w-4 h-4 ${formData.rsvpStatus === 'Tentative / Interested' ? 'text-google-yellow' : 'text-google-gray'}`} />
                {formData.rsvpStatus === 'Tentative / Interested' && <CheckCircle2 className="w-4 h-4 text-google-yellow" />}
              </div>
              <div className="text-xs font-bold text-google-charcoal">Tentative</div>
              <div className="text-[10px] text-google-gray mt-0.5">Session recording link</div>
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">
            Full Name <span className="text-google-red">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-google-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Ananya Ghosh"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-google-border bg-white text-sm font-medium text-google-charcoal focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">
            Email Address <span className="text-google-red">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-google-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="e.g. student@fiem.ac.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-google-border bg-white text-sm font-medium text-google-charcoal focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all"
            />
          </div>
          <p className="text-[11px] text-google-gray mt-1">
            Your unique RSVP QR code ticket pass will be delivered to this email address.
          </p>
        </div>

        {/* Additional Detailed Form Fields when 'full' tab is selected */}
        {activeTab === 'full' && (
          <div className="space-y-4 pt-2 border-t border-google-border/60">
            {/* College / Institution */}
            <div>
              <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">
                College / Institution <span className="text-google-red">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-google-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-google-border bg-white text-sm font-medium text-google-charcoal focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Department & Year Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">
                  Department / Branch <span className="text-google-red">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-google-border bg-white text-sm font-medium text-google-charcoal focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all"
                >
                  <option value="Computer Science & Engineering (CSE)">CSE</option>
                  <option value="Information Technology (IT)">IT</option>
                  <option value="Electronics & Communication (ECE)">ECE</option>
                  <option value="Artificial Intelligence & ML (AI&ML)">AI & ML</option>
                  <option value="Electrical Engineering (EE)">EE</option>
                  <option value="Mechanical Engineering (ME)">ME</option>
                  <option value="Other Stream">Other Department</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">
                  Year of Study <span className="text-google-red">*</span>
                </label>
                <select
                  value={formData.yearOfStudy}
                  onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-google-border bg-white text-sm font-medium text-google-charcoal focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate / Alumni">PG / Alumni</option>
                </select>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-2">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-google-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-google-border bg-white text-sm font-medium text-google-charcoal focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Consent Checkbox */}
        <div className="flex items-start gap-3 pt-1">
          <input
            type="checkbox"
            id="consent"
            required
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-1 w-4 h-4 text-google-blue rounded border-google-border focus:ring-google-blue"
          />
          <label htmlFor="consent" className="text-xs text-google-gray leading-relaxed">
            I confirm my RSVP ({formData.rsvpStatus}) for this session at FIEM Campus and agree to receive my ticket pass confirmation email.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-google-blue hover:bg-google-blue-dark disabled:bg-google-gray text-white font-bold text-base shadow-md hover:shadow-google-hover transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Confirming RSVP & Registering...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Confirm RSVP & Generate Ticket Pass
            </>
          )}
        </button>

      </form>
    </div>
  )
}
