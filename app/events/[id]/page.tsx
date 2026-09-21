import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import RegistrationForm from '@/components/RegistrationForm'
import { Calendar, Clock, MapPin, UserCheck, ArrowLeft, ShieldCheck, Sparkles, CheckCircle } from 'lucide-react'

export const revalidate = 0

interface EventDetailsProps {
  params: {
    id: string
  }
}

export default async function EventDetailsPage({ params }: EventDetailsProps) {
  // Try finding by ID first, or by slug as fallback
  const event = await prisma.event.findFirst({
    where: {
      OR: [
        { id: params.id },
        { slug: params.id }
      ]
    }
  })

  if (!event || !event.isPublished) {
    notFound()
  }

  // Count existing registrations
  const registrationCount = await prisma.registration.count({
    where: { eventId: event.id }
  })

  const seatsLeft = Math.max(0, event.capacity - registrationCount)
  const isFull = seatsLeft === 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back Link */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-google-gray hover:text-google-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events Directory
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column — Poster Visual & Venue Detail */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Poster Container (Preserves exact aspect ratio) */}
          <div className="bg-google-gray-light p-4 rounded-3xl border border-google-border shadow-google-card flex justify-center">
            <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-md">
              <Image
                src={event.posterUrl}
                alt={event.title}
                fill
                className="object-contain bg-white"
                priority
              />
            </div>
          </div>

          {/* FIEM Campus Venue Card with Red Pin Highlight */}
          <div className="bg-white p-6 rounded-3xl border-2 border-google-red/40 shadow-google-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-extrabold text-google-charcoal">
                <MapPin className="w-4 h-4 text-google-red fill-google-red animate-bounce" />
                <span>Marked Venue (Red Pin)</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-google-red text-white text-[10px] font-bold uppercase tracking-wider">
                FIEM Sonarpur
              </span>
            </div>

            <div className="relative h-44 rounded-2xl overflow-hidden border border-google-border">
              <Image
                src={event.venueImageUrl || '/images/fiem-campus-venue.jpeg'}
                alt="FIEM Campus Building"
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-google-red text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>📍 FIEM Campus Main Building</span>
              </div>
            </div>

            <div className="text-xs text-google-gray space-y-1">
              <div className="font-bold text-google-charcoal">{event.venue}</div>
              <div>Future Institute of Engineering & Management</div>
              <div>Sonarpur Station Road, Bara Fartabad, Kolkata, WB 700150</div>
            </div>
          </div>


        </div>

        {/* Right Column — Event Info & Registration Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Event Header Info */}
          <div className="space-y-4">
            
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-3">
              {isFull ? (
                <span className="px-3.5 py-1 rounded-full bg-google-red-light text-google-red text-xs font-bold uppercase tracking-wider">
                  Registration Full
                </span>
              ) : (
                <span className="px-3.5 py-1 rounded-full bg-google-green-light border border-google-green/30 text-google-green text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-google-green animate-pulse" />
                  Registration Open ({seatsLeft} Seats Left)
                </span>
              )}

              <span className="px-3.5 py-1 rounded-full bg-google-blue-light text-google-blue text-xs font-medium">
                Free Student Entry
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-google-charcoal leading-tight">
              {event.title}
            </h1>

            {event.theme && (
              <p className="text-base text-google-blue font-medium italic">
                &quot;{event.theme}&quot;
              </p>
            )}

            {/* Metadata Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-google-gray-light/80 p-5 rounded-2xl border border-google-border">
              
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white text-google-blue border border-google-border shadow-xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-google-gray font-medium">Keynote Speaker</div>
                  <div className="text-sm font-bold text-google-charcoal">{event.speaker}</div>
                  <div className="text-xs text-google-gray">{event.designation}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white text-google-red border border-google-border shadow-xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-google-gray font-medium">Date & Time</div>
                  <div className="text-sm font-bold text-google-charcoal">{event.date}</div>
                  <div className="text-xs text-google-gray">Starts at {event.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white text-google-yellow border border-google-border shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-google-gray font-medium">Campus Venue</div>
                  <div className="text-sm font-bold text-google-charcoal">{event.venue}</div>
                  <div className="text-xs text-google-gray">FIEM Main Campus</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white text-google-green border border-google-border shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-google-gray font-medium">Deadline & Status</div>
                  <div className="text-sm font-bold text-google-charcoal">{event.registrationDeadline || 'Until seats fill'}</div>
                  <div className="text-xs text-google-gray">{registrationCount} Registered</div>
                </div>
              </div>

            </div>

            {/* Event Description */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-google-charcoal uppercase tracking-wider">About This Session</h3>
              <p className="text-sm sm:text-base text-google-gray leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Key Highlights */}
            <div className="bg-white p-5 rounded-2xl border border-google-border space-y-2">
              <div className="text-xs font-bold text-google-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-google-blue" />
                Session Takeaways
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-google-gray">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-google-green" />
                  <span>Deep dive into core DSA patterns</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-google-green" />
                  <span>AI coding assistants & prompt workflows</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-google-green" />
                  <span>Q&A with TCS Senior Software Engineer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-google-green" />
                  <span>Digital QR ticket pass confirmation</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Registration Form / Closed State */}
          {isFull ? (
            <div className="bg-google-red-light p-8 rounded-3xl border border-google-red/30 text-center space-y-3">
              <ShieldCheck className="w-10 h-10 text-google-red mx-auto" />
              <h3 className="text-xl font-bold text-google-red">Registrations Are Closed</h3>
              <p className="text-xs text-google-gray max-w-md mx-auto">
                This event has reached maximum participant capacity. Please check our events directory for future technical workshops.
              </p>
            </div>
          ) : (
            <RegistrationForm eventId={event.id} eventTitle={event.title} />
          )}

        </div>

      </div>

    </div>
  )
}
