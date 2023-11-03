// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { promises as fs } from 'fs'
import clientPromise from '../../../libs/mongodb'
import { MongoInvalidArgumentError, ObjectId } from 'mongodb'

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
        const { _id, title, slug, excerpt, description } = req.body
        const service = {
          _id: _id,
          title: title,
          slug: slug,
          excerpt: excerpt,
          description: description,
        }
        const services_collection = db.collection('services')
        const ddd = await services_collection.updateOne(
          { _id: new ObjectId(_id) },
          { $set: { description: description } },
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
        const { title, slug, excerpt, description } = req.body
        const service = {
          title: title,
          slug: slug,
          excerpt: excerpt,
          description: description,
        }
        const services_collection = db.collection('services')
        await services_collection.insertOne(service)
        const response = {
          data: service,
          message: 'Service Created Successfully',
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
