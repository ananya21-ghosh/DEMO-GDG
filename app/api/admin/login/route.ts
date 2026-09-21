import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { comparePassword, generateAdminToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
    }

    const validPassword = await comparePassword(password, admin.password)
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
    }

    const token = generateAdminToken({
      id: admin.id,
      email: admin.email,
      name: admin.name
    })

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      admin: { name: admin.name, email: admin.email }
    })

    response.cookies.set({
      name: 'gdg_admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('[ADMIN LOGIN API ERROR]', error)
    return NextResponse.json({ error: 'Server authentication failure' }, { status: 500 })
  }
}
