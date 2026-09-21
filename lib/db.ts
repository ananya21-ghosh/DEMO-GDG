import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Vercel Serverless SQLite Helper: Copy dev.db to writable /tmp on serverless boot
if (process.env.VERCEL) {
  const tmpDbPath = '/tmp/dev.db'
  const localDbPath = path.join(process.cwd(), 'prisma', 'dev.db')

  try {
    if (!fs.existsSync(tmpDbPath)) {
      if (fs.existsSync(localDbPath)) {
        fs.copyFileSync(localDbPath, tmpDbPath)
      }
    }
    process.env.DATABASE_URL = `file:${tmpDbPath}`
  } catch (e) {
    console.error('[VERCEL DB COPY ERROR]', e)
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
