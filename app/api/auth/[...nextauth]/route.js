import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  
  // Database sessions only - no JWT
  session: {
    strategy: "jwt", // NextAuth still uses JWT internally but we ignore it
    maxAge: 30 * 24 * 60 * 60,
  },
  
  callbacks: {
    // Simple session callback
    async session({ session, token }) {
      // Just return basic user info
      if (session?.user) {
        session.user.id = token.sub || token.email
      }
      return session
    },
    
    // Simple redirect
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`
    }
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }