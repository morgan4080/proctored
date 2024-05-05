import Stripe from 'stripe'
import { NextApiRequest, NextApiResponse } from 'next'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { paymentMethodId, amount } = req.body

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        return_url: `${req.headers.origin}/success`, // Add this line
      })

      if (paymentIntent.status === 'succeeded') {
        // Payment is successful, handle the successful payment here
        console.log('Payment successful!')
        res.status(200).json({ message: 'Payment successful!' })
      } else {
        // Payment failed, handle the failed payment here
        console.log('Payment failed')
        res.status(400).json({ message: 'Payment failed' })
      }
    } catch (err: unknown | any) {
      console.error(err)
      res.status(500).json({ statusCode: 500, message: err.message })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
