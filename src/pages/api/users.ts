import { NextApiRequest, NextApiResponse } from 'next'
import mongoClient from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { ObjectId } from 'mongodb'

const { clientPromise } = mongoClient

type ResponseData = {
  data: Record<any, any>
  message: string
  status: number
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const client = await clientPromise
  const db = client.db('proctor')
  const session = await getServerSession(req, res, authOptions)

  if (session && session.user && session.user.userRole == 'superuser') {
    switch (req.method) {
      case 'GET':
        res.status(200).json({
          data: {},
          message: 'Ok',
          status: 200,
        })
        break
      case 'PUT':
        const orders_collection = db.collection('users')
        const { _id, ...orderObject } = req.body
        const response = {
          data: await orders_collection.updateOne(
            { _id: new ObjectId(req.body._id) },
            { $set: orderObject },
          ),
          message: 'User updated Successfully',
          status: 200,
        }
        res.status(200).json(response)
        break
      case 'POST':
        res.status(200).json({
          data: {},
          message: 'Ok',
          status: 200,
        })
        break
      case 'DELETE':
        res.status(200).json({
          data: {},
          message: 'Ok',
          status: 200,
        })
        break
    }
  } else {
    res.status(403).json({
      data: {},
      message: 'Access Denied',
      status: 403,
    })
  }
}
