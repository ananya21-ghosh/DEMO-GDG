'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Calendar, Users, HeartHandshake, ShieldCheck } from 'lucide-react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-google-border shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Brand Logos - Larger & Highly Visible */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link href="/" className="flex items-center group">
              <div className="relative h-13 sm:h-16 w-56 sm:w-72 transition-transform duration-200 group-hover:scale-[1.02]">
                <Image
                  src="/images/gdg-logo.jpeg"
                  alt="Google Developer Group - Future Institute of Engineering & Management"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            <div className="h-10 w-[1.5px] bg-google-border hidden sm:block" />

            <Link href="/" className="flex items-center group hidden sm:block">
              <div className="relative h-12 sm:h-14 w-40 sm:w-48 transition-transform duration-200 group-hover:scale-[1.02]">
                <Image
                  src="/images/fiem-logo.jpeg"
                  alt="Future Institute of Engineering and Management Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-[15px] font-semibold text-google-charcoal hover:text-google-blue transition-colors duration-150 flex items-center gap-1.5"
            >
              Home
            </Link>
            <Link
              href="/events"
              className="text-[15px] font-semibold text-google-charcoal hover:text-google-blue transition-colors duration-150 flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-google-blue" />
              Events
            </Link>
            <Link
              href="/#about"
              className="text-[15px] font-semibold text-google-charcoal hover:text-google-blue transition-colors duration-150 flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-google-green" />
              About Community
            </Link>
            <Link
              href="/#join"
              className="text-[15px] font-semibold text-google-charcoal hover:text-google-blue transition-colors duration-150 flex items-center gap-1.5"
            >
              <HeartHandshake className="w-4 h-4 text-google-red" />
              Join Community
            </Link>

            <Link
              href="/admin/login"
              className="text-xs font-bold text-google-gray hover:text-google-charcoal bg-google-gray-light border border-google-border px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-google-blue" />
              Organizer Auth
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-google-charcoal hover:bg-google-gray-light transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-google-red" /> : <Menu className="w-6 h-6 text-google-blue" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-google-border px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-md text-base font-medium text-google-charcoal hover:bg-google-gray-light hover:text-google-blue transition-colors"
          >
            Home
          </Link>
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-md text-base font-medium text-google-charcoal hover:bg-google-gray-light hover:text-google-blue transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-google-blue" />
            Events
          </Link>
          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-md text-base font-medium text-google-charcoal hover:bg-google-gray-light hover:text-google-blue transition-colors flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-google-green" />
            About Community
          </Link>
          <Link
            href="/#join"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-md text-base font-medium text-google-charcoal hover:bg-google-gray-light hover:text-google-blue transition-colors flex items-center gap-2"
          >
            <HeartHandshake className="w-4 h-4 text-google-red" />
            Join Our Community
          </Link>
          <div className="pt-2 border-t border-google-border">
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 text-xs font-semibold text-google-gray hover:text-google-charcoal flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-google-blue" />
              Organizer Portal Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
