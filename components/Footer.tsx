import Link from 'next/link'
import Image from 'next/image'
import SocialIcons from './SocialIcons'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-google-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-google-border pb-10">
          
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative h-10 w-44">
                <Image
                  src="/images/gdg-logo.jpeg"
                  alt="GDG FIEM Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="h-6 w-[1px] bg-google-border" />
              <div className="relative h-8 w-28">
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
                <Link href="/#about" className="text-google-gray hover:text-google-blue transition-colors">
                  About GDG FIEM
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
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-google-gray gap-4">
          <p>© 2026 GDG on Campus FIEM. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Google Developer Group FIEM is an independent student community group.
          </p>
        </div>
      </div>
    </footer>
  )
}
