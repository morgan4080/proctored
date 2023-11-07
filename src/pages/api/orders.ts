import { NextApiRequest, NextApiResponse } from 'next'
import mongoClient from '../../../libs/mongodb'
import { MongoInvalidArgumentError, ObjectId } from 'mongodb'

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

  switch (req.method) {
    case 'PUT':
      try {
        const orders_collection = db.collection('orders')
        const { _id, ...orderObject } = req.body
        const ddd = await orders_collection.updateOne(
          { _id: new ObjectId(req.body._id) },
          { $set: orderObject },
        )
        const response = {
          data: ddd,
          message: 'Order updated Successfully',
          status: 200,
        }
        res.status(200).json(response)
      } catch (e: MongoInvalidArgumentError | any) {
        console.error(e)
        res.status(400).json({
          data: {},
          message: e.message,
          status: 400,
        })
      }
      break
    case 'POST':
      try {
        const services_collection = db.collection('orders')
        const { acknowledged, insertedId } =
          await services_collection.insertOne(req.body)
        if (acknowledged) {
          const response = {
            data: { _id: insertedId.toString(), ...req.body },
            message: 'Order created Successfully',
            status: 200,
          }
          res.status(200).json(response)
        } else {
          res.status(500).json({
            data: {},
            message: 'Failed to create order',
            status: 500,
          })
        }
      } catch (e: any) {
        res.status(500).json({
          data: {},
          message: e.message,
          status: 500,
        })
      }
      break
    case 'GET':
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
}