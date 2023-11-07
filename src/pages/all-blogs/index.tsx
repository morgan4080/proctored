import Head from 'next/head'
import classNames from '../../utils/ClassNames'
import Navigation from '@/components/Navigation'
import { Inter, Lexend } from 'next/font/google'
import { Container } from '@/components/Container'
import { EyeIcon, TrashIcon, PencilIcon } from '@heroicons/react/20/solid'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import React, { useEffect, useState } from 'react'
import {
  GetServerSideProps,
  GetStaticProps,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
} from 'next'
import { Button } from '@/components/ui/button'
import { createRecord, fetcher, updateRecord } from '@/lib/utils'
import { Service } from '@/lib/service_types'
import ServiceDialogue from '@/components/ServiceDialogue'
import { toast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster'
import useSWR from 'swr'
import { useRouter } from 'next/router'

const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})
const lexend = Lexend({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const getServerSideProps = (async (context) => {
  const { data, message } = await fetcher(
    process.env.NEXTAUTH_URL + '/api/blogs',
  )
  const blogs: Service[] = data
  return {
    props: { blgs: blogs, revalidate: 60 },
  }
}) satisfies GetServerSideProps<{
  blgs: Service[]
}>
const AllBlogs = ({
  blgs,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const [blogs, setBlogs] = useState(blgs)
  const [showDialogue, setShowDialogue] = useState(false)
  const [context, setContext] = useState('Create')
  const [defaultID, setDefaultID] = useState('')
  const [defaultTitle, setDefaultTitle] = useState('')
  const [defaultSlug, setDefaultSlug] = useState('')
  const [defaultExcerpt, setDefaultExcerpt] = useState('')
  const [defaultDescription, setDefaultDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const deleteService = (id: string) => {}
  const { data: updatedData, mutate } = useSWR('/api/blogs', fetcher, {
    initialData: blgs,
  } as any)

  useEffect(() => {
    if (updatedData !== undefined) {
      const { data, message } = updatedData
      if (data.length > 0) setBlogs(data)
    }
    return () => {
      setShowDialogue(false)
      setDefaultID('')
      setDefaultTitle('')
      setDefaultSlug('')
      setDefaultExcerpt('')
      setDefaultDescription('')
    }
  }, [updatedData])

  return (
    <div className="relative">
      <Head>
        <title>Blog Listing</title>
        <meta name="description" content="Create Blogs" />
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
          <div className="w-full relative">
            <h2
              className={classNames(
                lexend.className,
                'text-3xl font-bold tracking-tight text-gray-900 capitalise ',
              )}
            >
              Blogs
            </h2>
            <button
              onClick={() => {
                setContext('Create')
                setDefaultID('')
                setDefaultTitle('')
                setDefaultSlug('')
                setDefaultExcerpt('')
                setDefaultDescription('')
                setShowDialogue(!showDialogue)
              }}
              type="button"
              className="absolute top-6 right-0 inline-flex justify-center rounded-full text-sm font-semibold p-2 px-3 bg-slate-900 text-white hover:bg-slate-700"
            >
              <span className="flex items-center text-xs">
                Add{' '}
                <span className="ml-1" aria-hidden="true">
                  <svg
                    className="h-2.5 w-2.5"
                    fill="currentColor"
                    stroke="none"
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </span>
            </button>
            <p className="text-sm text-slate-500 hover:text-slate-600">
              View add and edit blogs.
            </p>
          </div>
        </Container>

        <Container
          className="xl:px-0"
          parentClassName="pt-10 md:pt-20 bg-white w-full min-h-screen"
        >
          <Table>
            {blogs.length < 1 && (
              <TableCaption className="">A list of your blogs.</TableCaption>
            )}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Excerpt</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>{blog.slug}</TableCell>
                  <TableCell>{blog.excerpt}</TableCell>
                  <TableCell className="text-right flex gap-2">
                    <Button
                      onClick={() => {
                        router.push('/blogs/' + blog.slug)
                      }}
                      type="button"
                      className="px-3 py-1"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        setContext('Edit')
                        setDefaultID(blog._id)
                        setDefaultTitle(blog.title)
                        setDefaultSlug(blog.slug)
                        setDefaultExcerpt(blog.excerpt)
                        setDefaultDescription(blog.description)
                        setShowDialogue(!showDialogue)
                      }}
                      type="button"
                      className="px-3 py-1"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: 'Delete: ' + blog.title,
                          description: 'Would you like to delete this content?',
                          action: (
                            <ToastAction
                              onClick={() => {
                                deleteService(blog._id)
                              }}
                              altText="Delete Blog"
                            >
                              Delete
                            </ToastAction>
                          ),
                        })
                      }}
                      type="button"
                      className="px-3 py-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
      </main>
      <Footer />
      <Toaster />
      {showDialogue ? (
        <ServiceDialogue
          submitForm={(values) => {
            return new Promise((resolve, reject) => {
              if (values) {
                if (context == 'Create') {
                  // POST
                  setLoading(true)
                  createRecord(
                    {
                      ...values,
                    },
                    '/api/blogs',
                  )
                    .then((response) => {
                      console.log('SERVICES', response)
                      toast({
                        description: 'The blog was created successfully.',
                      })
                      return mutate()
                    })
                    .then((result) => {
                      setLoading(false)
                    })
                    .catch((error) => {
                      console.log(error)
                    })
                } else {
                  // PUT
                  setLoading(true)
                  updateRecord(
                    {
                      _id: defaultID,
                      ...values,
                    },
                    '/api/blogs',
                  )
                    .then((response) => {
                      console.log('SERVICES', response)
                      toast({
                        description: 'The blog was updated successfully.',
                      })
                      return mutate()
                    })
                    .then(() => {
                      setLoading(false)
                    })
                    .catch((error) => {
                      console.log(error)
                    })
                }
              } else {
                reject('Message to form')
              }
            })
          }}
          title={context + ' Blog'}
          description="Create/ Edit your blog here. Click save when you're done."
          defaultTitle={defaultTitle}
          defaultSlug={defaultSlug}
          defaultExcerpt={defaultExcerpt}
          defaultDescription={defaultDescription}
        />
      ) : (
        <></>
      )}
    </div>
  )
}

export default AllBlogs
