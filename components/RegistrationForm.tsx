'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Building, GraduationCap, Phone, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export default function RegistrationForm({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
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
    <div className="bg-white rounded-3xl border border-google-border p-6 sm:p-8 shadow-google-hover">
      
      <div className="border-b border-google-border pb-6 mb-6">
        <h3 className="text-xl font-extrabold text-google-charcoal flex items-center gap-2">
          <Send className="w-5 h-5 text-google-blue" />
          Event Registration Form
        </h3>
        <p className="text-xs text-google-gray mt-1">
          Complete your details to secure your pass for <span className="font-semibold text-google-charcoal">{eventTitle}</span>.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-google-red-light border border-google-red/30 text-google-red text-sm font-medium flex items-start gap-3">
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

      <form onSubmit={handleSubmit} className="space-y-5">
        
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
            Your unique ticket & QR code pass will be sent to this email address.
          </p>
        </div>

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

        {/* Department & Year of Study Grid */}
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

        {/* Phone Number (Optional) */}
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

        {/* Consent Checkbox */}
        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="consent"
            required
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-1 w-4 h-4 text-google-blue rounded border-google-border focus:ring-google-blue"
          />
          <label htmlFor="consent" className="text-xs text-google-gray leading-relaxed">
            I confirm that I will attend this session at FIEM Campus and agree to receive my registration ticket confirmation email.
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
              Processing Backend Registration...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Confirm Registration & Get Pass
            </>
          )}
        </button>

      </form>
    </div>
  )
}
