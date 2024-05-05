// pages/api/order/[orderId].ts

import { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import mongoClient from '@/lib/mongodb'

const { clientPromise } = mongoClient

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { orderId } = req.query

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Validate orderId
  if (!orderId || Array.isArray(orderId)) {
    return res.status(400).json({ error: 'Invalid orderId' })
  }

  const { paymentStatus } = req.body

  // Validate paymentStatus
  if (!paymentStatus) {
    return res.status(400).json({ error: 'paymentStatus is required' })
  }

  try {
    const client = await clientPromise
    const db = client.db('proctor')
    const ordersCollection = db.collection('orders')

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { paymentStatus } },
    )

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.status(200).json({ message: 'Payment status updated successfully' })
  } catch (error) {
    console.error('Error updating payment status:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
