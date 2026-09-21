'use client'

import { Printer, Download } from 'lucide-react'

export default function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <button
      onClick={handlePrint}
      className="px-5 py-2.5 rounded-xl bg-google-blue hover:bg-google-blue-dark text-white font-bold text-xs shadow-md hover:shadow-google-hover transition-all flex items-center gap-2"
    >
      <Printer className="w-4 h-4" />
      Print / Save Digital Ticket (PDF)
    </button>
  )
}
