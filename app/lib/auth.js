import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { getDatabase } from '@/lib/database.js'
import getUser from '@/lib/models/User.js'
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
          
          if (!email || !password) {
            throw new Error('Email and password are required')
          }
          
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
          
          try {
            await sequelize.authenticate()
          } catch (dbError) {
            throw new Error('Database connection failed')
          }
          
          // Get User model at runtime
          const User = getUser()
          if (!User) {
            throw new Error('User model unavailable')
          }
          
          // Find user
          let user
          try {
            user = await User.findOne({ where: { email } })
          } catch (queryError) {
            console.error('Database query error:', queryError)
            throw new Error('Failed to authenticate user')
          }
          
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
            throw new Error('Account is disabled. Please contact support.')
          }
          
          // Check if email is verified (for credentials provider only)
          if (!user.emailVerified) {
            throw new Error('Please verify your email address before signing in.')
          }
          
          // Verify password
          let isPasswordValid = false
          try {
            isPasswordValid = await bcrypt.compare(password, user.password)
          } catch (bcryptError) {
            console.error('Password comparison error:', bcryptError)
            throw new Error('Failed to verify password')
          }
          
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
          try {
            await user.update({ lastLogin: new Date() })
          } catch (updateError) {
            console.error('Failed to update last login:', updateError)
            // Don't fail login if we can't update lastLogin
          }
          
          // Return user object without password
          return {
            id: user.id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role || 'patient',
            image: null
          }
        } catch (error) {
          console.error('Authorization error:', error.message)
          throw new Error(error.message || 'Authentication failed')
        }
      }
    })
  ],
  
  // JWT session strategy (no database adapter needed)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session daily
  },
  
  // Custom callbacks - enhanced user data
  callbacks: {
    async session({ session, token }) {
      // Add user data from JWT token to session
      if (session?.user && token) {
        session.user.id = token.sub || token.id
        session.user.role = token.role || 'patient'
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
      }
      return session
    },
    
    async jwt({ token, user }) {
      // Add user data to JWT token when user first signs in
      if (user) {
        token.id = user.id
        token.role = user.role || 'patient'
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.email = user.email
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
export { handler }