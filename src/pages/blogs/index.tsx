import Head from 'next/head'
import classNames from '../../../libs/utils/ClassNames'
import Navigation from '@/components/Navigation'
import { Inter, Lexend } from 'next/font/google'
import { Container } from '@/components/Container'
import React from 'react'
import { GetStaticProps, InferGetServerSidePropsType } from 'next'
import { fetcher } from '@/lib/utils'
import { Service } from '@/lib/service_types'
import Footer from '@/components/Footer'
import Link from 'next/link'

const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})
const lexend = Lexend({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const getServerSideProps = (async () => {
  const { data, message } = await fetcher(
    process.env.NEXTAUTH_URL + '/api/blogs',
  )
  const blogs: Service[] = data
  return {
    props: { blgs: blogs, revalidate: 60 },
  }
}) satisfies GetStaticProps<{
  blgs: Service[]
}>
const Blogs = ({
  blgs,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
              {blgs.map((blog) => (
                <article
                  key={blog._id}
                  className="flex max-w-xl flex-col items-start justify-between"
                >
                  <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime="2020-03-16" className="text-gray-500">
                      Mar 16, 2020
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
              ))}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}

export default Blogs
