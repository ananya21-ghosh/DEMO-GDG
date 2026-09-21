import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import QRCode from 'qrcode'
import { prisma } from '@/lib/db'
import PrintButton from '@/components/PrintButton'
import EmailTriggerButton from '@/components/EmailTriggerButton'
import { CheckCircle2, Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react'

export const revalidate = 0

interface TicketPageProps {
  params: {
    registrationId: string
  }
}

export default async function TicketPage({ params }: TicketPageProps) {
  const registration = await prisma.registration.findUnique({
    where: { registrationId: params.registrationId },
    include: { event: true }
  })

  if (!registration) {
    notFound()
  }

  const { event } = registration

  // Generate QR Code Data URL
  const qrPayload = JSON.stringify({
    ticketId: registration.registrationId,
    eventId: event.id,
    name: registration.fullName,
    email: registration.email
  })

  const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
    width: 320,
    margin: 1,
    color: {
      dark: '#111827',
      light: '#FFFFFF'
    }
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Action Bar (Hidden during print) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 no-print border-b border-google-border pb-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-google-gray hover:text-google-blue transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Platform Home
          </Link>
          <div className="flex items-center gap-2 text-google-green font-bold text-lg">
            <CheckCircle2 className="w-6 h-6" />
            Official Pass Confirmed & Generated!
          </div>
          <p className="text-xs text-google-gray mt-0.5">
            Automated confirmation email generated from controller address <code className="text-google-blue font-mono font-bold">21ananyaghosh21@gmail.com</code>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <EmailTriggerButton registrationId={registration.registrationId} email={registration.email} />
          <PrintButton />
        </div>
      </div>

      {/* TICKET PASS CONTAINER (EXACT MATCHING DESIGN MODEL) */}
      <div className="bg-white rounded-3xl border border-google-border shadow-google-modal overflow-hidden print-area">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 relative">
          
          {/* LEFT SIDE: MAIN EVENT PASS */}
          <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden bg-white">
            
            {/* Background Decorative Gradient Blobs */}
            <div className="absolute top-0 right-1/3 w-64 h-64 bg-google-blue-light/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-google-yellow-light/40 rounded-full blur-2xl pointer-events-none" />

            {/* 1. Header Logos & Badges */}
            <div className="flex items-center justify-between gap-4 border-b border-google-border/60 pb-6 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="relative h-9 w-40">
                  <Image src="/images/gdg-logo.jpeg" alt="GDG Logo" fill className="object-contain" priority />
                </div>
                <div className="h-6 w-[1px] bg-google-border" />
                <div className="relative h-8 w-24">
                  <Image src="/images/fiem-logo.jpeg" alt="FIEM Logo" fill className="object-contain" priority />
                </div>
              </div>

              <span className="px-3.5 py-1 rounded-full bg-google-blue-light text-google-blue text-xs font-bold uppercase tracking-wider">
                Technical Event
              </span>
            </div>

            {/* 2. Main Title & Multi-Color Accent Bar */}
            <div className="space-y-4 relative z-10">
              <h1 className="text-3xl sm:text-4xl font-black text-google-blue leading-tight tracking-tight">
                {event.title}
              </h1>

              {/* 4-Color Google Accent Line */}
              <div className="flex items-center space-x-1.5 w-32 h-1.5">
                <div className="h-full flex-1 bg-google-blue rounded-full" />
                <div className="h-full flex-1 bg-google-red rounded-full" />
                <div className="h-full flex-1 bg-google-yellow rounded-full" />
                <div className="h-full flex-1 bg-google-green rounded-full" />
              </div>

              <p className="text-xs sm:text-sm text-google-gray max-w-xl font-normal leading-relaxed">
                {event.theme || 'Bridging Algorithmic Depth with AI-Assisted Engineering for Modern Problem Solvers.'}
              </p>
            </div>

            {/* 3. Event Details & Speaker Cutout Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-end relative z-10">
              
              {/* Event Metadata (Date, Time, Venue) */}
              <div className="sm:col-span-7 space-y-3 bg-google-gray-light/80 p-4 rounded-2xl border border-google-border">
                <div className="flex items-center gap-3 text-xs text-google-charcoal">
                  <div className="p-2 rounded-lg bg-white text-google-blue border border-google-border shadow-xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-google-gray">Date</div>
                    <div className="font-bold">{event.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-google-charcoal">
                  <div className="p-2 rounded-lg bg-white text-google-blue border border-google-border shadow-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-google-gray">Time</div>
                    <div className="font-bold">{event.time}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-google-charcoal">
                  <div className="p-2 rounded-lg bg-white text-google-blue border border-google-border shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-google-gray">Venue</div>
                    <div className="font-bold">{event.venue}</div>
                  </div>
                </div>
              </div>

              {/* Speaker Card Overlay */}
              <div className="sm:col-span-5 relative flex flex-col items-center">
                <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-google-border shadow-xs bg-white">
                  <Image
                    src={event.posterUrl}
                    alt={event.speaker}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3">
                    <span className="text-[10px] uppercase font-bold text-google-yellow tracking-wider">Speaker</span>
                    <span className="text-xs font-extrabold text-white">{event.speaker}</span>
                    <span className="text-[10px] text-white/80">{event.designation}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* 4. Bottom Footer Accents */}
            <div className="flex justify-between items-center pt-4 border-t border-google-border/60 text-xs text-google-gray relative z-10">
              <div className="font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-google-blue" />
                Google Developer Group on Campus • FIEM
              </div>
              <div className="font-medium italic text-google-charcoal">
                Learn • Build • Grow
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: TEAR-OFF TICKET STUB (Separated by Dashed Line) */}
          <div className="lg:col-span-4 bg-google-gray-light/60 p-6 sm:p-8 flex flex-col justify-between items-center text-center relative border-t lg:border-t-0 lg:border-l border-dashed border-google-border">
            
            {/* Top Right Corner Accent */}
            <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
              <div className="bg-google-blue w-12 h-12 transform rotate-45 translate-x-6 -translate-y-6" />
            </div>

            {/* Stub Header */}
            <div className="space-y-1 w-full text-left border-b border-google-border pb-4">
              <div className="text-[11px] font-black text-google-blue uppercase tracking-widest">Participant Ticket</div>
              <div className="text-xs text-google-gray">FIEM Student Entry Pass</div>
            </div>

            {/* Participant Info */}
            <div className="space-y-4 w-full text-left py-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-google-gray tracking-wider">Name</div>
                <div className="text-base font-extrabold text-google-charcoal">{registration.fullName}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-google-gray tracking-wider">Registration ID</div>
                <div className="text-sm font-mono font-bold text-google-blue tracking-wider">{registration.registrationId}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-google-gray tracking-wider mb-1">Registration & RSVP Status</div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-google-green-light border border-google-green/30 text-google-green text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Confirmed
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-google-blue-light text-google-blue text-[11px] font-semibold">
                    RSVP: In-Person Pass
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Pass Box */}
            <div className="bg-white p-3 rounded-2xl border border-google-border shadow-md my-2">
              <div className="relative w-44 h-44">
                <Image
                  src={qrCodeDataUrl}
                  alt={`QR Ticket #${registration.registrationId}`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* See you there! Accent Footer */}
            <div className="pt-3 w-full">
              <div className="text-base font-bold text-google-blue italic font-serif">
                See you there!
              </div>
              <div className="flex justify-center items-center space-x-1 w-20 h-1 mx-auto mt-1">
                <div className="h-full flex-1 bg-google-blue rounded-full" />
                <div className="h-full flex-1 bg-google-red rounded-full" />
                <div className="h-full flex-1 bg-google-yellow rounded-full" />
                <div className="h-full flex-1 bg-google-green rounded-full" />
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
