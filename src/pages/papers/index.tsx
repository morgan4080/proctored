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
    let papers = await db
      .collection<Service>('papers')
      .find({})
      .sort({ metacritic: -1 })
      .limit(10)
      .toArray()
    papers = papers.map((paper) => {
      return {
        ...paper,
        _id: paper._id.toString(),
      }
    })
    return {
      props: { papers: papers, isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { papers: [], isConnected: false },
    }
  }
}) satisfies GetServerSideProps<{
  papers: Service[]
  isConnected: boolean
}>
const Papers = ({
  papers,
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
        <title>Paper Listing</title>
        <meta name="description" content="View All Papers" />
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
                From the papers
              </h2>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                Have a look at some of the works we have done.
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3 pb-48">
              {papers.map((paper) => (
                <Card key={paper._id}>
                  <CardContent>
                    <article className="flex max-w-xl flex-col items-start justify-between pt-6">
                      <div className="flex items-center gap-x-4 text-xs">
                        <time dateTime="2020-03-16" className="text-gray-500">
                          {format(new Date(paper.updated), 'MMMM dd, yyyy')}
                        </time>
                      </div>
                      <div className="group relative">
                        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                          <a href="#">
                            <span className="absolute inset-0"></span>
                            {paper.title}
                          </a>
                        </h3>
                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                          {paper.excerpt}
                        </p>
                      </div>
                      <div className="relative mt-8 flex items-center gap-x-4">
                        <Link
                          href={'/papers/' + paper.slug}
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

export default Papers
