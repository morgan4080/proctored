import { NextApiRequest, NextApiResponse } from 'next'
import mongoClient from '@/lib/mongodb'
import { MongoInvalidArgumentError, ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { TransactionWithOwnerAndOrder } from '@/lib/service_types'

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

  if (session && session.user) {
    switch (req.method) {
      case 'GET':
        const transactionsData = await db
          .collection('transactions')
          .aggregate<TransactionWithOwnerAndOrder>([
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
              $addFields: {
                owner: { $arrayElemAt: ['$owner', 0] },
              },
            },
          ])
          .sort({ metacritic: -1 })
          .limit(10)
          .toArray()
        const transactions = transactionsData.map((o) => {
          const {
            _id,
            userId,
            owner: { _id: ownerId, ...ownerData },
            ...transaction
          } = o
          return {
            _id: _id.toString(),
            userId: userId.toString(),
            owner: {
              _id: ownerId.toString(),
              ...ownerData,
            },
            ...transaction,
          }
        })
        res.status(200).json({
          data: transactions,
          message: 'Ok',
          status: 200,
        })
        break
      case 'PUT':
        res.status(200).json({
          data: {},
          message: 'Ok',
          status: 200,
        })
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
