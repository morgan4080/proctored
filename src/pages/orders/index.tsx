import React from 'react'
import Head from 'next/head'
import classNames from '../../../libs/utils/ClassNames'
import { Container } from '@/components/Container'
import Navigation from '@/components/Navigation'
import { Inter } from 'next/font/google'
const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})
const Orders = () => {
  return (
    <div className="relative">
      <Head>
        <title>Orders</title>
        <meta name="description" content="Proctor Owls Orders" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={classNames(
          inter.className,
          'flex min-h-screen flex-col items-center justify-between relative',
        )}
      >
        <Container className="xl:px-0" parentClassName="bg-bermuda/95 w-full">
          <section className="bg-cover bg-center w-full">
            <div className="h-full">
              <div className="pt-3">
                <Navigation />
              </div>
              <div className="mx-auto pt-16 pb-24 md:px-12 prose max-w-none">
                <span className="text-white">Orders</span>
                <h1 className="text-black break-words">
                  Orders
                  <span></span>
                </h1>
              </div>
            </div>
          </section>
        </Container>
        <Container className="xl:px-0">
          <div className="mx-auto pt-16 pb-24 md:px-12 prose max-w-none"></div>
        </Container>
      </main>
    </div>
  )
}

export default Orders
