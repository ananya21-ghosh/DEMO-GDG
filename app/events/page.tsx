import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { Calendar, MapPin, UserCheck, ArrowRight, Sparkles } from 'lucide-react'

export const revalidate = 0

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-google-blue-light text-google-blue text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          GDG FIEM Event Directory
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-google-charcoal tracking-tight">
          Discover Technical Events
        </h1>
        <p className="text-base text-google-gray">
          Register for hands-on engineering workshops, AI masterclasses, and speaker sessions organized at Future Institute of Engineering & Management.
        </p>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="bg-white border border-google-border rounded-2xl p-12 text-center text-google-gray space-y-3 max-w-md mx-auto">
          <Calendar className="w-10 h-10 text-google-gray mx-auto" />
          <h3 className="text-lg font-bold text-google-charcoal">No Events Currently Published</h3>
          <p className="text-sm">Check back soon for new announcements from GDG on Campus FIEM.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-google-border shadow-google-card hover:shadow-google-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-google-blue/40"
            >
              <div>
                {/* Poster container with aspect ratio preservation */}
                <div className="relative w-full aspect-[4/3] bg-google-gray-light border-b border-google-border overflow-hidden">
                  <Image
                    src={event.posterUrl}
                    alt={event.title}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  {event.isFeatured && (
                    <div className="absolute top-3 left-3 bg-google-blue text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                      Featured Event
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-google-green">
                    <span className="w-2 h-2 rounded-full bg-google-green" />
                    Registration Open
                  </div>

                  <h3 className="text-xl font-bold text-google-charcoal line-clamp-2 leading-snug group-hover:text-google-blue transition-colors">
                    {event.title}
                  </h3>

                  {event.theme && (
                    <p className="text-xs text-google-gray line-clamp-2 italic">
                      &quot;{event.theme}&quot;
                    </p>
                  )}

                  <div className="space-y-2 pt-2 text-xs text-google-gray border-t border-google-border/60">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-google-blue shrink-0" />
                      <span className="font-medium text-google-charcoal">{event.speaker}</span> ({event.designation})
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-google-red shrink-0" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-google-yellow shrink-0" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <Link
                  href={`/events/${event.id}`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-google-blue hover:bg-google-blue-dark text-white font-semibold text-xs text-center shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  Register Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/events/${event.id}`}
                  className="px-4 py-2.5 rounded-xl bg-white border border-google-border hover:border-google-blue text-google-charcoal hover:text-google-blue font-medium text-xs text-center transition-colors"
                >
                  Details
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}
