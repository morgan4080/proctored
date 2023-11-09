import React from 'react'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import classNames from '../../utils/ClassNames'
import Navigation from '@/components/Navigation'
import { Inter, Lexend } from 'next/font/google'
import Footer from '@/components/Footer'
import { Container } from '@/components/Container'
import OrderTable from '@/components/orders/OrdersTable'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { OrderWithOwner, Transaction, User } from '@/lib/service_types'
import mongoClient from '@/lib/mongodb'
import Error from 'next/error'
import { cn, fetcher } from '@/lib/utils'
import Link from 'next/link'
import OrdersAdmin from '@/components/orders/OrdersAdmin'
import TransactionsAdmin from '@/components/transactions/TransactionsAdmin'
const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

const lexend = Lexend({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

type Tabs = 'orders' | 'transactions'

const { clientPromise } = mongoClient
export const getServerSideProps = (async (context) => {
  const tab: Tabs | null =
    context.params && context.params.link
      ? (`${context.params.link}` as Tabs)
      : null
  const client = await clientPromise
  const db = client.db('proctor')
  // const session = await getServerSession(req, res, authOptions)
  switch (tab) {
    case 'orders':
      const orders = await fetcher(process.env.NEXTAUTH_URL + '/api/orders')
      return {
        props: {
          orders: orders.data,
          transactions: [],
          tab,
        },
      }
    case 'transactions':
      const transactions = await fetcher(
        process.env.NEXTAUTH_URL + '/api/transactions',
      )
      return {
        props: {
          orders: [],
          transactions: transactions.data,
          tab,
        },
      }
    default:
      return {
        props: {
          orders: [],
          transactions: [],
          tab: null,
        },
      }
  }
}) satisfies GetServerSideProps<{
  orders: OrderWithOwner[]
  transactions: Transaction[]
  tab: Tabs | null
}>

function Me({
  orders,
  transactions,
  tab,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession()
  if (tab) {
    return (
      <div className="relative">
        <Head>
          <title>PROCTOR OWLS | Personal Profile</title>
          <meta name="description" content="Your profile" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main
          className={classNames(
            inter.className,
            'flex min-h-screen flex-col relative',
          )}
        >
          <div className="bg-bermuda/95 w-full">
            <Navigation />
          </div>

          <Container
            className="xl:px-0"
            parentClassName="pt-10 bg-white w-full"
          >
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex gap-4 items-center">
                  <span className={classNames(lexend.className)}>
                    {session ? session.user?.name : ''}
                  </span>
                </h2>
                <div className="mt-2 text-lg leading-8 text-gray-600 space-x-2">
                  User Dashboard
                </div>
              </div>
              <div className="mt-5 flex lg:ml-4 lg:mt-0">
                <span className="block">
                  <Link
                    href={'/order/create'}
                    className="inline-flex items-center rounded-md bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-black hover:text-white"
                  >
                    <svg
                      className="-ml-0.5 mr-1.5 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                      ></path>
                    </svg>
                    Order
                  </Link>
                </span>
              </div>
            </div>
          </Container>
          <Container
            className="xl:px-0"
            parentClassName="pb-32 bg-white w-full"
          >
            <div
              data-orientation="horizontal"
              role="none"
              className="shrink-0 bg-border h-[1px] w-full my-6"
            ></div>
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <aside className="px-4 -mx-4 lg:w-1/5">
                <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                  <Link
                    href={'/me/' + 'orders'}
                    className={cn(
                      'inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-muted justify-start',
                      tab == 'orders' && 'bg-muted',
                    )}
                  >
                    <svg
                      className="w-3 h-3 mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      ></path>
                    </svg>
                    <span>Orders</span>
                  </Link>
                  <Link
                    href={'/me/' + 'transactions'}
                    className={cn(
                      'inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-muted justify-start',
                      tab == 'transactions' && 'bg-muted',
                    )}
                  >
                    <svg
                      className="w-3 h-3 mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      ></path>
                    </svg>
                    <span>Transactions</span>
                  </Link>
                </nav>
              </aside>
              <div className="flex-1 lg:max-w-5xl">
                {/*  Order*/}
                <OrdersAdmin current={tab == 'orders'} orders={orders} />
                {/*  Transactions*/}
                <TransactionsAdmin
                  current={tab == 'transactions'}
                  transactions={transactions}
                />
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    )
  } else {
    return <Error statusCode={404} />
  }
}

export default Me
