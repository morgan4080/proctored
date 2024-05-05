import Stripe from 'stripe'
import { NextApiRequest, NextApiResponse } from 'next'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { amount } = req.body

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
      })

      res.status(200).json({ clientSecret: paymentIntent.client_secret })
    } catch (err: unknown | any) {
      console.error(err)
      res.status(500).json({ statusCode: 500, message: err.message })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
