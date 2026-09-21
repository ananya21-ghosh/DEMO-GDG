'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.')
      }

      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-google-border shadow-google-modal space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="relative h-10 w-44 mx-auto">
            <Image
              src="/images/gdg-logo.jpeg"
              alt="GDG Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-google-blue-light text-google-blue text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            Organizer Portal
          </div>
          <h1 className="text-2xl font-extrabold text-google-charcoal">
            Admin Sign In
          </h1>
          <p className="text-xs text-google-gray">
            Access event controls, venue manager, registration data, and QR check-in scanner.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-google-red-light border border-google-red/30 text-google-red text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-google-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@gdgfiem.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-google-border bg-white text-sm font-medium text-google-charcoal focus:outline-none focus:ring-2 focus:ring-google-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-google-charcoal uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-google-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-google-border bg-white text-sm font-medium text-google-charcoal focus:outline-none focus:ring-2 focus:ring-google-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-google-blue hover:bg-google-blue-dark disabled:bg-google-gray text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Enter Organizer Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  )
}
