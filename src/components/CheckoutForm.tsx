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

interface CheckoutFormProps {
  amount: number
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount }) => {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!stripe || !elements) return

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    })

    if (error) {
      console.log('[error]', error)
    } else {
      router.push('/success')
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
            Pay Now ${amount / 100}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default CheckoutForm
