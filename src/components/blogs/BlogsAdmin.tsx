import { useEffect, useState } from 'react'
import { cn, createRecord, fetcher, updateRecord } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Blog } from '@/lib/service_types'
import { toast } from '@/components/ui/use-toast'
import useSWR from 'swr'
const Toaster = dynamic(() => import('@/components/ui/toaster'), {
  ssr: false,
})
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import BlogsTable from '@/components/blogs/BlogsTable'
import BlogDialogue from '@/components/blogs/BlogDialogue'
import dynamic from 'next/dynamic'

const BlogsAdmin = ({
  current,
  blogs,
}: {
  current: boolean
  blogs: Blog[]
}) => {
  const [context, setContext] = useState('Create')
  const [defaultID, setDefaultID] = useState('')
  const [defaultTitle, setDefaultTitle] = useState('')
  const [defaultSlug, setDefaultSlug] = useState('')
  const [defaultExcerpt, setDefaultExcerpt] = useState('')
  const [defaultDescription, setDefaultDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDialogue, setShowDialogue] = useState(false)

  const { data: updatedData, mutate } = useSWR('/api/blogs', fetcher, {
    initialData: blogs,
  } as any)

  const [updatedBlogs, setUpdatedBlogs] = useState(blogs)

  useEffect(() => {
    if (updatedData !== undefined) {
      const { data, message } = updatedData
      if (data.length > 0) setUpdatedBlogs(data)
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
            <h3 className="text-lg text-slate-800 font-medium">All Blogs</h3>
            <p className="text-sm text-muted-foreground">
              View, add, edit and delete blogs.
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
        <BlogsTable
          blogs={updatedBlogs}
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
      <Dialog open={loading} defaultOpen={false}>
        <DialogPortal>
          <DialogOverlay className="flex items-center justify-center">
            <Loader2 className="mr-2 h-12 w-12 text-zinc-500 animate-spin" />
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
      {showDialogue ? (
        <BlogDialogue
          context={context}
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
                    '/api/blogs',
                  )
                    .then((response) => {
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
                    '/api/blogs',
                  )
                    .then((response) => {
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
                    .finally(() => {
                      setShowDialogue(false)
                    })
                }
              } else {
                reject('Message to form')
              }
            })
          }}
          title={context + ' Blog'}
          description="Create and edit blogs. Click save when you're done."
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

export default BlogsAdmin
