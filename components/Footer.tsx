import Link from 'next/link'
import Image from 'next/image'
import SocialIcons from './SocialIcons'
import { MapPin, Navigation, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-google-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* FIEM Sonarpur Location Map Section */}
        <div id="location-map" className="bg-google-gray-light/60 p-6 sm:p-8 rounded-3xl border border-google-border space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-google-border pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-google-red-light text-google-red text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                Campus Venue Location
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-google-charcoal">
                Future Institute of Engineering & Management (FIEM)
              </h3>
              <p className="text-xs sm:text-sm text-google-gray mt-1">
                Sonarpur Station Road, Bara Fartabad, Rajpur Sonarpur, Kolkata, West Bengal 700150 (5 mins from Sonarpur Station)
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Future+Institute+of+Engineering+and+Management+Sonarpur"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-google-blue hover:bg-google-blue-dark text-white text-xs font-bold shadow-md transition-all self-start md:self-auto shrink-0"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Live Directions</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-google-border shadow-md">
            <iframe
              title="FIEM Sonarpur Campus Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.7265897825224!2d88.41164997592965!3d22.476901836486047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02722b050d249f%3A0xb35a3fa1e389e173!2sFuture%20Institute%20of%20Engineering%20and%20Management%20(FIEM)!5e0!3m2!1sen!2sin!4v1711000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Footer Navigation & Brand Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-google-border pb-10">
          
          {/* Brand Info with Larger Logos */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative h-14 w-60">
                <Image
                  src="/images/gdg-logo.jpeg"
                  alt="GDG FIEM Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="h-8 w-[1.5px] bg-google-border" />
              <div className="relative h-12 w-40">
                <Image
                  src="/images/fiem-logo.jpeg"
                  alt="FIEM Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-sm text-google-gray max-w-md leading-relaxed">
              Empowering student developers at Future Institute of Engineering & Management through peer learning, modern software engineering, AI workshops, and community events.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-semibold text-google-charcoal uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-google-gray hover:text-google-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-google-gray hover:text-google-blue transition-colors">
                  Upcoming & Past Events
                </Link>
              </li>
              <li>
                <Link href="#location-map" className="text-google-gray hover:text-google-blue transition-colors">
                  Campus Location & Map
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-google-gray hover:text-google-blue transition-colors">
                  Organizer Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Icons Section */}
          <div className="md:col-span-3 flex flex-col items-start md:items-end space-y-3">
            <h4 className="text-xs font-semibold text-google-charcoal uppercase tracking-wider">Connect With Us</h4>
            <SocialIcons className="flex items-center space-x-4" />
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center text-xs text-google-gray gap-4">
          <p>© 2026 GDG on Campus FIEM. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Google Developer Group FIEM is an independent student community group.
          </p>
        </div>
      </div>
    </footer>
  )
}

