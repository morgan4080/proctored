import { NextApiRequest, NextApiResponse } from 'next'
import mongoClient from '@/lib/mongodb'
import { MongoInvalidArgumentError, ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import nodemailer from 'nodemailer'
import { OrderWithOwnerAndTransactionAndWriter } from '@/lib/service_types'

const { clientPromise } = mongoClient

type ResponseData = {
  data: Record<any, any>
  message: string
  status: number
}

// Create a transporter with Google SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use the Gmail service
  auth: {
    user: process.env.GMAIL_USERNAME, // Your Gmail address
    pass: process.env.GMAIL_PASS, // Your Gmail password or an app-specific password
  },
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const client = await clientPromise
  const db = client.db('proctor')
  const session = await getServerSession(req, res, authOptions)
  if (session && session.user) {
    switch (req.method) {
      case 'PUT':
        try {
          const orders_collection = db.collection('orders')
          const {
            _id,
            userId,
            writerId,
            transactionId,
            serviceCategoryId,
            ...orderObject
          } = req.body
          let data = { ...orderObject, userId: new ObjectId(userId) }
          if (req.body.writerId) {
            data = {
              ...data,
              writerId: new ObjectId(writerId),
            }
          }
          if (req.body.transactionId) {
            data = {
              ...data,
              transactionId: new ObjectId(transactionId),
            }
          }
          if (req.body.serviceCategoryId) {
            data = {
              ...data,
              serviceCategoryId: new ObjectId(serviceCategoryId),
            }
          }
          const { acknowledged, ...rest } = await orders_collection.updateOne(
            { _id: new ObjectId(req.body._id) },
            { $set: data },
          )

          if (acknowledged) {
            const mailOptions = {
              from: 'proctorowls@gmail.com',
              to: session.user.email,
              subject: 'UPDATED ORDER ID:' + req.body._id,
              text: JSON.stringify(req.body),
            }
            const info = await transporter.sendMail(mailOptions)
            const response = {
              data: { ...rest, ...info },
              message: 'Order updated Successfully',
              status: 200,
            }
            res.status(200).json(response)
          } else {
            res.status(500).json({
              data: {},
              message: 'Failed to edit order',
              status: 500,
            })
          }
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
            await services_collection.insertOne({
              ...req.body,
              userId: new ObjectId(session.user._id),
              serviceCategoryId: new ObjectId(req.body.serviceCategoryId),
            })
          if (acknowledged) {
            const mailOptions = {
              from: 'murungi.mutugi@gmail.com',
              to: session.user.email,
              subject: 'ORDER ID:' + insertedId.toString(),
              text: 'TEST.' + JSON.stringify(req.body),
            }
            const info = await transporter.sendMail(mailOptions)
            const response = {
              data: {
                _id: insertedId.toString(),
                userId: session.user._id,
                ...req.body,
                ...info,
              },
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
        const ordersData = await db
          .collection('orders')
          .aggregate<OrderWithOwnerAndTransactionAndWriter>([
            {
              $match: {
                userId: new ObjectId(session.user._id),
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'owner',
              },
            },
            {
              $lookup: {
                from: 'transactions',
                localField: 'transactionId',
                foreignField: '_id',
                as: 'transaction',
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'writerId',
                foreignField: '_id',
                as: 'writer',
              },
            },
            {
              $addFields: {
                owner: { $arrayElemAt: ['$owner', 0] },
                transaction: { $arrayElemAt: ['$transaction', 0] },
                writer: { $arrayElemAt: ['$writer', 0] },
              },
            },
          ])
          .sort({ metacritic: -1 })
          .limit(10)
          .toArray()
        const orders = ordersData.map((o) => {
          const {
            _id,
            userId,
            owner: { _id: ownerId, ...ownerData },
            ...order
          } = o
          return {
            _id: _id.toString(),
            userId: userId.toString(),
            owner: {
              _id: ownerId.toString(),
              ...ownerData,
            },
            ...order,
          }
        })
        res.status(200).json({
          data: orders,
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
