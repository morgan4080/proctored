import React from 'react'
import { CheckCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { UsdConverter } from '@/utils/UsdConverter'

const Success = () => {
  const router = useRouter()
  const { orderId, amount } = router.query
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
        <div className="flex items-center justify-center mb-6">
          <CheckCircledIcon className="text-green-500 h-20 w-20" />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center">
          Payment Successful
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Your payment has been processed successfully.
        </p>
        <div className="bg-gray-500 text-white rounded-lg p-4 text-center mb-6">
          <p className="font-semibold">Order ID: {orderId}</p>
          <p className="font-bold">Amount: ${UsdConverter(Number(amount))}</p>
        </div>
        <div className="flex justify-center">
          <Link href="/me/orders">
            <button className="bg-green-600 hover:bg-gray-500 text-white font-semibold py-2 px-10 rounded-full">
              OK
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Success
