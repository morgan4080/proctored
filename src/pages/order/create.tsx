import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import classNames from '../../utils/ClassNames'
import { Separator } from '@/components/ui/separator'
import { Container } from '@/components/Container'
import Navigation from '@/components/Navigation'
import { Inter, Lexend } from 'next/font/google'
import OrderSummary from '@/components/orders/OrderSummary'
import OrderDetailsForm from '@/components/orders/OrderDetailsForm'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster'
import { toast } from '@/components/ui/use-toast'
import { addDays, differenceInDays, differenceInHours } from 'date-fns'
import {
  cn,
  createRecord,
  fetcher,
  formatMoney,
  updateRecord,
} from '@/lib/utils'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import OrderOptionsForm from '@/components/orders/OrderOptionsForm'
import { ToastAction } from '@/components/ui/toast'
import { OrderResponse } from '@/lib/service_types'
import { useRouter } from 'next/router'
import PaymentMethod from '@/components/transactions/PaymentMethod'
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})
const lexend = Lexend({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

type StoreDataType = {
  id: number
  level: string
  deadline: Record<string, number>
  format: string[]
  subjects0: string[]
  subjects: string[]
}

export const getServerSideProps = (async () => {
  const response = await fetcher(process.env.NEXTAUTH_URL + '/api/storedata')
  return {
    props: { storedata: JSON.parse(response), revalidate: 60 },
  }
}) satisfies GetServerSideProps<{
  storedata: StoreDataType[]
}>
const CreateOrder = ({
  storedata,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const [options, setOptions] = useState<
    { option: string; value: string | number | boolean }[]
  >([])
  const [extraOptions, setExtraOptions] = useState<
    { option: string; value: string | number | boolean }[]
  >([])
  const [totalAmount, setTotalAmount] = useState<string>('0')
  const [currentLevelId, setCurrentLevelId] = useState<number>(storedata[0].id)
  const [currentDuration, setCurrentDuration] = useState<string>('14 Days')
  const [currentStoreData, setCurrentStoreData] = useState<StoreDataType>(
    storedata[0],
  )
  const [orderId, setOrderId] = useState<string | null>(null)
  const [checkout, setCheckout] = useState<boolean>(false)
  const [orderDetails, setOrderDetails] = useState<{
    topic: string
    duration: { from: Date; to: Date }
    service: string
    academic_level: string
    subject_discipline: string
    paper_format: string
    attachments: FileList
    paper_details: string
  } | null>(null)

  const [currentTab, setCurrentTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    // determine range prices
    const currentData = storedata.find(
      (std: StoreDataType) => std.id === currentLevelId,
    )

    setCurrentStoreData(() => {
      return currentData
    })

    setTotalAmount(() => {
      return currentData.deadline[currentDuration]
    })
  }, [currentLevelId, currentDuration, storedata])

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
    ) => {
      if (orderOptions) {
        setLoading(true)
        let data = {
          ...orderOptions,
          ...orderDetails,
          // userId: session && session.user ? session.user.userId : null,
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
              console.log(res)
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
              } else {
                toast({
                  variant: 'destructive',
                  title: response.message,
                  description:
                    'Something went wrong. Review order and resubmit.',
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
          createRecord(data, '/api/orders')
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
              } else {
                toast({
                  variant: 'destructive',
                  title: response.message,
                  description:
                    'Something went wrong. Review order and resubmit.',
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
    },
    [orderDetails, orderId, router],
  )

  return (
    <div className="relative">
      <Head>
        <title>Create Order</title>
        <meta name="description" content="Proctor Owls Order" />
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

        <Container className="xl:px-0" parentClassName="pt-10 bg-white w-full">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex gap-4 items-center">
                <span className={classNames(lexend.className)}>
                  Create Order{' '}
                </span>
              </h2>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                Order Amount.{' '}
                <span className="font-semibold">
                  ${formatMoney(totalAmount)}
                </span>
              </p>
            </div>
            <div className="mt-5 flex lg:ml-4 lg:mt-0">
              <span className="block"></span>
            </div>
          </div>
        </Container>
        <Container className="xl:px-0" parentClassName="pb-32 bg-white w-full">
          <div
            data-orientation="horizontal"
            role="none"
            className="shrink-0 bg-border h-[1px] w-full my-6"
          ></div>
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="px-4 -mx-4 lg:w-1/5">
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
                          <p>Check all form fields and click proceed.</p>
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
            </aside>
            <div className="flex-1 lg:max-w-2xl">
              <div
                className={cn('space-y-6 hidden', currentTab == 0 && 'block')}
              >
                <div>
                  <h3 className="text-lg text-slate-800 font-medium">
                    Order details
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Kindly fill out all the required fields.
                  </p>
                </div>
                <Separator />
                <OrderDetailsForm
                  storedata={storedata}
                  order={null}
                  proceedWithData={(data) => {
                    setOrderDetails(data)
                    setCurrentTab(1)
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
                                    (std: StoreDataType) => std.level === value,
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
                                        ).reduce((acc, [key, value]) => {
                                          const getObj = () => {
                                            if (
                                              key.toLowerCase().includes('hour')
                                            ) {
                                              return {
                                                [parseInt(key).toString()]:
                                                  value,
                                              }
                                            } else {
                                              const futureDate = addDays(
                                                new Date(),
                                                parseInt(key),
                                              )
                                              const currentDate = new Date()
                                              const newKey = differenceInHours(
                                                futureDate,
                                                currentDate,
                                              )
                                              return {
                                                [newKey.toString()]: value,
                                              }
                                            }
                                          }

                                          if (
                                            differenceInHours(to, from) >=
                                            parseInt(Object.keys(getObj())[0])
                                          ) {
                                            acc = key
                                          }

                                          return acc
                                        }, '')
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
                                value: value.length.toString(),
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
                                      differenceInDays(value.to, value.from) > 0
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
                    setExtraOptions(() =>
                      Object.entries(data).reduce(
                        (accumulator: typeof extraOptions, currentValue) => {
                          const [key, value] = currentValue
                          if (value !== undefined) {
                            // switch statement for price effectors
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
            <OrderSummary
              options={[...options, ...extraOptions]}
              totalAmount={totalAmount}
              orderId={orderId}
              setCheckout={() => {
                setCheckout(!checkout)
              }}
            />
          </div>
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
