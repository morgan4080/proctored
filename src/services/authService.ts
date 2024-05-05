import { compare } from 'bcrypt'
import mongoClient from '@/lib/mongodb'
import { User } from '@/lib/service_types'
const { clientPromise } = mongoClient

export async function authenticate(
  email: string,
  password: string,
): Promise<{ user: User | null; token: string }> {
  const client = await clientPromise
  const db = client.db('proctor')
  const usersCollection = db.collection('users')
  const user = await usersCollection.findOne<User>({ email })

  if (!user || !(await compare(password, user.password))) {
    return { user: null, token: '' }
  }

  return {
    user: {
      ...user,
    },
    token: '',
  }
}
