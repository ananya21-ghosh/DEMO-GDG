import { prisma } from './db'
import { hashPassword } from './auth'

export async function seedDatabase() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gdgfiem.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123_fiem'

    const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } })

    if (!existingAdmin) {
      const hashedPassword = await hashPassword(adminPassword)
      try {
        await prisma.admin.create({
          data: {
            email: adminEmail,
            password: hashedPassword,
            name: 'GDG FIEM Lead'
          }
        })
      } catch {
        // Ignore parallel build seed race
      }
    }

    const primaryEventSlug = 'dsa-meets-genai'
    const existingEvent = await prisma.event.findUnique({ where: { slug: primaryEventSlug } })

    if (!existingEvent) {
      try {
        await prisma.event.create({
          data: {
            slug: primaryEventSlug,
            title: 'DSA Meets GenAI: Mastering Core Coding in the AI Era',
            theme: 'Bridging Algorithmic Depth with AI-Assisted Engineering for Modern Problem Solvers.',
            speaker: 'Samira Hadid',
            designation: 'Senior Software Engineer / TCS',
            date: '21 September 2026',
            time: '2:00 PM',
            venue: 'FIEM Campus',
            description: 'Join us for an exclusive technical masterclass at FIEM Campus featuring Samira Hadid, Senior Software Engineer at TCS. Learn how data structures, core algorithms, and modern Generative AI tooling combine to elevate developer productivity and algorithmic problem solving in real-world software engineering.',
            posterUrl: '/images/event-poster-dsa-genai.jpeg',
            venueImageUrl: '/images/fiem-campus-venue.jpeg',
            capacity: 300,
            isPublished: true,
            isFeatured: true,
            registrationDeadline: '21 September 2026, 1:30 PM'
          }
        })
      } catch {
        // Ignore parallel build seed race
      }
    }
  } catch (error) {
    // Silent build seed guard
  }
}
