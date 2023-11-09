import React, { useEffect } from 'react'
import { cn, createRecord, fetcher, updateRecord } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Service } from '@/lib/service_types'
import ServicesTable from '@/components/services/ServicesTable'
import ServiceDialogue from '@/components/services/ServiceDialogue'
import { toast } from '@/components/ui/use-toast'
import useSWR from 'swr'
import { Toaster } from '@/components/ui/toaster'

const ServicesAdmin = ({
  current,
  services,
}: {
  current: boolean
  services: Service[]
}) => {
  const [context, setContext] = React.useState('Create')
  const [defaultID, setDefaultID] = React.useState('')
  const [defaultTitle, setDefaultTitle] = React.useState('')
  const [defaultSlug, setDefaultSlug] = React.useState('')
  const [defaultExcerpt, setDefaultExcerpt] = React.useState('')
  const [defaultDescription, setDefaultDescription] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [showDialogue, setShowDialogue] = React.useState(false)

  const { data: updatedData, mutate } = useSWR('/api/services', fetcher, {
    initialData: services,
  } as any)

  const [updatedServices, setUpdatedServices] = React.useState(services)

  useEffect(() => {
    if (updatedData !== undefined) {
      const { data, message } = updatedData
      if (data.length > 0) setUpdatedServices(data)
    }
    return () => {
      setLoading(false)
    }
  }, [updatedData])

  return (
    <div>
      <div className={cn('space-y-6 hidden', current && 'block')}>
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg text-slate-800 font-medium">All Services</h3>
            <p className="text-sm text-muted-foreground">
              View, edit and delete services.
            </p>
          </div>
          <div>
            <span className="block">
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
                className="inline-flex justify-center rounded-full text-sm font-semibold p-2 px-3 bg-slate-900 text-white hover:bg-slate-700"
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
            </span>
          </div>
        </div>
        <Separator />
        <ServicesTable
          services={updatedServices}
          setContext={setContext}
          setDefaultDescription={setDefaultDescription}
          setDefaultExcerpt={setDefaultExcerpt}
          setDefaultID={setDefaultID}
          setDefaultSlug={setDefaultSlug}
          setDefaultTitle={setDefaultTitle}
          setShowDialogue={setShowDialogue}
        />
      </div>
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
                      updated: new Date(),
                    },
                    '/api/services',
                  )
                    .then((response) => {
                      toast({
                        description: 'The service was created successfully.',
                      })
                      return mutate()
                    })
                    .then((result) => {
                      setLoading(false)
                    })
                    .catch((error) => {
                      console.log(error)
                    })
                    .finally(() => {
                      setShowDialogue(false)
                    })
                } else {
                  // PUT
                  setLoading(true)
                  updateRecord(
                    {
                      _id: defaultID,
                      ...values,
                      updated: new Date(),
                    },
                    '/api/services',
                  )
                    .then((response) => {
                      toast({
                        description: 'The service was updated successfully.',
                      })
                      return mutate()
                    })
                    .then(() => {
                      setLoading(false)
                    })
                    .catch((error) => {
                      console.log(error)
                    })
                    .finally(() => {
                      setShowDialogue(false)
                    })
                }
              } else {
                reject('Message to form')
              }
            })
          }}
          title={context + ' Service'}
          description="Create and edit services. Click save when you're done."
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

export default ServicesAdmin
