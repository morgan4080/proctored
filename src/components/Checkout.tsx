import { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { StripeElementsOptions } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'
import stripePromise from '../lib/stripe'

interface CheckoutProps {
  amount: number
  orderId: string | null
}
const Checkout: React.FC<CheckoutProps> = ({ amount, orderId }) => {
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    const fetchClientSecret = async () => {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      })

      const { clientSecret } = await response.json()
      setClientSecret(clientSecret)
    }

    fetchClientSecret()
  }, [amount])

  const appearance: StripeElementsOptions['appearance'] = {
    theme: 'stripe',
  }
  const options = {
    clientSecret,
    appearance,
  }

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm amount={amount} orderId={orderId} />
        </Elements>
      )}
    </div>
  )
}

export default Checkout
