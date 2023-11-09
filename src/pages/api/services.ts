// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoInvalidArgumentError, ObjectId } from 'mongodb'
import mongoClient from '@/lib/mongodb'

const { clientPromise } = mongoClient

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
        const services_collection = db.collection('services')
        const ddd = await services_collection.updateOne(
          { _id: new ObjectId(_id) },
          { $set: { title, slug, excerpt, description, updated } },
        )

        const response = {
          data: ddd,
          message: 'Service Updated Successfully',
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
        const services_collection = db.collection('services')
        const { acknowledged, insertedId } =
          await services_collection.insertOne({
            title,
            slug,
            excerpt,
            description,
            updated,
          })
        if (acknowledged) {
          const response = {
            data: {
              _id: insertedId.toString(),
              ...req.body,
            },
            message: 'Service Created Successfully',
          }
          res.status(200).json(response)
        } else {
          res.status(500).json({
            data: {},
            message: 'Failed to create service',
          })
        }
      } catch (e) {
        console.error(e)
      }
      break
    case 'GET':
      const { slug, links } = req.query
      if (links) {
        try {
          const projection = { slug: 1, title: 1 }
          const service = await db
            .collection('services')
            .find({})
            .project(projection)
            .toArray()

          const response = {
            data: service,
            message: 'Ok',
          }

          res.status(200).json(response)
        } catch (e) {
          console.error(e)
        }
      } else if (slug) {
        try {
          const service = await db
            .collection('services')
            .find({ slug: slug })
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray()

          const response = {
            data: service,
            message: 'Ok',
          }

          res.status(200).json(response)
        } catch (e) {
          console.error(e)
        }
      } else {
        try {
          const services = await db
            .collection('services')
            .find({})
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray()
          const response = {
            data: services,
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
