'use client'
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import {createRecord} from "@/lib/utils";

function PaymentMethod({amount, user_id}: {amount: string, user_id: string}) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>
          Add a new payment method to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
          <PayPalButtons
              style={{
                  color: 'gold',
                  shape: 'rect',
                  label: 'pay',
                  height: 50
              }}
              createOrder={async (data, actions) => {
                  let order_id = await paypalCreateOrder(user_id, amount)
                  return order_id + ''
              }}
              onApprove={async (data, actions): Promise<void> => {
                  let response: any = await paypalCaptureOrder(data.orderID)
                  console.log(response)
              }}
          />
      </CardContent>
    </Card>
  )
}

const paypalCreateOrder = async (user_id: string, order_price: string) => {
  try {
    let response = await createRecord({
      user_id: user_id,
      order_price: order_price
    }, '/api/paypal/createorder')
    return response.data.data.order.order_id
  } catch (err) {
    // Your custom code to show an error like showing a toast:
    // toast.error('Some Error Occured')
    return null
  }
}

const paypalCaptureOrder = async (orderID: string) => {
  try {
      let response = await createRecord({
        orderID
      }, '/api/paypal/captureorder')
      if (response.data.success) {
        // Order is successful
        // Your custom code

        // Like showing a success toast:
        // toast.success('Amount Added to Wallet')

        // And/Or Adding Balance to Redux Wallet
        // dispatch(setWalletBalance({ balance: response.data.data.wallet.balance }))
      }
    } catch (err) {
      // Order is not successful
      // Your custom code

      // Like showing an error toast
      // toast.error('Some Error Occured')
      console.log(err)
    }
  }

export default PaymentMethod
