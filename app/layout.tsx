import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { seedDatabase } from '@/lib/seed'

export const metadata: Metadata = {
  title: 'GDG on Campus FIEM — Premium Event Management & Community Platform',
  description: 'Official Google Developer Group community platform at Future Institute of Engineering & Management (FIEM). Discover upcoming technical events, register, get instant QR tickets, and connect with peer student developers.',
  keywords: ['GDG FIEM', 'Google Developer Group FIEM', 'DSA Meets GenAI', 'Samira Hadid', 'Future Institute of Engineering and Management', 'FIEM Events'],
  openGraph: {
    title: 'GDG on Campus FIEM — Developer Community & Events',
    description: 'Master core coding in the AI era with GDG FIEM workshops, guest speaker sessions, and technical events.',
    url: 'https://gdgfiem.com',
    siteName: 'GDG on Campus FIEM',
    images: [
      {
        url: '/images/event-poster-dsa-genai.jpeg',
        width: 1200,
        height: 630,
        alt: 'DSA Meets GenAI: Mastering Core Coding in the AI Era',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Ensure default database seed is executed
  await seedDatabase()

  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white text-google-charcoal antialiased selection:bg-google-blue-light selection:text-google-blue">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
