import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Public paths
  const publicPaths = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/error',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/emergency',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/api/auth',
    '/api/health'
  ]
  
  // Check if path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path)
  )
  
  // Get session from cookies
  const sessionCookie = request.cookies.get('next-auth.session-token')
  const userCookie = request.cookies.get('user-data')
  
  let userRole = null
  if (userCookie) {
    try {
      const userData = JSON.parse(userCookie.value)
      userRole = userData.role || null
    } catch (error) {
      console.error('Error parsing user cookie:', error)
    }
  }
  
  const hasValidSession = !!sessionCookie
  
  // Admin paths - only accessible to admins
  const adminPaths = ['/admin']
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path))
  
  // If accessing admin path without valid session or non-admin role
  if (isAdminPath && (!hasValidSession || userRole !== 'admin')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
  
  // If accessing protected path without valid session
  if (!isPublicPath && !hasValidSession) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }
  
  // If accessing signin with valid session, redirect to dashboard
  if (pathname === '/auth/signin' && hasValidSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If accessing signup with valid session, redirect to dashboard
  if (pathname === '/auth/signup' && hasValidSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/chat/:path*',
    '/psychiatrists/:path*',
    '/appointments/:path*',
    '/admin/:path*',
    '/auth/signin'
  ]
}