import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { getDatabase } from '@/lib/database.js'
import User from '@/lib/models/User.js'
import bcrypt from 'bcryptjs'

// Rate limiting store
const loginAttempts = new Map()
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials
          
          // Rate limiting check
          const now = Date.now()
          const attemptData = loginAttempts.get(email) || { count: 0, lockUntil: 0 }
          
          if (attemptData.lockUntil > now) {
            throw new Error('Account temporarily locked. Please try again later.')
          }
          
          // Database connection
          const sequelize = getDatabase()
          if (!sequelize) {
            throw new Error('Database not available')
          }
          await sequelize.authenticate()
          
          // Find user
          const user = await User.findOne({ where: { email } })
          if (!user) {
            // Increment failed attempts for non-existent users too
            loginAttempts.set(email, { 
              count: attemptData.count + 1, 
              lockUntil: attemptData.lockUntil 
            })
            throw new Error('Invalid email or password')
          }
          
          // Check if user is active
          if (!user.isActive) {
            throw new Error('Account is disabled')
          }
          
          // Check if email is verified (for credentials provider only)
          if (!user.emailVerified) {
            throw new Error('Please verify your email address before signing in. Check your email for the verification link.')
          }
          
          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password)
          if (!isPasswordValid) {
            // Increment failed attempts
            const newCount = attemptData.count + 1
            const lockUntil = newCount >= MAX_ATTEMPTS ? now + LOCKOUT_TIME : 0
            loginAttempts.set(email, { count: newCount, lockUntil })
            
            throw new Error('Invalid email or password')
          }
          
          // Reset login attempts on successful login
          loginAttempts.delete(email)
          
          // Update last login
          await user.update({ lastLogin: new Date() })
          
          // Return user object without password
          return {
            id: user.id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            image: null
          }
        } catch (error) {
          throw new Error(error.message)
        }
      }
    })
  ],
  
  // NO JWT - Using database session strategy
  session: {
    strategy: "database", // Database sessions instead of JWT
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session daily
  },
  
  // Custom callbacks - enhanced user data
  callbacks: {
    async session({ session, token, user }) {
      // Add user ID and role to session
      if (session?.user) {
        session.user.id = token.sub || user?.id || session.user.email
        session.user.role = token.role || user?.role || 'patient'
        
        // Add additional user data for database sessions
        if (token.dbUser) {
          session.user.firstName = token.dbUser.firstName
          session.user.lastName = token.dbUser.lastName
          session.user.role = token.dbUser.role
        }
      }
      return session
    },
    
    async jwt({ token, user, account, profile }) {
      // Add user role to JWT token for credentials provider
      if (user) {
        token.role = user.role
        token.dbUser = user
      }
      return token
    },
    
    async signIn({ user, account, profile }) {
      // Allow sign in for all providers
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