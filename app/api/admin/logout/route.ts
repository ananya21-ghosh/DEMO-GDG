import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out' })
  response.cookies.delete('gdg_admin_token')
  return response
}
