'use client'

import { useState } from 'react'
import { Mail, CheckCircle2, Loader2, ExternalLink } from 'lucide-react'

export default function EmailTriggerButton({ registrationId, email }: { registrationId: string; email: string }) {
  const [loading, setLoading] = useState(false)
  const [sentStatus, setSentStatus] = useState<{ message?: string; previewUrl?: string; error?: string } | null>(null)

  const handleSendEmail = async () => {
    setLoading(true)
    setSentStatus(null)

    try {
      const res = await fetch('/api/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch email')

      setSentStatus({
        message: `Automated Email Dispatched to ${email}`,
        previewUrl: data.previewUrl
      })
    } catch (err: any) {
      setSentStatus({ error: err.message || 'Failed to send email' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end space-y-2 no-print">
      <button
        onClick={handleSendEmail}
        disabled={loading}
        className="px-4 py-2.5 rounded-xl bg-google-gray-light border border-google-border hover:bg-google-blue-light hover:text-google-blue text-google-charcoal font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-google-blue" />
            Dispatching Automated Email...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4 text-google-blue" />
            Send / View Email Confirmation
          </>
        )}
      </button>

      {sentStatus?.message && (
        <div className="text-[11px] font-semibold text-google-green flex items-center gap-1.5 bg-google-green-light px-3 py-1 rounded-lg border border-google-green/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {sentStatus.message}
          {sentStatus.previewUrl && (
            <a
              href={sentStatus.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 underline font-bold flex items-center gap-0.5 hover:text-google-charcoal"
            >
              View Sent Email
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {sentStatus?.error && (
        <div className="text-[11px] font-semibold text-google-red bg-google-red-light px-3 py-1 rounded-lg border border-google-red/30">
          {sentStatus.error}
        </div>
      )}
    </div>
  )
}
