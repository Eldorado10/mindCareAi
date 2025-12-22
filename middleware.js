import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  console.log(`[MIDDLEWARE] Processing path: ${pathname}`)

  // Public paths
  const publicExactPaths = new Set([
    '/',
    '/emergency',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/psychiatrists',
    '/resources',
    '/chatbot'
  ])

  const publicPrefixPaths = [
    '/auth',
    '/api/auth',
    '/api/health',
    '/api/chatbot'
  ]

  // Check if path is public
  const isPublicPath =
    publicExactPaths.has(pathname) ||
    publicPrefixPaths.some(path => pathname.startsWith(path))

  // Get session from cookies
  const sessionCookie = request.cookies.get('next-auth.session-token')
  const userCookie = request.cookies.get('user-data') || request.cookies.get('user')

  let userRole = null
  let userId = null
  if (userCookie) {
    try {
      const userData = JSON.parse(userCookie.value)
      userRole = userData.role || null
      userId = userData.id || null
    } catch (error) {
      console.error('Error parsing user cookie:', error)
    }
  }

  const hasValidSession = !!sessionCookie?.value && (!!userId || !!userRole)

  // Admin paths - only accessible to admins
  const adminPaths = ['/admin']
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path))

  // Patient dashboard paths - only accessible to patients
  const patientPaths = ['/dashboard']
  const isPatientPath = patientPaths.some(path => pathname.startsWith(path))

  // If accessing admin path without valid session or non-admin role
  if (isAdminPath && (!hasValidSession || userRole !== 'admin')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // If accessing patient dashboard without valid session
  // Allow any authenticated user (including admins) to access dashboard
  if (isPatientPath && !hasValidSession) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // If accessing protected path without valid session
  if (!isPublicPath && !hasValidSession) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/profile/:path*',
    '/chatbot/:path*',
    '/appointments/:path*',
    '/admin/:path*',
    '/auth/signin',
    '/api/bookings/:path*',
    '/api/chatbot/:path*',
    '/psychiatrists/:path*'
  ]
}
