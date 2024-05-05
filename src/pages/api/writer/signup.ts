// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import mongoClient from '@/lib/mongodb'
import { User } from '@/lib/service_types'
const { clientPromise } = mongoClient

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password, name } = req.body

  // Check if the user already exists
  const client = await clientPromise
  const db = client.db('proctor')
  const users_collection = db.collection('users')

  const existingUser = await users_collection.findOne<User>({ email })
  if (existingUser) {
    return res.status(409).json({ error: 'Email already exists' })
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create a new user document
  const newUser = {
    email,
    name,
    password: hashedPassword,
    userRole: 'admin',
    is_writer: false,
    orders: 0,
    writer_profile: null,
    jobs: [],
  }

  console.log(newUser)

  // Insert the new user into the database
  const { acknowledged, insertedId } = await users_collection.insertOne(newUser)

  if (!acknowledged) {
    return res.status(500).json({ error: 'Failed to create user' })
  }

  // Return the new user object (optional)
  res.status(201).json({ ...newUser, _id: insertedId })
}
