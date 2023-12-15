import React from 'react'
import Head from 'next/head'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
const Container = dynamic(() => import('@/components/Container'), {
  ssr: true,
})
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  OrderWithOwnerAndTransactionAndWriter,
  TransactionWithOwnerAndOrder,
  User,
} from '@/lib/service_types'
import mongoClient from '@/lib/mongodb'
import Error from 'next/error'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import OrdersAdmin from '@/components/orders/OrdersAdmin'
import TransactionsAdmin from '@/components/transactions/TransactionsAdmin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { ObjectId } from 'mongodb'
import dynamic from 'next/dynamic'

type Tabs = 'orders' | 'transactions'

const { clientPromise } = mongoClient
export const getServerSideProps = (async ({ params, res, req }) => {
  const tab: Tabs | null =
    params && params.link ? (`${params.link}` as Tabs) : null
  const client = await clientPromise
  const db = client.db('proctor')
  const session = await getServerSession(req, res, authOptions)
  if (session && session.user) {
    switch (tab) {
      case 'orders':
        const ordersData = await db
          .collection('orders')
          .aggregate<OrderWithOwnerAndTransactionAndWriter>([
            {
              $match: {
                userId: new ObjectId(session.user._id),
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'owner',
              },
            },
            {
              $lookup: {
                from: 'transactions',
                localField: 'transactionId',
                foreignField: '_id',
                as: 'transaction',
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'writerId',
                foreignField: '_id',
                as: 'writer',
              },
            },
            {
              $lookup: {
                from: 'services_category',
                localField: 'serviceCategoryId',
                foreignField: '_id',
                pipeline: [
                  {
                    $lookup: {
                      from: 'services_sub_category',
                      localField: 'subcategories',
                      foreignField: '_id',
                      as: 'subcategories',
                    },
                  },
                ],
                as: 'serviceCategory',
              },
            },
            {
              $addFields: {
                owner: { $arrayElemAt: ['$owner', 0] },
                transaction: { $arrayElemAt: ['$transaction', 0] },
                writer: { $arrayElemAt: ['$writer', 0] },
                serviceCategory: { $arrayElemAt: ['$serviceCategory', 0] },
              },
            },
          ])
          .sort({ metacritic: -1 })
          .limit(1000)
          .toArray()
        const orders = ordersData.map((o) => {
          const {
            _id,
            userId,
            owner: { _id: ownerId, ...ownerData },
            serviceCategory: {
              _id: serviceCategoryId,
              title,
              slug,
              products,
              description,
              subcategories,
            },
            ...order
          } = o
          return {
            _id: _id.toString(),
            userId: userId.toString(),
            owner: {
              _id: ownerId.toString(),
              ...ownerData,
            },
            serviceCategory: {
              _id: serviceCategoryId.toString(),
              title,
              slug,
              description,
              products,
              subcategories: subcategories.map((sc) => {
                const { _id, ...other } = sc
                return {
                  _id: _id.toString(),
                  ...other,
                }
              }),
            },
            ...order,
            serviceCategoryId: serviceCategoryId.toString(),
          }
        })
        return {
          props: {
            user: session.user,
            orders: orders,
            transactions: [],
            tab,
          },
        }
      case 'transactions':
        const transactionsData = await db
          .collection('transactions')
          .aggregate<TransactionWithOwnerAndOrder>([
            {
              $match: {
                userId: new ObjectId(session.user._id),
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'owner',
              },
            },
            {
              $lookup: {
                from: 'orders',
                localField: 'OrderId',
                foreignField: '_id',
                as: 'order',
              },
            },
            {
              $addFields: {
                owner: { $arrayElemAt: ['$owner', 0] },
                order: { $arrayElemAt: ['$order', 0] },
              },
            },
          ])
          .sort({ metacritic: -1 })
          .limit(10)
          .toArray()
        const transactions = transactionsData.map((o) => {
          const {
            _id,
            userId,
            owner: { _id: ownerId, ...ownerData },
            ...transaction
          } = o
          return {
            _id: _id.toString(),
            userId: userId.toString(),
            owner: {
              _id: ownerId.toString(),
              ...ownerData,
            },
            ...transaction,
          }
        })
        return {
          props: {
            user: session.user,
            orders: [],
            transactions: transactions,
            tab,
          },
        }
      default:
        return {
          props: {
            user: session.user,
            orders: [],
            transactions: [],
            tab: null,
          },
        }
    }
  } else {
    return {
      props: {
        user: null,
        orders: [],
        transactions: [],
        tab: null,
      },
    }
  }
}) satisfies GetServerSideProps<{
  user: User | null
  orders: OrderWithOwnerAndTransactionAndWriter[]
  transactions: TransactionWithOwnerAndOrder[]
  tab: Tabs | null
}>

function me({
  user,
  orders,
  transactions,
  tab,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (tab && user) {
    return (
      <div className="relative">
        <Head>
          <title>PROCTOR OWLS | Personal Profile</title>
          <meta name="description" content="Your profile" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main
          className={cn("font-serif", 'flex min-h-screen flex-col relative')}
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
                  <span className={cn("font-sans")}>{user.name}</span>
                </h2>
                <div className="mt-2 text-lg leading-8 text-gray-600 space-x-2">
                  User Dashboard
                </div>
              </div>
              <div className="mt-5 flex lg:ml-4 lg:mt-0">
                <span className="block">
                  <Link
                    href={'/order/create'}
                    className="inline-flex items-center rounded-full bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-black hover:text-white"
                  >
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
                    href={'/me/orders'}
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
                    href={'/me/transactions'}
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

export default me
