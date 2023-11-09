// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import mongoClient from '@/lib/mongodb'
import { MongoInvalidArgumentError, ObjectId } from 'mongodb'

const { clientPromise } = mongoClient

type Page = {
  title: string
  slug: string
  description: string
}

type ResponseData = {
  data: Record<any, any>
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const client = await clientPromise
  const db = client.db('proctor')

  switch (req.method) {
    case 'PUT':
      try {
        const { _id, title, slug, excerpt, description, updated } = req.body
        const papers_collection = db.collection('papers')
        const ddd = await papers_collection.updateOne(
          { _id: new ObjectId(_id) },
          { $set: { title, slug, excerpt, description, updated } },
        )

        const response = {
          data: ddd,
          message: 'Paper Updated Successfully',
        }
        res.status(200).json(response)
      } catch (e: MongoInvalidArgumentError | any) {
        console.error(e)
        res.status(400).json({
          data: {},
          message: e.message,
        })
      }
      break
    case 'POST':
      try {
        const { title, slug, excerpt, description, updated } = req.body
        const paper = {
          title: title,
          slug: slug,
          excerpt: excerpt,
          description: description,
          updated: updated,
        }
        const papers_collection = db.collection('papers')
        await papers_collection.insertOne(paper)
        const response = {
          data: paper,
          message: 'Paper Created Successfully',
        }
        res.status(200).json(response)
      } catch (e) {
        console.error(e)
      }
      break
    case 'GET':
      const { slug, links } = req.query
      if (links) {
        try {
          const projection = { slug: 1, title: 1 }
          const paper = await db
            .collection('papers')
            .find({})
            .project(projection)
            .toArray()

          const response = {
            data: paper,
            message: 'Ok',
          }

          res.status(200).json(response)
        } catch (e) {
          console.error(e)
        }
      } else if (slug) {
        try {
          const paper = await db
            .collection('papers')
            .find({ slug: slug })
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray()

          const response = {
            data: paper,
            message: 'Ok',
          }

          res.status(200).json(response)
        } catch (e) {
          console.error(e)
        }
      } else {
        try {
          const papers = await db
            .collection('papers')
            .find({})
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray()
          const response = {
            data: papers,
            message: 'Ok',
          }

          res.status(200).json(response)
        } catch (e) {
          console.error(e)
        }
      }
      break
    default:
      res.status(200)
  }
}
