import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        console.log('ACCOUNT', account)
        if (profile) {
          // create user in db make sure email is unique, db to determine user role
          console.log('PROFILE', profile)
        }
      }
      token.userRole = 'admin'
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (session.user) (session.user as any)['userRole'] = token.userRole

      return session
    },
  },
}

export default NextAuth(authOptions)
