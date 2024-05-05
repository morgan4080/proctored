import React from 'react'

const Success = () => {
  return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-md">
        <h1 className="text-4xl text-green-500 font-bold mb-4">Payment Done</h1>
        <p className="text-lg text-gray-700">Your payment was successful!</p>
      </div>
    </div>
  )
}

export default Success
