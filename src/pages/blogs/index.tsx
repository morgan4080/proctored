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

export const getServerSideProps = (async () => {
  try {
    const client = await clientPromise
    const db = client.db('proctor')
    let blogs = await db
      .collection<Service>('blogs')
      .find({})
      .sort({ metacritic: -1 })
      .limit(10)
      .toArray()
    blogs = blogs.map((blog) => {
      return {
        ...blog,
        _id: blog._id.toString(),
      }
    })
    return {
      props: { blogs: blogs, isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { blogs: [], isConnected: false },
    }
  }
}) satisfies GetServerSideProps<{
  blogs: Service[]
  isConnected: boolean
}>
const Blogs = ({
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
          </div>
        </Container>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

export default Blogs
