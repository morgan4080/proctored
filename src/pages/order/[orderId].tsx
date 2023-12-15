import React from 'react'
import Head from 'next/head'
import classNames from '../../utils/ClassNames'
const Container = dynamic(() => import('@/components/Container'), {
  ssr: true,
})
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { calculateOrderPrice, fetcher, formatMoney } from '@/lib/utils'
import { ObjectId } from 'mongodb'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import mongoClient from '@/lib/mongodb'
import {
  OrderWithOwnerAndTransactionAndWriter,
  StoreDataType,
} from '@/lib/service_types'
import ErrorPage from 'next/error'
import { format } from 'date-fns'
import dynamic from 'next/dynamic'

const { clientPromise } = mongoClient

export const getServerSideProps = (async ({ params }) => {
  const response = await fetcher(process.env.NEXTAUTH_URL + '/api/storedata')
  if (params) {
    const client = await clientPromise
    const db = client.db('proctor')
    const ordersData = await db
      .collection('orders')
      .aggregate<OrderWithOwnerAndTransactionAndWriter>([
        {
          $match: {
            _id: new ObjectId(`${params.orderId}`),
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
      .limit(1)
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
        storedata: JSON.parse(response) as StoreDataType[],
        order: orders.length > 0 ? orders[0] : null,
      },
    }
  } else {
    return {
      props: {
        storedata: JSON.parse(response) as StoreDataType[],
        order: null,
      },
    }
  }
}) satisfies GetServerSideProps<{
  storedata: StoreDataType[] | null
  order: OrderWithOwnerAndTransactionAndWriter | null
}>
const Order = ({
  storedata,
  order,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (order) {
    console.log(order)
    return (
      <div className="relative">
        <Head>
          <title>Order Details</title>
          <meta name="description" content="Proctor Owls Order" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main
          className={classNames(
            "font-serif",
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
                <h2
                  className={classNames(
                    'text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl',
                  )}
                >
                  <span className={classNames("font-sans")}>
                    Order Details
                  </span>
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-600 flex gap-4 items-center">
                  Order Amount
                  <span className="font-semibold">
                    $ {formatMoney(order.totalPrice)}
                  </span>
                  {!order.transaction && (
                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                      UNPAID
                    </span>
                  )}
                  {order.transaction && (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      PAID
                    </span>
                  )}
                </p>
              </div>
              <div className="mt-5 flex lg:ml-4 lg:mt-0">
                <span className="block">
                  {/*Update if order is not paid for*/}
                  <Link
                    href={'/order/edit/' + order._id}
                    className="inline-flex items-center rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <svg
                      className="-ml-0.5 mr-1.5 h-3 w-3 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                    </svg>
                    Edit
                  </Link>
                </span>
                <span className="ml-3 block">
                  {/*Update if order is not paid for*/}
                  <Link
                    href="/order/create"
                    className="inline-flex items-center rounded-full bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-black hover:text-white"
                  >
                    <svg
                      className="-ml-0.5 mr-1.5 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m6-6H6"
                      ></path>
                    </svg>
                    New Order
                  </Link>
                </span>
                <span className="ml-3 block">
                  <Link
                    href={'/order/edit/' + order._id}
                    className="inline-flex items-center rounded-full bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-black hover:text-white"
                  >
                    <svg
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      ></path>
                    </svg>
                    Pay
                  </Link>
                </span>
              </div>
            </div>
          </Container>
          <Container
            className="xl:px-0"
            parentClassName="pt-10 pb-32 bg-white w-full"
          >
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Service
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {order.service}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Academic level
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {order.academic_level}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Topic
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {order.topic}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Subject
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {order.subject_discipline}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Dates
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {format(
                    new Date(order.duration.from),
                    'MMMM dd, yyyy h:mm:ss aa',
                  )}
                  <span className="px-3">-</span>
                  {format(
                    new Date(order.duration.to),
                    'MMMM dd, yyyy h:mm:ss aa',
                  )}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Paper format
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {order.paper_format}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Pages
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {order.pages}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Spacing
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {order.spacing}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Slides
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {order.slides}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Sources
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {order.sources}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Charts
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {order.charts}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Digital copies of sources used
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {`${order.digital_copies}`}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Initial Draft
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {`${order.initial_draft}`}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  One Page Summary
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {`${order.one_page_summary}`}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Plagiarism Report
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {`${order.plagiarism_report}`}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Paper details
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {order.details}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Attachments
                </dt>
                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul
                    role="list"
                    className="divide-y divide-gray-100 rounded-md border border-gray-200"
                  >
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">
                            resume_back_end_developer.pdf
                          </span>
                          <span className="flex-shrink-0 text-gray-400">
                            2.4mb
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href="#"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">
                            coverletter_back_end_developer.pdf
                          </span>
                          <span className="flex-shrink-0 text-gray-400">
                            4.5mb
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href="#"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </Container>
        </main>
        <Footer />
      </div>
    )
  } else {
    return <ErrorPage statusCode={404} />
  }
}

export default Order
