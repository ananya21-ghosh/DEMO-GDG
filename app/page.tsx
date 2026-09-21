import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import SocialIcons from '@/components/SocialIcons'
import { Calendar, Clock, MapPin, UserCheck, ArrowRight, Sparkles, Code2, Cpu, GraduationCap, CheckCircle2 } from 'lucide-react'

export const revalidate = 0 // Dynamic data rendering

export default async function HomePage() {
  const featuredEvent = await prisma.event.findFirst({
    where: { isPublished: true, isFeatured: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-google-gray-light/60 via-white to-white py-16 lg:py-24 border-b border-google-border">
        {/* Subtle Decorative Google Color Accents */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-google-blue-light/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-google-green-light/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-google-blue-light border border-google-blue/20 text-google-blue text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-google-blue" />
                <span>Google Developer Group — On Campus FIEM</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-google-charcoal tracking-tight leading-[1.15]">
                Bridging Core Engineering with <span className="text-google-blue">Modern AI</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-google-gray max-w-2xl font-normal leading-relaxed">
                Welcome to the official developer community at Future Institute of Engineering & Management. We host hands-on workshops, algorithmic masterclasses, and tech conferences designed by student developers, for student developers.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/events"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-google-blue hover:bg-google-blue-dark text-white font-semibold shadow-md hover:shadow-google-hover transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  Explore Events
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                
                <Link
                  href={featuredEvent ? `/events/${featuredEvent.id}` : "/events"}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-google-green hover:bg-google-green-dark text-white font-bold shadow-md hover:shadow-google-hover transition-all duration-200 flex items-center justify-center gap-2 animate-pulse hover:animate-none"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>RSVP Event Pass</span>
                </Link>

                <Link
                  href="#join"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-google-border hover:border-google-blue text-google-charcoal hover:text-google-blue font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  Join Our Community
                </Link>
              </div>

              {/* Trust & Campus Indicator */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-medium text-google-gray border-t border-google-border/60">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-google-green" />
                  <span>Official Student Chapter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-google-blue" />
                  <span>FIEM Campus, Sonarpur</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-google-red" />
                  <span>Real Backend & Ticket Verification</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card / Brand Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white p-6 rounded-2xl border border-google-border shadow-google-hover space-y-6">
                <div className="flex justify-between items-center border-b border-google-border pb-4">
                  <div className="relative h-12 w-52">
                    <Image src="/images/gdg-logo.jpeg" alt="GDG Logo" fill className="object-contain" />
                  </div>
                  <div className="relative h-10 w-36">
                    <Image src="/images/fiem-logo.jpeg" alt="FIEM Logo" fill className="object-contain" />
                  </div>
                </div>

                <div className="relative h-56 rounded-xl overflow-hidden border border-google-border group">
                  <Image
                    src="/images/fiem-campus-venue.jpeg"
                    alt="FIEM Campus Building"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white text-sm font-semibold flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-google-yellow" />
                      Future Institute of Engineering & Management
                    </span>
                  </div>
                </div>

                <div className="bg-google-gray-light p-4 rounded-xl text-xs text-google-gray space-y-1.5">
                  <div className="font-semibold text-google-charcoal flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-google-blue" />
                    Student Community Hub
                  </div>
                  <p>Discover real technical sessions, network with industry engineers, and gain hands-on skills.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED EVENT SECTION */}
      {featuredEvent && (
        <section id="featured-event" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <h2 className="text-xs font-bold text-google-blue uppercase tracking-widest">Featured Technical Session</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-google-charcoal tracking-tight">
              Upcoming Main Event
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-google-border shadow-google-hover overflow-hidden transition-all duration-300 hover:border-google-blue/40">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Poster Container - Preserves original ratio without cropping */}
              <div className="lg:col-span-5 bg-google-gray-light p-4 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-google-border">
                <div className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={featuredEvent.posterUrl}
                    alt={featuredEvent.title}
                    fill
                    className="object-contain bg-white"
                    priority
                  />
                </div>
              </div>

              {/* Event Content & Details */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  {/* Status Badge */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-google-green-light border border-google-green/30 text-google-green text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-google-green animate-pulse" />
                      Registration Open
                    </span>
                    <span className="px-3 py-1 rounded-full bg-google-blue-light border border-google-blue/30 text-google-blue text-xs font-medium">
                      FIEM Campus In-Person
                    </span>
                  </div>

                  {/* Title & Theme */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-google-charcoal leading-tight">
                      {featuredEvent.title}
                    </h3>
                    {featuredEvent.theme && (
                      <p className="mt-2 text-sm sm:text-base text-google-blue font-medium italic">
                        &quot;{featuredEvent.theme}&quot;
                      </p>
                    )}
                  </div>

                  {/* Key Event Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-google-gray-light/70 p-4 sm:p-5 rounded-2xl border border-google-border/80">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-white text-google-blue border border-google-border shadow-xs">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-google-gray font-medium">Featured Speaker</div>
                        <div className="text-sm font-bold text-google-charcoal">{featuredEvent.speaker}</div>
                        <div className="text-xs text-google-gray">{featuredEvent.designation}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-white text-google-red border border-google-border shadow-xs">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-google-gray font-medium">Date & Time</div>
                        <div className="text-sm font-bold text-google-charcoal">{featuredEvent.date}</div>
                        <div className="text-xs text-google-gray">{featuredEvent.time}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-white text-google-yellow border border-google-border shadow-xs">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-google-gray font-medium">Event Venue</div>
                        <div className="text-sm font-bold text-google-charcoal">{featuredEvent.venue}</div>
                        <div className="text-xs text-google-gray">Future Institute of Engineering & Management</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-white text-google-green border border-google-border shadow-xs">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-google-gray font-medium">Capacity & Deadline</div>
                        <div className="text-sm font-bold text-google-charcoal">Limited ({featuredEvent.capacity} Seats)</div>
                        <div className="text-xs text-google-gray">{featuredEvent.registrationDeadline || 'Until full'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Description Excerpt */}
                  <p className="text-sm text-google-gray leading-relaxed">
                    {featuredEvent.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-google-border">
                  <Link
                    href={`/events/${featuredEvent.id}`}
                    className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-xl bg-google-blue hover:bg-google-blue-dark text-white font-bold shadow-md hover:shadow-google-hover text-center transition-all flex items-center justify-center gap-2"
                  >
                    Register Now — Free Entry
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/events/${featuredEvent.id}`}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-google-border hover:border-google-blue text-google-charcoal hover:text-google-blue font-semibold text-center transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 3. COMMUNITY OVERVIEW SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-xs font-bold text-google-green uppercase tracking-widest">What We Do</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-google-charcoal tracking-tight">
            Empowering Engineering Students at FIEM
          </p>
          <p className="text-base text-google-gray">
            Our campus community provides student developers with direct exposure to core algorithms, modern AI tools, cloud engineering, and peer collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-google-border shadow-google-card hover:shadow-google-hover transition-all duration-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-google-blue-light text-google-blue flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-google-charcoal">Algorithmic Excellence</h3>
            <p className="text-sm text-google-gray leading-relaxed">
              Master core Data Structures and Algorithms with structured problem-solving sessions, coding contests, and interview preparation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-google-border shadow-google-card hover:shadow-google-hover transition-all duration-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-google-green-light text-google-green flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-google-charcoal">AI & GenAI Integration</h3>
            <p className="text-sm text-google-gray leading-relaxed">
              Explore generative AI models, prompt engineering, agentic workflows, and real-world AI software application building.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-google-border shadow-google-card hover:shadow-google-hover transition-all duration-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-google-red-light text-google-red flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-google-charcoal">Industry Speaker Sessions</h3>
            <p className="text-sm text-google-gray leading-relaxed">
              Connect directly with senior engineers and tech leaders from companies like TCS, Google, and top engineering firms.
            </p>
          </div>

        </div>

        {/* Gift & Swag Culture Showcase */}
        <div className="mt-16 bg-gradient-to-r from-google-gray-light to-white p-8 sm:p-12 rounded-3xl border border-google-border flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-google-yellow-light text-google-charcoal text-xs font-bold uppercase tracking-wider">
              Swags & Peer Learning
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-google-charcoal">
              Learn, Collaborate & Win GDG Community Perks
            </h3>
            <p className="text-sm text-google-gray leading-relaxed">
              Every workshop features interactive coding challenges, live Q&A sessions with guest speakers, official digital certificates, and exclusive developer gift goodies.
            </p>
          </div>
          <div className="relative w-full md:w-80 h-48 rounded-2xl overflow-hidden shadow-md border border-google-border">
            <Image
              src="/images/gdg-gifts.jpeg"
              alt="GDG Community Gifts"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4. JOIN OUR COMMUNITY SECTION (SOCIAL MEDIA ICONS ONLY) */}
      <section id="join" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white border border-google-border rounded-3xl p-8 sm:p-14 text-center shadow-google-hover space-y-8 relative overflow-hidden">
          
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-google-blue-light/50 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-google-yellow-light/50 rounded-full blur-2xl" />

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-xs font-bold text-google-blue uppercase tracking-widest">Connect With GDG FIEM</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-google-charcoal tracking-tight">
              Join Our Community
            </h3>
            <p className="text-sm sm:text-base text-google-gray leading-relaxed">
              Stay updated with upcoming hackathons, tech talks, and registration announcements across our official social channels.
            </p>
          </div>

          {/* Icons ONLY - No raw URLs */}
          <div className="flex justify-center relative z-10">
            <SocialIcons className="flex items-center space-x-6 sm:space-x-8" iconSize={32} />
          </div>

        </div>
      </section>

    </div>
  )
}
