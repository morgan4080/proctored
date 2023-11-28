import React, { useEffect } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import classNames from '../../utils/ClassNames'
import Navigation from '@/components/Navigation'
import { Inter, Lexend } from 'next/font/google'
import { Container } from '@/components/Container'
import { Service } from '@/lib/service_types'
import Footer from '@/components/Footer'
import mongoClient from '@/lib/mongodb'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'

const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

const lexend = Lexend({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

const { clientPromise } = mongoClient

export const getServerSideProps = (async ({ query }) => {
  try {
    // Pagination information
    let page = 1
    if (query) {
      const { page: currentPage } = query
      if (currentPage) {
        if (typeof currentPage === 'string') {
          page = parseInt(currentPage)
        }
      }
    }
    const pageSize = 20 // Number of items per page
    const skip = (page - 1) * pageSize

    const client = await clientPromise
    const db = client.db('proctor')
    const collection = db.collection<Service>('blogs')
    let blogs = await collection
      .find({})
      .sort({ metacritic: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray()

    const totalRecords = await collection.countDocuments()
    const totalPages = Math.ceil(totalRecords / pageSize)

    blogs = blogs.map((blog) => {
      return {
        ...blog,
        _id: blog._id.toString(),
      }
    })

    const from = (page - 1) * pageSize + 1
    const to = from + blogs.length - 1

    return {
      props: {
        pagination: { from, to, totalRecords, totalPages, currentPage: page },
        blogs: blogs,
        isConnected: true,
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: {
        pagination: {
          from: 0,
          to: 0,
          totalRecords: 0,
          totalPages: 0,
          currentPage: 0,
        },
        blogs: [],
        isConnected: false,
      },
    }
  }
}) satisfies GetServerSideProps<{
  pagination: {
    from: number
    to: number
    totalRecords: number
    totalPages: number
    currentPage: number
  }
  blogs: Service[]
  isConnected: boolean
}>
const Blogs = ({
  pagination,
  blogs,
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { toast } = useToast()

  useEffect(() => {
    if (!isConnected) {
      toast({
        title: 'Heads Up!',
        description: 'You are NOT connected to the database.',
        action: (
          <ToastAction altText="Goto schedule to undo">Clear</ToastAction>
        ),
      })
    }
  }, [isConnected, toast])

  return (
    <div className="relative">
      <Head>
        <title>Blog Listing</title>
        <meta name="description" content="View All Blogs" />
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
          parentClassName="pt-10 md:pt-20 bg-white w-full"
        >
          <div className="mx-auto">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2
                className={classNames(
                  lexend.className,
                  'text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl',
                )}
              >
                From the blog
              </h2>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                Learn about writing to grow your academic performance.
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {blogs.map((blog) => (
                <Card key={blog._id}>
                  <CardContent>
                    <article className="flex max-w-xl flex-col items-start justify-between pt-6">
                      <div className="flex items-center gap-x-4 text-xs">
                        <time dateTime="2020-03-16" className="text-gray-500">
                          {format(new Date(blog.updated), 'MMMM dd, yyyy')}
                        </time>
                      </div>
                      <div className="group relative">
                        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                          <a href="#">
                            <span className="absolute inset-0"></span>
                            {blog.title}
                          </a>
                        </h3>
                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                          {blog.excerpt}
                        </p>
                      </div>
                      <div className="relative mt-8 flex items-center gap-x-4">
                        <Link
                          href={'/blogs/' + blog.slug}
                          className="text-sm font-semibold leading-6 text-slate-800"
                        >
                          Read more <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </article>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 pt-20 pb-48">
              <div className="flex flex-1 justify-between sm:hidden">
                <Link
                  href={
                    pagination.currentPage > 1
                      ? `?page=${pagination.currentPage - 1}`
                      : `/blogs`
                  }
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </Link>
                <Link
                  href={
                    pagination.currentPage < pagination.totalPages
                      ? `?page=${pagination.currentPage + 1}`
                      : `/blogs`
                  }
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </Link>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 space-x-1">
                    <span>Showing</span>
                    <span className="font-medium">{pagination.from}</span>
                    <span>to</span>
                    <span className="font-medium">{pagination.to}</span>
                    <span>of</span>
                    <span className="font-medium">
                      {pagination.totalRecords}
                    </span>
                    <span>results</span>
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <Link
                      href={
                        pagination.currentPage > 1
                          ? `?page=${pagination.currentPage - 1}`
                          : `/blogs`
                      }
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                    {/* Generate pagination links based on totalPages */}
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, index) => {
                        const pageNumber = index + 1
                        return (
                          <a
                            key={pageNumber}
                            href={`?page=${pageNumber}`}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              pageNumber === pagination.currentPage
                                ? 'bg-teal-300 text-white'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                            } focus:z-20 focus:outline-offset-0`}
                          >
                            {pageNumber}
                          </a>
                        )
                      },
                    )}
                    <Link
                      href={
                        pagination.currentPage < pagination.totalPages
                          ? `?page=${pagination.currentPage + 1}`
                          : `/blogs`
                      }
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

export default Blogs
