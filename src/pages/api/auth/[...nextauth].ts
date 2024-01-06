import NextAuth, {NextAuthOptions} from 'next-auth'
import { authenticate } from "@/services/authService"
// import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
// import Apple from "next-auth/providers/apple"
// import Atlassian from "next-auth/providers/atlassian"
// import Auth0 from "next-auth/providers/auth0"
// import Authentik from "next-auth/providers/authentik"
// import AzureAD from "next-auth/providers/azure-ad"
// import AzureB2C from "next-auth/providers/azure-ad-b2c"
// import Battlenet from "next-auth/providers/battlenet"
// import Box from "next-auth/providers/box"
// import BoxyHQSAML from "next-auth/providers/boxyhq-saml"
// import Bungie from "next-auth/providers/bungie"
// import Cognito from "next-auth/providers/cognito"
// import Coinbase from "next-auth/providers/coinbase"
// import Discord from "next-auth/providers/discord"
// import Dropbox from "next-auth/providers/dropbox"
// import DuendeIDS6 from "next-auth/providers/duende-identity-server6"
// import Eveonline from "next-auth/providers/eveonline"
// import Facebook from "next-auth/providers/facebook"
// import Faceit from "next-auth/providers/faceit"
// import FortyTwoSchool from "next-auth/providers/42-school"
// import Foursquare from "next-auth/providers/foursquare"
// import Freshbooks from "next-auth/providers/freshbooks"
// import Fusionauth from "next-auth/providers/fusionauth"
// import GitHub from "next-auth/providers/github"
// import Gitlab from "next-auth/providers/gitlab"
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials"
import mongoClient from '@/lib/mongodb'
import { User } from '@/lib/service_types'

const { clientPromise } = mongoClient

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    /*CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize (credentials, req) {
        if (typeof credentials !== "undefined") {
          const res = await authenticate(credentials.email, credentials.password)
          if (typeof res !== "undefined") {
            return { ...res.user, apiToken: res.token }
          } else {
            return null
          }
        } else {
          return null
        }
      }
    }),*/
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
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
              jobs: [],
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
    async session({ session, token, user }) {
      if (token.user) {
        session.user = { ...token.user, image: session.user?.image }
      }
      return session
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
// import Hubspot from "next-auth/providers/hubspot"
// import Instagram from "next-auth/providers/instagram"
// import Kakao from "next-auth/providers/kakao"
// import Keycloak from "next-auth/providers/keycloak"
// import Line from "next-auth/providers/line"
// import LinkedIn from "next-auth/providers/linkedin"
// import Mailchimp from "next-auth/providers/mailchimp"
// import Mailru from "next-auth/providers/mailru"
// import Medium from "next-auth/providers/medium"
// import Naver from "next-auth/providers/naver"
// import Netlify from "next-auth/providers/netlify"
// import Okta from "next-auth/providers/okta"
// import Onelogin from "next-auth/providers/onelogin"
// import Osso from "next-auth/providers/osso"
// import Osu from "next-auth/providers/osu"
// import Passage from "next-auth/providers/passage"
// import Patreon from "next-auth/providers/patreon"
// import Pinterest from "next-auth/providers/pinterest"
// import Pipedrive from "next-auth/providers/pipedrive"
// import Reddit from "next-auth/providers/reddit"
// import Salesforce from "next-auth/providers/salesforce"
// import Slack from "next-auth/providers/slack"
// import Spotify from "next-auth/providers/spotify"
// import Strava from "next-auth/providers/strava"
// import Todoist from "next-auth/providers/todoist"
// import Trakt from "next-auth/providers/trakt"
// import Twitch from "next-auth/providers/twitch"
// import Twitter from "next-auth/providers/twitter"
// import UnitedEffects from "next-auth/providers/united-effects"
// import Vk from "next-auth/providers/vk"
// import Wikimedia from "next-auth/providers/wikimedia"
// import Wordpress from "next-auth/providers/wordpress"
// import WorkOS from "next-auth/providers/workos"
// import Yandex from "next-auth/providers/yandex"
// import Zitadel from "next-auth/providers/zitadel"
// import Zoho from "next-auth/providers/zoho"
// import Zoom from "next-auth/providers/zoom"

// Apple,
// Atlassian,
// Auth0,
// Authentik,
// AzureAD,
// AzureB2C,
// Battlenet,
// Box,
// BoxyHQSAML,
// Bungie,
// Cognito,
// Coinbase,
// Discord,
// Dropbox,
// DuendeIDS6,
// Eveonline,
// Facebook,
// Faceit,
// FortyTwoSchool,
// Foursquare,
// Freshbooks,
// Fusionauth,
// Gitlab,
// Google,
// Hubspot,
// Instagram,
// Kakao,
// Keycloak,
// Line,
// LinkedIn,
// Mailchimp,
// Mailru,
// Medium,
// Naver,
// Netlify,
// Okta,
// Onelogin,
// Osso,
// Osu,
// Passage,
// Patreon,
// Pinterest,
// Pipedrive,
// Reddit,
// Salesforce,
// Slack,
// Spotify,
// Strava,
// Todoist,
// Trakt,
// Twitch,
// Twitter,
// UnitedEffects,
// Vk,
// Wikimedia,
// Wordpress,
// WorkOS,
// Yandex,
// Zitadel,
// Zoho,
// Zoom,
