import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Simple in-memory session store (for demo, use database in production)
const sessions = new Map()

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  
  // NO JWT - Using database session strategy
  session: {
    strategy: "database", // Database sessions instead of JWT
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session daily
  },
  
  // Custom callbacks - simple user data
  callbacks: {
    async session({ session, user }) {
      // Add user ID to session
      if (session?.user) {
        session.user.id = user?.id || session.user.email
      }
      return session
    },
    
    async signIn({ user, account, profile }) {
      // Simple sign in - always allow
      return true
    },
    
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after sign in
      return `${baseUrl}/dashboard`
    }
  },
  
  // Custom pages
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/'
  },
  
  // Events
  events: {
    async signIn({ user }) {
      console.log('User signed in:', user.email)
    },
    async signOut({ token, session }) {
      console.log('User signed out')
    }
  },
  
  // Cookie settings
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }