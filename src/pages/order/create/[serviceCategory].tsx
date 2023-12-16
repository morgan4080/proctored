import { useCallback, useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { Separator } from '@/components/ui/separator'
import Container from "@/components/Container"
import Navigation from '@/components/Navigation'
import OrderSummary from '@/components/orders/OrderSummary'
import OrderDetailsForm from '@/components/orders/OrderDetailsForm'
import Footer from '@/components/Footer'
const Toaster = dynamic(() => import('@/components/ui/toaster'), { ssr: false })
import { toast } from '@/components/ui/use-toast'
import { addDays, differenceInDays, differenceInHours, format } from 'date-fns'
import {
  cn,
  createRecord,
  fetcher,
  generateKeyValuePairs,
  updateRecord,
} from '@/lib/utils'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import OrderOptionsForm from '@/components/orders/OrderOptionsForm'
import { ToastAction } from '@/components/ui/toast'
import {
  optionType,
  OrderResponse,
  ServiceCategoriesWithSubCategories,
  StoreDataType,
} from '@/lib/service_types'
import { useRouter } from 'next/router'
import PaymentMethod from '@/components/transactions/PaymentMethod'
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, FilePlus2, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import mongoClient from '@/lib/mongodb'
import Link from 'next/link'
import SpecialisedExamOrder from '@/components/orders/SpecialisedExamOrder'
import dynamic from 'next/dynamic'

const { clientPromise } = mongoClient
export const getServerSideProps = (async ({ params }) => {
  const client = await clientPromise
  const db = client.db('proctor')
  const servicesCategories = await db
    .collection('services_category')
    .aggregate<ServiceCategoriesWithSubCategories>([
      {
        $lookup: {
          from: 'services_sub_category',
          localField: 'subcategories',
          foreignField: '_id',
          as: 'subcategories_data',
        },
      },
      {
        $project: {
          title: 1,
          slug: 1,
          description: 1,
          products: 1,
          subcategories: '$subcategories_data',
        },
      },
    ])
    .sort({ title: -1 })
    .limit(100)
    .toArray()
  const serviceCategories = servicesCategories.map((s) => {
    const { _id, subcategories, ...sc } = s
    return {
      _id: _id.toString(),
      subcategories: subcategories.map((sc) => {
        const { _id, ...other } = sc
        return {
          _id: _id.toString(),
          ...other,
        }
      }),
      ...sc,
    }
  })
  const response = await fetcher(process.env.NEXTAUTH_URL + '/api/storedata')

  return {
    props: {
      storedata: JSON.parse(response),
      serviceCategories: serviceCategories,
      serviceCategory: params ? `${params.serviceCategory}` : '',
    },
  }
}) satisfies GetServerSideProps<{
  storedata: StoreDataType[]
  serviceCategories: ServiceCategoriesWithSubCategories[]
  serviceCategory: string
}>
const CreateOrder = ({
  storedata,
  serviceCategories,
  serviceCategory,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const [options, setOptions] = useState<
    { option: string; value: string | number | boolean }[]
  >([])
  const [extraOptions, setExtraOptions] = useState<optionType[]>([])
  const [totalAmount, setTotalAmount] = useState<string>('0')
  const [priceBeforeExtraOptions, setPriceBeforeExtraOptions] = useState(0)
  const [currentLevelId, setCurrentLevelId] = useState<number>(storedata[0].id)
  const [currentDuration, setCurrentDuration] = useState<string>('14 Days')
  const [currentStoreData, setCurrentStoreData] = useState<StoreDataType>(
    storedata[0],
  )
  const [orderId, setOrderId] = useState<string | null>(null)
  const [checkout, setCheckout] = useState(false)
  const [showChevronLeft, setShowChevronLeft] = useState(false)
  const [showChevronRight, setShowChevronRight] = useState(false)
  const viewportRef = useRef(null)
  const [orderDetails, setOrderDetails] = useState<{
    topic: string
    duration: { from: Date; to: Date }
    service: string
    academic_level: string
    subject_discipline: string
    paper_format: string
    attachments: FileList
    details: string
  } | null>(null)

  const [currentTab, setCurrentTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (viewportRef.current) {
      const htm: HTMLElement = viewportRef.current
      const isOverflowing = htm.scrollWidth > htm.offsetWidth
      setShowChevronRight(isOverflowing)
    }
  }, [viewportRef])

  useEffect(() => {
    // determine range prices
    if (/proctor/i.test(serviceCategory) || /nursing/i.test(serviceCategory)) {
      setTotalAmount('0')
    } else {
      const currentData = storedata.find(
        (std: StoreDataType) => std.id === currentLevelId,
      )

      setCurrentStoreData(() => {
        return currentData
      })

      setTotalAmount(() => {
        return currentData.deadline[currentDuration]
      })
    }
  }, [serviceCategory, currentLevelId, currentDuration, storedata])

  const saveOrder = useCallback(
    (
      orderOptions: {
        pages: number
        slides: number
        charts: number
        sources: number
        spacing: string
        digital_copies: boolean
        initial_draft: boolean
        one_page_summary: boolean
        plagiarism_report: boolean
      } | null,
      details = orderDetails,
    ) => {
      if (orderOptions && details) {
        setLoading(true)
        const sc = serviceCategories.find((svc) => svc.slug == serviceCategory)
        if (sc) {
          let data = {
            ...orderOptions,
            ...details,
            userId: session && session.user ? session.user._id : null,
            serviceCategoryId: sc._id,
            totalPrice: parseFloat(totalAmount),
          }
          if (orderId) {
            updateRecord(
              {
                _id: orderId,
                ...data,
              },
              '/api/orders',
            )
              .then((res) => {
                const response: OrderResponse = res
                if (response.status == 200) {
                  toast({
                    title: response.message,
                    description: 'Review order or edit, then proceed to pay.',
                    action: (
                      <ToastAction
                        altText="Try again"
                        onClick={() => {
                          setCheckout(true)
                        }}
                      >
                        Checkout
                      </ToastAction>
                    ),
                    duration: 9000,
                    onOpenChange: () => {
                      router.push('/order/edit/' + orderId)
                    },
                  })

                  setTimeout(() => setCheckout(true), 1000)
                } else {
                  toast({
                    variant: 'destructive',
                    title: response.message,
                    description:
                      'Something went wrong. Review order and resubmit.',
                    duration: 9000,
                    onOpenChange: () => {
                      router.push('/order/edit/' + orderId)
                    },
                  })
                }
              })
              .catch((e) => {
                toast({
                  variant: 'destructive',
                  title: 'Error creating order.',
                  description: e.message,
                  action: (
                    <ToastAction
                      altText="Try again"
                      onClick={() => {
                        saveOrder(orderOptions)
                      }}
                    >
                      Try again
                    </ToastAction>
                  ),
                })
              })
              .finally(() => {
                setLoading(false)
              })
          } else {
            createRecord(
              { ...data, writerId: null, transactionId: null },
              '/api/orders',
            )
              .then((res) => {
                const response: OrderResponse = res
                if (response.status == 200) {
                  setOrderId(response.data._id)
                  toast({
                    title: response.message,
                    description: 'Review order or edit, then proceed to pay.',
                    action: (
                      <ToastAction
                        altText="Try again"
                        onClick={() => {
                          setCheckout(true)
                        }}
                      >
                        Checkout
                      </ToastAction>
                    ),
                    duration: 9000,
                    onOpenChange: () => {
                      router.push('/order/edit/' + orderId)
                    },
                  })
                  setTimeout(() => setCheckout(true), 1000)
                } else {
                  toast({
                    variant: 'destructive',
                    title: response.message,
                    description:
                      'Something went wrong. Review order and resubmit.',
                    duration: 9000,
                    onOpenChange: () => {
                      router.push('/order/edit/' + orderId)
                    },
                  })
                }
              })
              .catch((error) => {
                toast({
                  variant: 'destructive',
                  title: 'Error creating order.',
                  description: error.message,
                  action: (
                    <ToastAction
                      altText="Try again"
                      onClick={() => {
                        saveOrder(orderOptions)
                      }}
                    >
                      Try again
                    </ToastAction>
                  ),
                })
              })
              .finally(() => {
                setLoading(false)
              })
          }
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error creating order.',
          description:
            'Order Missing Details, Confirm the forms are completely filled.',
        })
      }
    },
    [
      totalAmount,
      serviceCategories,
      serviceCategory,
      orderDetails,
      session,
      orderId,
      router,
    ],
  )

  return (
    <div className="relative">
      <Head>
        <title>Create Order</title>
        <meta name="description" content={'Order: Service' + serviceCategory} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={cn("font-serif", 'flex min-h-screen flex-col relative')}
      >
        <div className="bg-bermuda/95 w-full">
          <Navigation />
        </div>
        <Container
          className="xl:px-0"
          parentClassName="pt-10 pb-32 bg-white w-full"
        >
          <Tabs defaultValue={serviceCategory}>
            <div className="flex flex-col">
              <div className="flex relative justify-start">
                <ScrollArea
                  onScroll={(e) => {
                    const target = (e as any).target
                    if (viewportRef.current) {
                      const scrollElement: HTMLElement = viewportRef.current
                      if (target && target.scrollLeft < 5) {
                        setShowChevronLeft(false)
                        setShowChevronRight(true)
                      } else if (
                        scrollElement.offsetWidth - target.scrollLeft <
                        200
                      ) {
                        setShowChevronLeft(true)
                        setShowChevronRight(false)
                      }
                    }
                  }}
                  className="flex w-auto whitespace-nowrap"
                  viewportRef={viewportRef}
                >
                  <TabsList className="flex p-2.5 h-16">
                    {serviceCategories.map((sc) => (
                      <TabsTrigger
                        key={sc._id}
                        value={sc.slug}
                        className={cn(
                          "font-sans",
                          'data-[state=active]:ring-blue-500 data-[state=active]:ring-1 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:bg-black/80 data-[state=active]:shadow-blue-200 p-3',
                        )}
                      >
                        <Link
                          href={`/order/create/${sc.slug}`}
                        >
                          {sc.title}
                        </Link>
                        <FilePlus2 className="w-4 ml-2" />
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <ScrollBar orientation="horizontal" className="hidden" />
                </ScrollArea>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    !showChevronLeft && 'hidden',
                    'absolute left-0 bg-white/90 shadow-2xl hover:bg-bermuda hover:text-white',
                  )}
                  onClick={() => {
                    if (viewportRef && viewportRef.current) {
                      const scrollElement: HTMLElement = viewportRef.current
                      scrollElement.scrollTo(0, 0)
                    }
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    !showChevronRight && 'hidden',
                    'absolute right-0 bg-white/90 shadow-2xl hover:bg-bermuda hover:text-white',
                  )}
                  onClick={() => {
                    if (viewportRef && viewportRef.current) {
                      const scrollElement: HTMLElement = viewportRef.current
                      const stepLength =
                        scrollElement.offsetWidth / serviceCategories.length
                      scrollElement.scrollTo(
                        scrollElement.scrollLeft + stepLength * 2,
                        0,
                      )
                    }
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div
              data-orientation="horizontal"
              role="none"
              className="shrink-0 bg-border h-[1px] w-full my-6"
            ></div>
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <aside className="px-4 -mx-4 lg:w-1/5">
                {serviceCategories.map((sc) => (
                  <TabsContent
                    key={sc._id}
                    value={sc.slug}
                    className="space-y-6"
                  >
                    {/proctor/i.test(sc.title) || /nursing/i.test(sc.title) ? (
                      <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        <button
                          onClick={() => setCurrentTab(0)}
                          className={cn(
                            'inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-muted justify-start',
                            currentTab == 0 && 'bg-muted',
                          )}
                          type="button"
                        >
                          <svg
                            className="w-3 h-3 mr-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            ></path>
                          </svg>
                          <span>Order details</span>
                        </button>
                      </nav>
                    ) : (
                      <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        <button
                          onClick={() => setCurrentTab(0)}
                          className={cn(
                            'inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-muted justify-start',
                            currentTab == 0 && 'bg-muted',
                          )}
                          type="button"
                        >
                          <svg
                            className="w-3 h-3 mr-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            ></path>
                          </svg>
                          <span>Order details</span>
                        </button>
                        <button
                          onClick={() => {
                            if (orderDetails) {
                              setCurrentTab(1)
                            } else {
                              toast({
                                title: 'Complete order details',
                                description: (
                                  <p>
                                    Check all form fields and click proceed.
                                  </p>
                                ),
                              })
                            }
                          }}
                          className={cn(
                            'inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-muted justify-start',
                            currentTab == 1 && 'bg-muted',
                          )}
                          type="button"
                        >
                          <svg
                            className="w-3 h-3 mr-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                            ></path>
                          </svg>
                          <span>Order options</span>
                        </button>
                      </nav>
                    )}
                  </TabsContent>
                ))}
              </aside>
              <div className="flex-1 lg:max-w-2xl">
                <div className={cn('hidden', currentTab == 0 && 'block')}>
                  {serviceCategories.map((sc) => (
                    <TabsContent
                      key={sc._id}
                      value={sc.slug}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg text-slate-800 font-medium">
                          {sc.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Kindly fill out all the required fields.
                        </p>
                      </div>
                      <Separator />
                      {/proctor/i.test(sc.title) ||
                      /nursing/i.test(sc.title) ? (
                        <SpecialisedExamOrder
                          products={sc.products}
                          order={null}
                          proceedWithData={(data) => {
                            const sc = serviceCategories.find(
                              (svc) => svc.slug == serviceCategory,
                            )
                            if (sc) {
                              saveOrder(
                                {
                                  pages: 0,
                                  slides: 0,
                                  charts: 0,
                                  sources: 0,
                                  spacing: 'N/A',
                                  digital_copies: false,
                                  initial_draft: false,
                                  one_page_summary: false,
                                  plagiarism_report: false,
                                },
                                {
                                  topic: data.topic ? data.topic : 'N/A',
                                  duration: { from: data.date, to: data.date },
                                  service: sc.title,
                                  academic_level: data.exam,
                                  subject_discipline: data.subject.name,
                                  paper_format: 'N/A',
                                  attachments: data.attachments,
                                  details: data.details ? data.details : 'N/A',
                                },
                              )
                            }
                          }}
                          reportValues={({
                            attachments,
                            subject,
                            date,
                            ...other
                          }) => {
                            let dat = {}
                            if (
                              attachments &&
                              attachments instanceof FileList
                            ) {
                              dat = {
                                ...dat,
                                attachments: Array.from(attachments)
                                  .map((file, i) => {
                                    return i + 1 + '). ' + file.name
                                  })
                                  .toString()
                                  .split(',')
                                  .join(',\n'),
                              }
                            }
                            if (date) {
                              dat = {
                                ...dat,
                                date: format(
                                  new Date(date as Date),
                                  'dd/MM/yyyy HH:mm:ss',
                                ),
                              }
                            }
                            if (subject) {
                              setTotalAmount(
                                `${
                                  (subject as { name: string; price: number })
                                    .price
                                }`,
                              )
                              dat = {
                                ...dat,
                                subject: (
                                  subject as { name: string; price: number }
                                ).name,
                              }
                            } else {
                              setTotalAmount('0')
                            }
                            setOptions(() =>
                              generateKeyValuePairs({
                                ...other,
                                ...dat,
                              }),
                            )
                          }}
                        />
                      ) : (
                        <OrderDetailsForm
                          storedata={storedata}
                          order={null}
                          proceedWithData={(data) => {
                            setOrderDetails(data)
                            setCurrentTab(1)
                            setPriceBeforeExtraOptions(parseFloat(totalAmount))
                          }}
                          reportValues={(data) => {
                            setOptions(() =>
                              Object.entries(data).reduce(
                                (accumulator: typeof options, currentValue) => {
                                  const [key, value] = currentValue
                                  if (value !== undefined) {
                                    switch (key) {
                                      case 'academic_level':
                                        setCurrentLevelId(() => {
                                          return storedata.find(
                                            (std: StoreDataType) =>
                                              std.level === value,
                                          ).id
                                        })
                                        break
                                      case 'duration':
                                        if (
                                          typeof value === 'object' &&
                                          !(value instanceof FileList)
                                        ) {
                                          if (
                                            value.hasOwnProperty('from') &&
                                            value.hasOwnProperty('to')
                                          ) {
                                            if (value.to && value.from) {
                                              const to = value.to
                                              const from = value.from
                                              setCurrentDuration(() => {
                                                return Object.entries(
                                                  currentStoreData.deadline,
                                                ).reduce(
                                                  (acc, [key, value]) => {
                                                    const getObj = () => {
                                                      if (
                                                        key
                                                          .toLowerCase()
                                                          .includes('hour')
                                                      ) {
                                                        return {
                                                          [parseInt(
                                                            key,
                                                          ).toString()]: value,
                                                        }
                                                      } else {
                                                        const futureDate =
                                                          addDays(
                                                            new Date(),
                                                            parseInt(key),
                                                          )
                                                        const currentDate =
                                                          new Date()
                                                        const newKey =
                                                          differenceInHours(
                                                            futureDate,
                                                            currentDate,
                                                          )
                                                        return {
                                                          [newKey.toString()]:
                                                            value,
                                                        }
                                                      }
                                                    }

                                                    if (
                                                      differenceInHours(
                                                        to,
                                                        from,
                                                      ) >=
                                                      parseInt(
                                                        Object.keys(
                                                          getObj(),
                                                        )[0],
                                                      )
                                                    ) {
                                                      acc = key
                                                    }

                                                    return acc
                                                  },
                                                  '',
                                                )
                                              })
                                            }
                                          }
                                        }
                                        break
                                    }
                                    if (typeof value === 'string') {
                                      accumulator.push({
                                        option: key,
                                        value: value,
                                      })
                                    } else if (value instanceof FileList) {
                                      accumulator.push({
                                        option: key,
                                        value: Array.from(value)
                                          .map((file, i) => {
                                            return i + 1 + '). ' + file.name
                                          })
                                          .toString()
                                          .split(',')
                                          .join(',\n'),
                                      })
                                    } else if (typeof value === 'object') {
                                      if (
                                        value.hasOwnProperty('from') &&
                                        value.hasOwnProperty('to')
                                      ) {
                                        if (value.to && value.from) {
                                          accumulator.push({
                                            option: key,
                                            value:
                                              differenceInDays(
                                                value.to,
                                                value.from,
                                              ) > 0
                                                ? differenceInDays(
                                                    value.to,
                                                    value.from,
                                                  ) + ' days'
                                                : differenceInHours(
                                                    value.to,
                                                    value.from,
                                                  ) + ' hours',
                                          })
                                        }
                                      }
                                    }
                                  }
                                  return accumulator
                                },
                                [],
                              ),
                            )
                          }}
                        />
                      )}
                    </TabsContent>
                  ))}
                </div>
                <div
                  className={cn('space-y-6 hidden', currentTab == 1 && 'block')}
                >
                  <div>
                    <h3 className="text-lg text-slate-800 font-medium">
                      Order options
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Please fill out all the required fields. This will factor
                      into your final price.
                    </p>
                  </div>
                  <Separator />
                  <OrderOptionsForm
                    storedata={storedata}
                    order={null}
                    reportValues={(data) => {
                      setTotalAmount(() => {
                        let price = 0
                        let spacing = 1
                        let pagesPricing = 0
                        let slidesPricing = 0
                        let chartsPricing = 0
                        let digitalCopyPricing = 0
                        let onePageSummaryPricing = 0
                        let plagiarismReportPricing = 0
                        let applyInitialDraft = false
                        let initialDraftPricing = (
                          apply: boolean,
                          p: number,
                        ) => {
                          if (apply) {
                            return p * 0.1
                          }
                          return 0
                        }

                        // pages * price
                        if (typeof data.pages == 'number') {
                          pagesPricing = priceBeforeExtraOptions * data.pages
                        }

                        // price + (6.5 * slides)
                        if (typeof data.slides == 'number') {
                          slidesPricing = 6.5 * data.slides
                        }

                        // price + (5.0 * charts)
                        if (typeof data.charts == 'number') {
                          chartsPricing = 5.0 * data.charts
                        }

                        // 'single' 2 * price per page
                        // 'double' price remains the same
                        if (typeof data.spacing == 'string') {
                          if (data.spacing == 'single') {
                            spacing = 2
                          } else {
                            spacing = 1
                          }
                        }

                        // digital_copies true ? price + 9.99
                        if (
                          typeof data.digital_copies == 'boolean' &&
                          data.digital_copies
                        ) {
                          digitalCopyPricing = 9.99
                        }

                        // initial_draft true ? price + 10%
                        if (
                          typeof data.initial_draft == 'boolean' &&
                          data.initial_draft
                        ) {
                          applyInitialDraft = true
                        }

                        // one_page_summary true ? price + 17.99
                        if (
                          typeof data.one_page_summary == 'boolean' &&
                          data.one_page_summary
                        ) {
                          onePageSummaryPricing = 17.99
                        }

                        // plagiarism_report true ? price + 7.99
                        if (
                          typeof data.plagiarism_report == 'boolean' &&
                          data.plagiarism_report
                        ) {
                          plagiarismReportPricing = 7.99
                        }

                        price =
                          pagesPricing * spacing +
                          slidesPricing +
                          chartsPricing +
                          plagiarismReportPricing +
                          onePageSummaryPricing +
                          digitalCopyPricing +
                          initialDraftPricing(applyInitialDraft, pagesPricing)
                        return parseFloat(price.toFixed(2)).toString()
                      })

                      setExtraOptions(() =>
                        Object.entries(data).reduce(
                          (accumulator: typeof extraOptions, currentValue) => {
                            const [key, value] = currentValue
                            if (value !== undefined) {
                              accumulator.push({
                                option: key,
                                value: value.toString(),
                              })
                            }
                            return accumulator
                          },
                          [],
                        ),
                      )
                    }}
                    proceedWithData={(data) => {
                      saveOrder(data)
                    }}
                    orderId={orderId}
                  />
                </div>
              </div>
              <div className="lg:w-3/12 relative">
                <OrderSummary
                  options={[...options, ...extraOptions]}
                  totalAmount={totalAmount}
                  orderId={orderId}
                  setCheckout={() => {
                    setCheckout(!checkout)
                  }}
                />
              </div>
            </div>
          </Tabs>
        </Container>
      </main>
      <Dialog
        open={checkout}
        defaultOpen={false}
        onOpenChange={() => {
          router.push('/order/edit/' + orderId)
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <PaymentMethod />
        </DialogContent>
      </Dialog>
      <Dialog open={loading} defaultOpen={false}>
        <DialogPortal>
          <DialogOverlay className="flex items-center justify-center">
            <Loader2 className="mr-2 h-12 w-12 text-zinc-500 animate-spin" />
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
      <Footer />
      <Toaster />
    </div>
  )
}

export default CreateOrder
