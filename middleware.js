import { NextResponse } from 'next/server'

export function proxy (request) {
  const { pathname } = request.nextUrl
  
  // Public paths
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/error',
    '/emergency',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/api/auth'
  ]
  
  // Check if path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path)
  )
  
  // Get session cookie
  const hasSession = request.cookies.has('next-auth.session-token')
  
  // If accessing protected path without session
  if (!isPublicPath && !hasSession) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
  
  // If accessing signin with session
  if (pathname === '/auth/signin' && hasSession) {
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
    '/auth/login'
  ]
}