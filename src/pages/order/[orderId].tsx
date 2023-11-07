import React from 'react'
import Head from 'next/head'
import classNames from '../../../libs/utils/ClassNames'
import { Container } from '@/components/Container'
import Navigation from '@/components/Navigation'
import { Inter, Lexend } from 'next/font/google'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { fetcher } from '@/lib/utils'
import { ObjectId } from 'mongodb'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import mongoClient from '../../../libs/mongodb'
import { Order } from '@/lib/service_types'
import ErrorPage from 'next/error'
const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})
const lexend = Lexend({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

const { clientPromise } = mongoClient

export const getServerSideProps = (async (context) => {
  const response = await fetcher(process.env.NEXTAUTH_URL + '/api/storedata')
  const client = await clientPromise
  const db = client.db('proctor')
  const order = await db
    .collection<Order>('orders')
    .findOne({ _id: new ObjectId(`${context.params?.orderId}`) as any })
  const od: any = order
    ? {
        ...order,
        _id: `${context.params?.orderId}`,
      }
    : null
  return {
    props: {
      storedata: JSON.parse(response),
      oId: context.params ? `${context.params.orderId}` : null,
      order: od,
      revalidate: 60,
    },
  }
}) satisfies GetServerSideProps<{
  order: Order | null
  oId: string | null
}>
const Order = ({
  order,
  oId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (order) {
    return (
      <div className="relative">
        <Head>
          <title>Order</title>
          <meta name="description" content="Proctor Owls Order" />
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
                <h2
                  className={classNames(
                    'text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex gap-4 items-center',
                  )}
                >
                  <span className={classNames(lexend.className)}>
                    Order #123
                  </span>
                  {true && (
                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                      UNPAID
                    </span>
                  )}
                  {false && (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      PAID
                    </span>
                  )}
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                  Order Amount.{' '}
                  <span className="underline font-semibold">$100,000</span>
                </p>
              </div>
              <div className="mt-5 flex lg:ml-4 lg:mt-0">
                <span className="block">
                  {/*Update if order is not paid for*/}
                  <Link
                    href={'/order/edit/' + 123}
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
                    className="inline-flex items-center rounded-md bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-black hover:text-white"
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
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      ></path>
                    </svg>
                    New Order
                  </Link>
                </span>
                <span className="ml-3 block">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-black hover:text-white"
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
                  </button>
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
                  Proctored exam
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Academic level
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  University
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Topic
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  N/A
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Subject
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  Chemistry
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Duration
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  3 Hours
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Paper format
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  N/A
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Pages
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  N/A
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Spacing
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  N/A
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Slides
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  N/A
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Sources
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  N/A
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Charts
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  N/A
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Digital copies of sources used
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  N/A
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Initial Draft
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  N/A
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  One Page Summary
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  N/A
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2 bg-slate-50">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Plagiarism Report
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  N/A
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Paper details
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  Create inclusive web apps with Next.js! Discover how it
                  enhances performance, supports internationalization, and
                  offers awesome features. Boost SEO, user experience, and brand
                  reputation by building accessible websites.
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
