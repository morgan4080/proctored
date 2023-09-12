import { WithId, Document } from 'mongodb'
import clientPromise from '../../../libs/mongodb'

export default async function handler(
  req: any,
  res: { json: (arg0: WithId<Document>[]) => void },
) {
  try {
    const client = await clientPromise
    const db = client.db('sample_airbnb')

    const movies = await db
      .collection('listingsAndReviews')
      .find({})
      .sort({ metacritic: -1 })
      .limit(10)
      .toArray()

    res.json(movies)
  } catch (e) {
    console.error(e)
  }
}
