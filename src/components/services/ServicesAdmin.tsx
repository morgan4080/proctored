import { useEffect, useState } from 'react'
import { cn, createRecord, fetcher, slugify, updateRecord } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import {
  Service,
  ServiceCategoriesWithSubCategories,
  ServiceSubCategories,
} from '@/lib/service_types'
import ServicesTable from '@/components/services/ServicesTable'
import ServiceDialogue from '@/components/services/ServiceDialogue'
import { toast } from '@/components/ui/use-toast'
import useSWR from 'swr'
const Toaster = dynamic(() => import('@/components/ui/toaster'), { ssr: false })
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'
import { Shapes, Loader2, Pen, PlusIcon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import CodeEditor from '@/components/JSONEDIT/CodeEditor'
import { ViewUpdate } from '@codemirror/view'
import dynamic from 'next/dynamic'

const formSchemaCategories = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters and unique.',
  }),
  slug: z.string().min(3, {
    message: 'Slug must be at least 3 characters and unique.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  subcategories: z.array(z.string()).default([]),
  products: z.string(),
})

const formSchemaSubCategories = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters and unique.',
  }),
  slug: z.string().min(3, {
    message: 'Slug must be at least 3 characters and unique.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
})

const ServicesAdmin = ({
  current,
  services,
  serviceCategories,
  serviceSubCategories,
}: {
  current: boolean
  services: Service[]
  serviceCategories: ServiceCategoriesWithSubCategories[]
  serviceSubCategories: ServiceSubCategories[]
}) => {
  const qpc = new URLSearchParams()
  qpc.set('category', 'true')

  const qpsc = new URLSearchParams()
  qpsc.set('sub_category', 'true')

  const { data: updatedData, mutate } = useSWR(`/api/services`, fetcher, {
    initialData: services,
  } as any)

  const [updatedServices, setUpdatedServices] = useState(services)

  const { data: updatedCategoryData, mutate: mutateCategory } = useSWR(
    `/api/services?${qpc.toString()}`,
    fetcher,
    {
      initialData: serviceCategories,
    } as any,
  )

  const [updatedServiceCategory, setUpdatedServiceCategory] =
    useState(serviceCategories)

  const { data: updatedSubCategoryData, mutate: mutateSubCategory } = useSWR(
    `/api/services?${qpsc.toString()}`,
    fetcher,
    {
      initialData: serviceSubCategories,
    } as any,
  )

  const [updatedServiceSubCategory, setUpdatedServiceSubCategory] =
    useState(serviceSubCategories)

  const [context, setContext] = useState('Create')
  const [defaultID, setDefaultID] = useState('')
  const [defaultTitle, setDefaultTitle] = useState('')
  const [defaultSlug, setDefaultSlug] = useState('')
  const [defaultExcerpt, setDefaultExcerpt] = useState('')
  const [defaultDescription, setDefaultDescription] = useState('')
  const [defaultCategory, setDefaultCategory] = useState('')
  const [defaultSubCategory, setDefaultSubCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDialogue, setShowDialogue] = useState(false)
  const [catDialogue, showCatDialogue] = useState(false)

  const categoryForm = useForm<z.infer<typeof formSchemaCategories>>({
    resolver: zodResolver(formSchemaCategories),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      subcategories: [],
      products: '[]',
    },
  })

  const subCategoryForm = useForm<z.infer<typeof formSchemaSubCategories>>({
    resolver: zodResolver(formSchemaSubCategories),
  })

  useEffect(() => {
    if (updatedData !== undefined) {
      const { data, message } = updatedData
      if (data.length > 0) setUpdatedServices(data)
    }
    return () => {
      setLoading(false)
    }
  }, [updatedData])

  useEffect(() => {
    if (updatedCategoryData !== undefined) {
      const { data, message } = updatedCategoryData
      if (data.length > 0) setUpdatedServiceCategory(data)
    }
    return () => {
      setLoading(false)
    }
  }, [updatedCategoryData])

  useEffect(() => {
    if (updatedSubCategoryData !== undefined) {
      const { data, message } = updatedSubCategoryData
      if (data.length > 0) setUpdatedServiceSubCategory(data)
    }
    return () => {
      setLoading(false)
    }
  }, [updatedSubCategoryData])

  useEffect(() => {
    const subscription = categoryForm.watch((value, { name, type }) => {
      ;(async () => {
        switch (name) {
          case 'title':
            if (value.title) {
              categoryForm.setValue('slug', slugify(value.title))
            } else {
              categoryForm.setValue('slug', '')
            }
            break
        }
      })()
    })
    return () => subscription.unsubscribe()
  })

  useEffect(() => {
    const subscription = subCategoryForm.watch((value, { name, type }) => {
      ;(async () => {
        switch (name) {
          case 'title':
            if (value.title) {
              subCategoryForm.setValue('slug', slugify(value.title))
            } else {
              subCategoryForm.setValue('slug', '')
            }
            break
        }
      })()
    })
    return () => subscription.unsubscribe()
  })

  const [serviceCategory, selectServiceCategory] =
    useState<ServiceCategoriesWithSubCategories | null>(null)
  const [serviceSubCategory, selectServiceSubCategory] =
    useState<ServiceSubCategories | null>(null)
  const [categoryContext, setCategoryContext] = useState('CREATE')
  const [categorySubContext, setCategorySubContext] = useState('EDIT')
  const [subCategoryContext, setSubCategoryContext] = useState('CREATE')

  const onSubmitCategory = (values: z.infer<typeof formSchemaCategories>) => {
    setLoading(true)
    if (serviceCategory) {
      if (
        /^[\],:{}\s]*$/.test(
          values.products
            .replace(/\\["\\\/bfnrtu]/g, '@')
            .replace(
              /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
              ']',
            )
            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
        )
      ) {
        // update
        const { products, ...otherValues } = values
        updateRecord(
          {
            ...serviceCategory,
            ...otherValues,
            products: JSON.parse(products),
          },
          `/api/services?${qpc.toString()}`,
        )
          .then((response) => {
            toast({
              description: 'The service category was updated successfully.',
            })
            return mutateCategory()
          })
          .catch((error) => {
            toast({
              variant: 'destructive',
              description: error.message,
            })
          })
          .finally(() => {
            selectServiceCategory(null)
            setLoading(false)
            setCategoryContext('VIEW')
          })
      } else {
        toast({
          variant: 'destructive',
          description: 'Invalid JSON for products of category: ' + values.title,
        })
      }
    } else {
      // create
      if (
        /^[\],:{}\s]*$/.test(
          values.products
            .replace(/\\["\\\/bfnrtu]/g, '@')
            .replace(
              /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
              ']',
            )
            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
        )
      ) {
        // update
        const { products, ...otherValues } = values
        createRecord(
          {
            ...values,
            products: JSON.parse(products),
          },
          `/api/services?${qpc.toString()}`,
        )
          .then((response) => {
            toast({
              description: 'The service category was created successfully.',
            })
            return mutateCategory()
          })
          .catch((error) => {
            console.log(error)
          })
          .finally(() => {
            selectServiceCategory(null)
            setLoading(false)
            setCategoryContext('VIEW')
          })
      } else {
        toast({
          variant: 'destructive',
          description: 'Invalid JSON for products of category: ' + values.title,
        })
      }
    }
  }

  const onSubmitSubCategory = (
    values: z.infer<typeof formSchemaSubCategories>,
  ) => {
    setLoading(true)
    if (serviceSubCategory) {
      updateRecord(
        {
          ...serviceSubCategory,
          ...values,
        },
        `/api/services?${qpsc.toString()}`,
      )
        .then((response) => {
          toast({
            description: 'The service sub-category was updated successfully.',
          })
          return mutateSubCategory()
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          selectServiceSubCategory(null)
          setLoading(false)
          setSubCategoryContext('VIEW')
        })
    } else {
      createRecord(values, `/api/services?${qpsc.toString()}`)
        .then((response) => {
          toast({
            description: 'The service sub-category was created successfully.',
          })
          return mutateSubCategory()
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          selectServiceSubCategory(null)
          setLoading(false)
          setSubCategoryContext('VIEW')
        })
    }
  }

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
          <div className="flex flex-row-reverse gap-2">
            <span className="block">
              <button
                onClick={() => {
                  setContext('Create')
                  setDefaultID('')
                  setDefaultTitle('')
                  setDefaultSlug('')
                  setDefaultExcerpt('')
                  setDefaultDescription('')
                  setDefaultCategory('')
                  setDefaultSubCategory('')
                  setShowDialogue(!showDialogue)
                }}
                type="button"
                className="inline-flex justify-center rounded-full text-sm font-semibold p-2 px-3 bg-slate-900 text-white hover:bg-slate-700"
              >
                <span className="flex items-center text-xs">
                  Add Service{' '}
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
            <span className="block">
              <button
                onClick={() => {
                  setContext('Category')
                  showCatDialogue(!catDialogue)
                }}
                type="button"
                className="inline-flex justify-center rounded-full text-sm font-semibold p-2 px-3 bg-slate-900 text-white hover:bg-slate-700"
              >
                <span className="flex items-center text-xs">
                  Add Category{' '}
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
            <span className="block">
              <button
                onClick={() => {
                  setContext('SubCategory')
                  showCatDialogue(!catDialogue)
                }}
                type="button"
                className="inline-flex justify-center rounded-full text-sm font-semibold p-2 px-3 bg-slate-900 text-white hover:bg-slate-700"
              >
                <span className="flex items-center text-xs">
                  Add Sub-Category{' '}
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
          setDefaultCategory={setDefaultCategory}
          setDefaultSubCategory={setDefaultSubCategory}
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
      {/*SERVICE*/}
      {showDialogue && (
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
          serviceCategories={updatedServiceCategory}
          defaultCategory={defaultCategory}
          defaultSubCategory={defaultSubCategory}
          context={context}
        />
      )}
      {/*SERVICE CATEGORIES*/}
      {context == 'Category' && catDialogue && (
        <Dialog
          defaultOpen={catDialogue}
          onOpenChange={(open: boolean) =>
            setTimeout(() => showCatDialogue(open), 1000)
          }
        >
          <DialogContent className="sm:max-w-[725px]">
            {categoryContext == 'VIEW' && (
              <>
                <DialogHeader>
                  <DialogTitle>Categories</DialogTitle>
                  <DialogDescription>Service categories.</DialogDescription>
                  <DialogDescription className="flex justify-end">
                    <button
                      type="button"
                      className="underline"
                      onClick={() => {
                        categoryForm.setValue('title', '')
                        categoryForm.setValue('slug', '')
                        categoryForm.setValue('description', '')
                        categoryForm.setValue('subcategories', [])
                        categoryForm.setValue(
                          'products',
                          JSON.stringify([], null, 2),
                        )
                        selectServiceCategory(null)
                        categoryForm.trigger().then(() => {
                          setCategorySubContext('')
                          setCategoryContext('CREATE')
                          categoryForm.clearErrors()
                        })
                      }}
                    >
                      Create +
                    </button>
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72 w-full">
                  <Table>
                    {updatedServiceCategory.length == 0 && (
                      <TableCaption>
                        No service categories available.
                      </TableCaption>
                    )}
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[100px] text-xs">
                          Title
                        </TableHead>
                        <TableHead className="text-left text-xs">
                          Description
                        </TableHead>
                        <TableHead className="text-right text-xs">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    {updatedServiceCategory.map((sc) => (
                      <TableBody key={sc._id}>
                        <TableRow>
                          <TableCell className="text-xs">{sc.title}</TableCell>
                          <TableCell className="text-left text-xs">
                            <span className="line-clamp-2">
                              {sc.description}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-xs flex justify-center space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="w-5 h-5"
                                    onClick={() => {
                                      categoryForm.setValue('title', sc.title)
                                      categoryForm.setValue('slug', sc.slug)
                                      categoryForm.setValue(
                                        'description',
                                        sc.description,
                                      )
                                      categoryForm.setValue(
                                        'subcategories',
                                        sc.subcategories.map((ssc) => ssc._id),
                                      )
                                      categoryForm.setValue(
                                        'products',
                                        JSON.stringify(sc.products, null, 2),
                                      )
                                      selectServiceCategory(sc)
                                      categoryForm.trigger().then((r) => {
                                        setCategorySubContext('PRICING')
                                        setCategoryContext('SELECTED')
                                      })
                                    }}
                                  >
                                    <Shapes className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Configure Product</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="w-5 h-5"
                                    onClick={() => {
                                      categoryForm.setValue('title', sc.title)
                                      categoryForm.setValue('slug', sc.slug)
                                      categoryForm.setValue(
                                        'description',
                                        sc.description,
                                      )
                                      categoryForm.setValue(
                                        'subcategories',
                                        sc.subcategories.map((ssc) => ssc._id),
                                      )
                                      categoryForm.setValue(
                                        'products',
                                        JSON.stringify(sc.products),
                                      )
                                      selectServiceCategory(sc)
                                      categoryForm.trigger().then((r) => {
                                        setCategorySubContext('ASSIGN')
                                        setCategoryContext('SELECTED')
                                      })
                                    }}
                                  >
                                    <PlusIcon className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Attach Sub-category</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="w-5 h-5"
                                    onClick={() => {
                                      categoryForm.setValue('title', sc.title)
                                      categoryForm.setValue('slug', sc.slug)
                                      categoryForm.setValue(
                                        'description',
                                        sc.description,
                                      )
                                      categoryForm.setValue(
                                        'subcategories',
                                        sc.subcategories.map((ssc) => ssc._id),
                                      )
                                      categoryForm.setValue(
                                        'products',
                                        JSON.stringify(sc.products),
                                      )
                                      selectServiceCategory(sc)
                                      categoryForm.trigger().then((r) => {
                                        setCategorySubContext('EDIT')
                                        setCategoryContext('SELECTED')
                                      })
                                    }}
                                  >
                                    <Pen className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Edit Sub-category</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ))}
                  </Table>
                </ScrollArea>
              </>
            )}

            {categoryContext == 'CREATE' && (
              <>
                <DialogHeader>
                  <DialogTitle>Create Category</DialogTitle>
                  <DialogDescription>
                    Create service category.
                  </DialogDescription>
                  <DialogDescription className="flex justify-end">
                    <button
                      type="button"
                      className="underline"
                      onClick={() => setCategoryContext('VIEW')}
                    >
                      View +
                    </button>
                  </DialogDescription>
                </DialogHeader>

                <Form {...categoryForm}>
                  <form
                    onSubmit={categoryForm.handleSubmit(onSubmitCategory)}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={categoryForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={categoryForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input disabled {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={categoryForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit">Submit</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </>
            )}

            {categoryContext == 'SELECTED' &&
              (categorySubContext == 'EDIT' ||
                categorySubContext == 'ASSIGN' ||
                categorySubContext == 'PRICING') && (
                <>
                  {categorySubContext == 'PRICING' ? (
                    <DialogHeader>
                      <DialogTitle>{serviceCategory?.title}</DialogTitle>
                      <DialogDescription>Configure pricing.</DialogDescription>
                      <DialogDescription className="flex justify-end">
                        <button
                          type="button"
                          className="underline"
                          onClick={() => setCategoryContext('VIEW')}
                        >
                          View +
                        </button>
                      </DialogDescription>
                    </DialogHeader>
                  ) : (
                    <DialogHeader>
                      <DialogTitle>{serviceCategory?.title}</DialogTitle>
                      <DialogDescription>
                        Edit/Assign Subcategories.
                      </DialogDescription>
                      <DialogDescription className="flex justify-end">
                        <button
                          type="button"
                          className="underline"
                          onClick={() => setCategoryContext('VIEW')}
                        >
                          View +
                        </button>
                      </DialogDescription>
                    </DialogHeader>
                  )}

                  <Form {...categoryForm}>
                    <form
                      onSubmit={categoryForm.handleSubmit(onSubmitCategory)}
                      className="space-y-8"
                    >
                      {categorySubContext == 'EDIT' && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={categoryForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={categoryForm.control}
                              name="slug"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Slug</FormLabel>
                                  <FormControl>
                                    <Input disabled {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={categoryForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {categorySubContext == 'ASSIGN' && (
                        <ScrollArea className="h-72 w-full">
                          <FormField
                            control={categoryForm.control}
                            name="subcategories"
                            render={() => (
                              <FormItem>
                                {updatedServiceSubCategory.map((item) => (
                                  <FormField
                                    key={item._id}
                                    control={categoryForm.control}
                                    name="subcategories"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={item._id}
                                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(
                                                item._id,
                                              )}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([
                                                      ...field.value,
                                                      item._id,
                                                    ])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) =>
                                                          value !== item._id,
                                                      ),
                                                    )
                                              }}
                                            />
                                          </FormControl>

                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="text-black font-semibold">
                                              {item.title}
                                            </FormLabel>
                                            <FormDescription>
                                              <span className="line-clamp-2">
                                                {item.description}
                                              </span>
                                            </FormDescription>
                                          </div>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </ScrollArea>
                      )}

                      {categorySubContext == 'PRICING' && (
                        <FormField
                          control={categoryForm.control}
                          name="products"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Products</FormLabel>
                              <ScrollArea className="h-72 w-full">
                                <FormControl>
                                  <CodeEditor
                                    value={field.value}
                                    onChange={(
                                      value: string,
                                      viewUpdate: ViewUpdate,
                                    ) => {
                                      // console.log(value, viewUpdate)
                                      field.onChange(value)
                                    }}
                                    extensions={[]}
                                  />
                                </FormControl>
                              </ScrollArea>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <DialogFooter>
                        <Button type="submit">Submit</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </>
              )}
          </DialogContent>
        </Dialog>
      )}
      {/*SERVICE SUBCATEGORIES*/}
      {context == 'SubCategory' && catDialogue && (
        <Dialog
          defaultOpen={catDialogue}
          onOpenChange={(open: boolean) =>
            setTimeout(() => showCatDialogue(open), 1000)
          }
        >
          <DialogContent className="sm:max-w-[725px]">
            {subCategoryContext == 'VIEW' && (
              <>
                <DialogHeader>
                  <DialogTitle>Sub Categories</DialogTitle>
                  <DialogDescription>Service sub-categories.</DialogDescription>
                  <DialogDescription className="flex justify-end">
                    <button
                      type="button"
                      className="underline"
                      onClick={() => {
                        subCategoryForm.setValue('title', '')
                        subCategoryForm.setValue('slug', '')
                        subCategoryForm.setValue('description', '')
                        selectServiceSubCategory(null)
                        subCategoryForm.trigger().then(() => {
                          setSubCategoryContext('CREATE')
                          subCategoryForm.clearErrors()
                        })
                      }}
                    >
                      Create +
                    </button>
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72 w-full">
                  <Table>
                    {updatedServiceSubCategory.length == 0 && (
                      <TableCaption>
                        No service sub-categories available.
                      </TableCaption>
                    )}
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[100px] text-xs">
                          Title
                        </TableHead>
                        <TableHead className="text-left text-xs">
                          Description
                        </TableHead>
                        <TableHead className="text-right text-xs">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    {updatedServiceSubCategory.map((sc) => (
                      <TableBody key={sc._id}>
                        <TableRow>
                          <TableCell className="text-xs">{sc.title}</TableCell>
                          <TableCell className="text-left text-xs">
                            <span className="line-clamp-2">
                              {sc.description}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-xs flex justify-center space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="w-5 h-5"
                                    onClick={() => {
                                      subCategoryForm.setValue(
                                        'title',
                                        sc.title,
                                      )
                                      subCategoryForm.setValue('slug', sc.slug)
                                      subCategoryForm.setValue(
                                        'description',
                                        sc.description,
                                      )

                                      selectServiceSubCategory(sc)

                                      subCategoryForm
                                        .trigger()
                                        .then((r) =>
                                          setSubCategoryContext('SELECTED'),
                                        )
                                    }}
                                  >
                                    <Pen className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Edit Sub-category</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ))}
                  </Table>
                </ScrollArea>
              </>
            )}

            {subCategoryContext == 'CREATE' && (
              <>
                <DialogHeader>
                  <DialogTitle>Create Sub-Category</DialogTitle>
                  <DialogDescription>
                    Create service sub-category.
                  </DialogDescription>
                  <DialogDescription className="flex justify-end">
                    <button
                      type="button"
                      className="underline"
                      onClick={() => setSubCategoryContext('VIEW')}
                    >
                      View +
                    </button>
                  </DialogDescription>
                </DialogHeader>
                <Form {...subCategoryForm}>
                  <form
                    onSubmit={subCategoryForm.handleSubmit(onSubmitSubCategory)}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={subCategoryForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={subCategoryForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input disabled {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={subCategoryForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Submit</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </>
            )}

            {subCategoryContext == 'SELECTED' && serviceSubCategory && (
              <>
                <DialogHeader>
                  <DialogTitle>Edit Sub-Category</DialogTitle>
                  <DialogDescription>
                    Edit service sub-category.
                  </DialogDescription>
                  <DialogDescription className="flex justify-end">
                    <button
                      type="button"
                      className="underline"
                      onClick={() => setSubCategoryContext('VIEW')}
                    >
                      View +
                    </button>
                  </DialogDescription>
                </DialogHeader>
                <Form {...subCategoryForm}>
                  <form
                    onSubmit={subCategoryForm.handleSubmit(onSubmitSubCategory)}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={subCategoryForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={subCategoryForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input disabled {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={subCategoryForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Submit</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default ServicesAdmin
