import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import mongoClient from '@/lib/mongodb'
import { User } from '@/lib/service_types'
import { compare } from 'bcrypt'

const { clientPromise } = mongoClient

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        const client = await clientPromise
        const db = client.db('proctor')
        const usersCollection = db.collection('users')
        const user = await usersCollection.findOne<User>({ email })
        console.log(user)
        if (!user || !(await compare(password, user.password))) {
          throw new Error('Invalid email or password')
        }
        console.log('email:', user.email)
        console.log('ID:', user._id)
        return {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          userRole: user.userRole,
          is_writer: user.is_writer,
          orders: user.orders,
          writer_profile: user.writer_profile,
          jobs: user.jobs,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.user = user as User
      }
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        if (profile && profile.email && profile.name) {
          // create user in db make sure email is unique, db to determine user role
          const client = await clientPromise
          const db = client.db('proctor')
          const users_collection = db.collection('users')

          // check if user exists in collection using primary constraint email

          const userFromDB = await users_collection.findOne<User>({
            email: profile.email,
          })

          if (userFromDB) {
            token.user = {
              ...userFromDB,
              _id: userFromDB._id.toString(),
            }
            token.user_id = userFromDB._id.toString()
            token.userRole = userFromDB.userRole
          } else {
            let defaultUser = {
              email: profile.email,
              name: profile.name,
              userRole: 'user',
              is_writer: false,
              orders: 0,
              writer_profile: null,
            }
            // create user, they didn't exist
            const { acknowledged, insertedId } =
              await users_collection.insertOne(defaultUser)

            if (acknowledged) {
              // insert user id to token but since it ObjectId you have to convert to string
              token.user = {
                ...defaultUser,
                _id: insertedId.toString(),
              } as User
              token.user_id = insertedId.toString()
              token.userRole = 'user'
            }
          }
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as User
        console.log('SESSION USER:', session.user)
        // session.user = { ...token.user, image: session.user?.image }
      }
      session.navigationBackground = 'transparent'
      return session
    },
  },
}

export default NextAuth(authOptions)
