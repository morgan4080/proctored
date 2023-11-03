import Head from 'next/head'
import classNames from '../../../libs/utils/ClassNames'
import Navigation from '@/components/Navigation'
import { Inter, Lexend } from 'next/font/google'
import { Container } from '@/components/Container'
import { TrashIcon, PencilIcon } from '@heroicons/react/20/solid'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import React, { useState } from 'react'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Button } from '@/components/ui/button'
import { fetcher } from '@/lib/utils'
import { Service } from '@/lib/service_types'
import ServiceDialogue from '@/components/ServiceDialogue'
import { toast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})
const lexend = Lexend({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const getStaticProps = (async (context) => {
  const { data, message } = await fetcher(
    process.env.NEXTAUTH_URL + '/api/services',
  )
  const services: Service[] = data
  return {
    props: { svs: services, revalidate: 60 },
  }
}) satisfies GetStaticProps<{
  svs: Service[]
}>
const AllServices = ({
  svs,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [services, setServices] = useState(svs)
  const [showDialogue, setShowDialogue] = useState(false)
  const [context, setContext] = useState('Create')
  const [defaultTitle, setDefaultTitle] = useState('')
  const [defaultSlug, setDefaultSlug] = useState('')
  const [defaultExcerpt, setDefaultExcerpt] = useState('')
  const [defaultDescription, setDefaultDescription] = useState('')
  const deleteService = (id: string) => {}
  return (
    <div className="relative">
      <Head>
        <title>Service Listing</title>
        <meta name="description" content="Create Services" />
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
              Services
            </h2>
            <button
              onClick={() => {
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
              View add and edit services.
            </p>
          </div>
        </Container>

        <Container
          className="xl:px-0"
          parentClassName="pt-10 md:pt-20 bg-white w-full min-h-screen"
        >
          <Table>
            {services.length < 1 && (
              <TableCaption className="">A list of your services.</TableCaption>
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
              {services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell>{service.slug}</TableCell>
                  <TableCell>{service.excerpt}</TableCell>
                  <TableCell className="text-right flex gap-2">
                    <Button
                      onClick={() => {
                        setContext('Edit')
                        setDefaultTitle(service.title)
                        setDefaultSlug(service.slug)
                        setDefaultExcerpt(service.excerpt)
                        setDefaultDescription(service.excerpt)
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
                          title: 'Delete: ' + service.title,
                          description: 'Would you like to delete this content?',
                          action: (
                            <ToastAction
                              onClick={() => {
                                deleteService(service._id)
                              }}
                              altText="Delete Service"
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
          submitForm={() => {}}
          title={context + ' Service'}
          description="Create/ Edite your service here. Click save when you're done."
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

export default AllServices
