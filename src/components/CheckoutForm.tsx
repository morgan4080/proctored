import {
  useStripe,
  useElements,
  PaymentElement,
  PaymentElementProps,
} from '@stripe/react-stripe-js'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UsdConverter } from '@/utils/UsdConverter'
import { number } from 'zod'

interface CheckoutFormProps {
  amount: number
  orderId: string | null
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, orderId }) => {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()

  console.log('ORDER ID:', orderId)
  console.log('AMOUNT:', amount)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!stripe || !elements) return

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: 'if_required',
    })
    if (result) {
      try {
        const response = await fetch(`/api/paymentstatus/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentStatus: 'confirmed' }),
        })
        if (response.ok) {
          console.log('Payment successful and status updated!')
          console.log(response)
          router.push(`/success?orderId=${orderId}&amount=${amount}`)
        } else {
          console.error('Error updating payment status:', await response.json())
        }
      } catch (error) {
        console.error('Payment status updating error:', error)
      }
    }
    if (result.error) {
      console.log('PAYMENT ERROR:', result.error)
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>
          Add a new payment method to your account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-6">
          <PaymentElement />
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={!stripe}>
            Pay Now ${UsdConverter(Number(amount))}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default CheckoutForm
