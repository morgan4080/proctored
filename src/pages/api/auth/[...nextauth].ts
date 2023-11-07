import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import mongoClient from '@/lib/mongodb'
const { clientPromise } = mongoClient
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
        if (profile) {
          // create user in db make sure email is unique, db to determine user role
          const client = await clientPromise
          const db = client.db('proctor')
          const users_collection = db.collection('users')

          // check if user exists in collection using primary constraint email

          const user = await users_collection.findOne({ email: profile.email })

          console.log('PROFILE USER DB', user)

          if (user) {
            token.user_id = user._id.toString()
          } else {
            const { acknowledged, insertedId } =
              await users_collection.insertOne({
                email: profile.email,
                name: profile.name,
              })

            if (acknowledged) {
              // insert user id to token but since it ObjectId you have to convert to string
              token.user_id = insertedId.toString()
            }
          }
        }
      }

      return {
        ...token,
        userRole: 'admin',
      }
    },
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          userRole: token.userRole,
        },
      }
    },
  },
}

export default NextAuth(authOptions)

/*
// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt"

import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // If you don't have the NEXTAUTH_SECRET environment variable set,
  // you will have to pass your secret as `secret` to `getToken`
  const token = await getToken({ req })
  res.send(JSON.stringify(token, null, 2))
}



// This is an example of to protect an API route
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    return res.send({
      content:
        'This is protected content. You can access this content because you are signed in.',
    })
  }

  res.send({
    error: 'You must be signed in to view the protected content on this page.',
  })
}



// This is an example of how to access a session from an API route
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)
  res.send(JSON.stringify(session, null, 2))
}


*/
