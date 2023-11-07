import Image from 'next/image'
import { Toaster } from '@/components/ui/toaster'
import { Inter, Lexend } from 'next/font/google'
import Head from 'next/head'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Container } from '@/components/Container'
import HeroArt from '@/components/HeroArt'
import { StarIcon } from '@heroicons/react/24/solid'
import classNames from '../../libs/utils/ClassNames'
import PaymentIcons from '@/components/PaymentIcons'
import PriceCalc from '@/components/PriceCalc'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Fragment, useEffect, useState } from 'react'
import mongoClient from '../../libs/mongodb'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'

const { clientPromise } = mongoClient

type ConnectionStatus = {
  isConnected: boolean
}

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await clientPromise
    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

const lexend = Lexend({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

  const writers = [
    {
      name: 'Dr. Shayla',
      profile_image: '/person3.png',
      orders_complete: 400,
      rating: 4.9,
      reviewCount: 189,
      featured_work: [
        {
          title: 'Should Juveniles Be Tried As Adults',
          paper_type: 'Essay (Any Type)',
          subject: 'Literature',
          style: 'APA',
          sources: 1,
          image: '/img.png',
        },
      ],
    },
    {
      name: 'Prof.Jordana K',
      profile_image: '/person1.png',
      orders_complete: 500,
      rating: 4.9,
      reviewCount: 560,
      featured_work: [
        {
          title: 'Should Juveniles Be Tried As Adults',
          paper_type: 'Essay (Any Type)',
          subject: 'Literature',
          style: 'APA',
          sources: 1,
          image: '/img.png',
        },
      ],
    },
    {
      name: 'Dr. Calvin',
      profile_image: '/person2.png',
      orders_complete: 700,
      rating: 4.9,
      reviewCount: 352,
      featured_work: [
        {
          title: 'Should Juveniles Be Tried As Adults',
          paper_type: 'Essay (Any Type)',
          subject: 'Literature',
          style: 'APA',
          sources: 1,
          image: '/img.png',
        },
      ],
    },
  ]

  const FAQ = [
    {
      name: 'Who are essay dons?',
      description: `
          In recent years, there has been rising demand among students for online homework help.
           Owing to this demand, Essaydons.com was established with an aim to offer high quality homework help services to anyone that came knocking our door.
            We are one of those companies that have been of great help to many students for the past eight years. Over time we have built trust among our clients through continuously providing high-quality homework help services.
             So far we have served over forty thousand clients in different fields of study.
           The company has recruited over three hundred professional writers to ensure that you always have a writer to personally attend to any of your homework needs.
      `,
    },
    {
      name: 'About free inquiry?',
      description: `We're an expert essay writing service that offers a wealth of academic writing experience to students from all over the world. We aim to match the most qualified essay writer to your order, and for that, we hire the most seasoned essay writers from various disciplines.
Quality is our top priority, so you can rest assured that every order you place via our website will be completed on the highest level possible. To order your first essay with us, simply fill out an order form, pay for the piece, and get in touch with the assigned essay writer.`,
    },
    {
      name: 'Is your service legal?',
      description: `Quality is our top priority, so you can rest assured that every order you place via our website will be completed on the highest level possible. To order your first essay with us, simply fill out an order form, pay for the piece, and get in touch with the assigned essay writer.
Make sure to familiarize yourselves with our Guarantees should you have any doubts or questions. And feel free to contact us via our 24/7 chat support: our team is working around-the-clock helping you with any issues you might face.`,
    },
    {
      name: 'Do you have any discounts?',
      description: `
      We're an expert essay writing service that offers a wealth of academic writing experience to students from all over the world. We aim to match the most qualified essay writer to your order, and for that, we hire the most seasoned essay writers from various disciplines.
Make sure to familiarize yourselves with our Guarantees should you have any doubts or questions. And feel free to contact us via our 24/7 chat support: our team is working around-the-clock helping you with any issues you might face.`,
    },
    {
      name: 'Which formats do you provide?',
      description: `We're an expert essay writing service that offers a wealth of academic writing experience to students from all over the world. We aim to match the most qualified essay writer to your order, and for that, we hire the most seasoned essay writers from various disciplines.`,
    },
    {
      name: 'How will i receive the complete paper?',
      description: `Expert essay writing service that offers a wealth of academic writing experience to students from all over the world. We aim to match the most qualified essay writer to your order, and for that, we hire the most seasoned essay writers from various disciplines.`,
    },
  ]

  const [selected, setSelected] = useState(FAQ[0])

  return (
    <div className="relative">
      <Head>
        <title>PROCTOR OWLS</title>
        <meta name="description" content="We take proctored exams for you" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={classNames(
          inter.className,
          'flex min-h-screen flex-col items-center justify-between relative',
        )}
      >
        <Navigation />
        <div className="w-full bg-gradient-radial from-plumes to-bermuda -mt-44 md:-mt-44 lg:-mt-28">
          <Container className="xl:px-0 pb-24 pt-56 lg:pt-44 lg:pb-36">
            <div className="lg:grid lg:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h1
                  className={classNames(
                    lexend.className,
                    'text-4xl text-center lg:text-left md:text-5xl lg:text-7xl text-white font-medium leading-tight tracking-tight py-2 lg:py-0',
                  )}
                >
                  Professional Essay & Academic Writers
                </h1>
                <p className="py-6 max-w-2xl text-lg tracking-tight text-white/80">
                  We write your papers - you get top grades!
                </p>
                <Link
                  href="/order/create"
                  className="bg-teal-300 w-44 py-3 px-8 text-xl rounded-full text-black font-semibold hidden lg:inline-block mt-4 transform hover:scale-105 transition ease-in-out duration-100"
                >
                  Order Now
                </Link>
              </div>
              <div className="flex justify-center lg:justify-end">
                <HeroArt className="h-1/2 lg:w-full lg:h-full" />
              </div>
            </div>
          </Container>
        </div>

        <Container className="xl:px-0 pb-28 pt-20 sm:py-32">
          <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
            <h2
              className={classNames(
                lexend.className,
                'text-3xl tracking-tight sm:text-4xl md:text-5xl text-bermuda text-center',
              )}
            >
              Choose Your Writer
            </h2>
            <p className="mt-6 text-lg tracking-tight text-slate-600">
              EssayDon expert writers are online and available for hire. Read
              through their profiles, and sample assignments to find your
              perfect match.
            </p>
          </div>
          <div className="mt-16 flex flex-col lg:flex-row">
            <div className="flex flex-col items-center justify-center pb-16 lg:pr-4 lg:pb-0">
              <button type={'button'}>
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M30 41.6666L34.0834 37.5833L29.4167 32.9166L41.6667 32.9166L41.6667 27.0833H29.4167L34.0834 22.4166L30 18.3333L18.3334 30L30 41.6666ZM30 59.1666C25.9653 59.1666 22.1737 58.4005 18.625 56.8683C15.0764 55.338 11.9896 53.2604 9.36463 50.6354C6.73963 48.0104 4.66199 44.9236 3.13171 41.375C1.59949 37.8264 0.833374 34.0347 0.833374 30C0.833374 25.9653 1.59949 22.1736 3.13171 18.625C4.66199 15.0764 6.73963 11.9896 9.36463 9.36456C11.9896 6.73956 15.0764 4.66095 18.625 3.12873C22.1737 1.59845 25.9653 0.833313 30 0.833313C34.0348 0.833313 37.8264 1.59845 41.375 3.12873C44.9237 4.66095 48.0105 6.73956 50.6355 9.36456C53.2605 11.9896 55.3381 15.0764 56.8684 18.625C58.4006 22.1736 59.1667 25.9653 59.1667 30C59.1667 34.0347 58.4006 37.8264 56.8684 41.375C55.3381 44.9236 53.2605 48.0104 50.6355 50.6354C48.0105 53.2604 44.9237 55.338 41.375 56.8683C37.8264 58.4005 34.0348 59.1666 30 59.1666Z"
                    fill="#0f80de"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 grid lg:gap-16 space-y-16 lg:space-y-0 lg:grid-cols-3 max-w-6xl mx-auto">
              {writers.map((writer, index) => (
                <Link
                  key={index}
                  href="/"
                  className="group rounded-lg mx-auto max-w-xs border px-5 py-4 border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30"
                >
                  <div className="flex-1 flex relative pb-4 border-b">
                    <div className="mr-6">
                      <Image
                        src={writer.profile_image}
                        alt="writer 1"
                        width={77}
                        height={77}
                        priority
                      />
                    </div>
                    <div>
                      <h4
                        className={classNames(
                          lexend.className,
                          'text-lg font-semibold leading-none',
                        )}
                      >
                        {writer.name}
                      </h4>
                      <p className="text-sm leading-tight py-2">
                        Completed order: {writer.orders_complete}
                      </p>
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={classNames(
                              writer.rating > rating
                                ? 'text-yellow-400'
                                : 'text-gray-200',
                              'flex-shrink-0 h-5 w-5',
                            )}
                            aria-hidden="true"
                          />
                        ))}
                        <span className={classNames(lexend.className)}>
                          {writer.rating} ({writer.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>
                  {writer.featured_work.map((work, i) => (
                    <div key={i} className="flex flex-col">
                      <h5
                        className={classNames(
                          lexend.className,
                          'font-semibold text-slate-700 text-sm leading-tight text-center pt-3',
                        )}
                      >
                        {work.title}
                      </h5>
                      <div className="grid grid-cols-2 pt-5">
                        <div className="flex flex-col space-y-5">
                          <div className="">
                            <p className="text-xs capitalize">paper type:</p>
                            <p className="text-xs font-semibold text-black capitalize">
                              {work.paper_type}
                            </p>
                          </div>
                          <div className="">
                            <p className="text-xs capitalize">subject:</p>
                            <p className="text-xs font-semibold text-black capitalize">
                              {work.subject}
                            </p>
                          </div>
                          <div className="grid grid-cols-2">
                            <div>
                              <p className="text-xs capitalize">style:</p>
                              <p className="text-xs font-semibold text-black capitalize">
                                {work.style}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs capitalize">sources:</p>
                              <p className="text-xs font-semibold text-black capitalize">
                                {work.sources}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Image
                            className="ml-auto"
                            src={work.image}
                            alt="essay"
                            width={107}
                            height={151}
                            priority
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="bg-bermuda rounded-full text-white text-sm font-semibold py-3 mt-4"
                      >
                        <span className="">Hire Writer</span>
                      </button>
                    </div>
                  ))}
                </Link>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center pt-16 lg:pl-4 lg:pt-0">
              <button type={'button'}>
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M30.0001 18.3334L25.9167 22.4167L30.5834 27.0834L18.3334 27.0834L18.3334 32.9167L30.5834 32.9167L25.9167 37.5834L30.0001 41.6667L41.6667 30L30.0001 18.3334ZM30.0001 0.833356C34.0348 0.833357 37.8265 1.59947 41.3751 3.13169C44.9237 4.66197 48.0105 6.7396 50.6355 9.3646C53.2605 11.9896 55.3381 15.0764 56.8684 18.625C58.4006 22.1736 59.1668 25.9653 59.1668 30C59.1668 34.0347 58.4006 37.8264 56.8684 41.375C55.3381 44.9236 53.2605 48.0104 50.6355 50.6354C48.0105 53.2604 44.9237 55.339 41.3751 56.8713C37.8265 58.4015 34.0348 59.1667 30.0001 59.1667C25.9654 59.1667 22.1737 58.4015 18.6251 56.8713C15.0765 55.339 11.9897 53.2604 9.36466 50.6354C6.73966 48.0104 4.66202 44.9236 3.13174 41.375C1.59952 37.8264 0.833411 34.0347 0.833411 30C0.833411 25.9653 1.59952 22.1736 3.13174 18.625C4.66203 15.0764 6.73966 11.9896 9.36466 9.3646C11.9897 6.7396 15.0765 4.66196 18.6251 3.13169C22.1737 1.59946 25.9654 0.833356 30.0001 0.833356Z"
                    fill="#0f80de"
                  />
                </svg>
              </button>
            </div>
          </div>
        </Container>

        <div className="bg-reef w-full">
          <Container className="xl:px-0 pb-28 pt-20 sm:py-32">
            <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
              <h2
                className={classNames(
                  lexend.className,
                  'text-3xl tracking-tight sm:text-4xl md:text-5xl text-bermuda text-center',
                )}
              >
                How To Place An Order
              </h2>
            </div>
            <div className="mt-32 mb-20 grid lg:gap-8 lg:grid-cols-4 space-y-16 lg:space-y-0 mx-auto relative">
              <div className="flex flex-col">
                <div className="flex-1 flex items-center justify-center pb-11">
                  <Image
                    className="overflow-hidden z-10"
                    src={'/image 10.png'}
                    alt="how to place your order 1"
                    width={151}
                    height={151}
                    priority
                  />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <h6
                    className={classNames(
                      lexend.className,
                      'text-center font-semibold text-slate-900 text-xl pb-1.5',
                    )}
                  >
                    1. Submit instructions
                  </h6>
                  <p className="text-center text-lg font-light">
                    Fill out an order form and include as much detail as
                    possible.
                  </p>
                </div>
              </div>
              <div className="flex flex-col-reverse lg:flex-col">
                <div className="flex-1 flex flex-col items-center justify-center pb-0 lg:pb-11">
                  <h6
                    className={classNames(
                      lexend.className,
                      'text-center font-semibold text-slate-900 text-xl pb-1.5',
                    )}
                  >
                    2. Choose writer
                  </h6>
                  <p className="text-center text-lg font-light">
                    Pick a writer or leave it to our AI matching system, then
                    add funds
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center pb-11 lg:pb-0">
                  <Image
                    className="overflow-hidden z-10"
                    src={'/image 11.png'}
                    alt="how to place your order 2"
                    width={151}
                    height={151}
                    priority
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex-1 flex items-center justify-center pb-11">
                  <Image
                    className="overflow-hidden z-10"
                    src={'/image 12.png'}
                    alt="how to place your order 3"
                    width={151}
                    height={151}
                    priority
                  />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <h6
                    className={classNames(
                      lexend.className,
                      'text-center font-semibold text-slate-900 text-xl pb-1.5',
                    )}
                  >
                    3. Track order
                  </h6>
                  <p className="text-center text-lg font-light">
                    Check the status of your order or chat with your writer at
                    any time.
                  </p>
                </div>
              </div>
              <div className="flex flex-col-reverse lg:flex-col">
                <div className="flex-1 flex flex-col items-center justify-center pb-0 lg:pb-11">
                  <h6
                    className={classNames(
                      lexend.className,
                      'text-center font-semibold text-slate-900 text-xl pb-1.5',
                    )}
                  >
                    4. Check paper
                  </h6>
                  <p className="text-center text-lg font-light">
                    Revise your paper and release funds to the writer when
                    you’re satisfied.
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center pb-11 lg:pb-0">
                  <Image
                    className="overflow-hidden z-10"
                    src={'/image 13.png'}
                    alt="how to place your order 4"
                    width={151}
                    height={151}
                    priority
                  />
                </div>
              </div>
              <div className="absolute w-full h-full hidden lg:flex items-center justify-center">
                <Image
                  className="w-2/3"
                  src={'/img_1.png'}
                  alt="how to place your order 1"
                  width={868.5}
                  height={192.74}
                  priority
                />
              </div>
            </div>
          </Container>
        </div>

        <Container className="xl:px-0 pb-28 pt-20 sm:py-32">
          <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
            <h2
              className={classNames(
                lexend.className,
                'text-3xl tracking-tight sm:text-4xl md:text-5xl text-bermuda text-center',
              )}
            >
              Proctor Owl Activity
            </h2>
          </div>
          <div className="mt-16 grid gap-12 space-y-16 lg:space-y-0 lg:grid-cols-2 mx-auto">
            <div className="flex items-center justify-center">
              <div className="space-y-3">
                <h1
                  className={classNames(
                    lexend.className,
                    'font-semibold text-8xl text-bermuda',
                  )}
                >
                  95,000
                </h1>
                <p>completed orders</p>
              </div>
            </div>
            <div className="flex flex-col space-y-6">
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <h1
                    className={classNames(
                      lexend.className,
                      'font-bold text-6xl text-bermuda',
                    )}
                  >
                    512
                  </h1>
                  <p>Professional Writers</p>
                </div>
                <div>
                  <h1
                    className={classNames(
                      lexend.className,
                      'font-bold text-6xl text-bermuda',
                    )}
                  >
                    60
                  </h1>
                  <p>Writers Online</p>
                </div>
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <h1
                    className={classNames(
                      lexend.className,
                      'font-bold text-6xl text-bermuda',
                    )}
                  >
                    12
                  </h1>
                  <p>Support Staff Online</p>
                </div>
                <div>
                  <h1
                    className={classNames(
                      lexend.className,
                      'font-bold text-6xl text-bermuda',
                    )}
                  >
                    4.9/5
                  </h1>
                  <p>Average Writer’s Score</p>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <div className="w-full bg-gradient-radial from-plumes to-bermuda">
          <Container className="xl:px-0 py-32">
            <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-2 max-w-6xl mx-auto">
              <div className="col-span-1">
                <h1
                  className={classNames(
                    lexend.className,
                    'text-white font-bold text-[52px] tracking-tight leading-[63px] capitalize pb-2',
                  )}
                >
                  Find out what your paper will cost
                </h1>
                <p className="my-6 text-white/80 font-normal text-xl">
                  Prices start at $13.5 for writing and $8.5 for editing.
                </p>
                <ul
                  role="list"
                  className="pt-4 space-x-2 flex items-center justify-start"
                >
                  <li>
                    <PaymentIcons name={'visa'} />
                  </li>
                  <li>
                    <PaymentIcons name={'master-card'} />
                  </li>
                  <li>
                    <PaymentIcons name={'union'} />
                  </li>
                </ul>
              </div>
              <div className="col-span-1 flex justify-center lg:justify-end">
                <PriceCalc />
              </div>
            </div>
          </Container>
        </div>

        <Container className="xl:px-0 pb-20">
          <div className="space-y-2 pt-20 pb-16">
            <h2
              className={classNames(
                lexend.className,
                'text-4xl max-w-xl mx-auto font-bold leading-none text-gray-900 text-center capitalize',
              )}
            >
              Reviews, comments, and love from papers owl customers and
              community
            </h2>
          </div>
          <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-1 max-w-5xl mx-auto">
            <figure className="md:flex rounded-xl p-8 md:p-0 bg-reef">
              <div className="p-6">
                <Image
                  className="w-24 h-24 md:w-56 md:h-auto md:rounded-none rounded-full mx-auto"
                  src="/img_2.png"
                  alt=""
                  width="384"
                  height="512"
                />
              </div>
              <div className="pt-6 md:p-8 text-center md:text-left space-y-4">
                <blockquote>
                  <span className="flex">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          4.9 > rating ? 'text-yellow-400' : 'text-gray-200',
                          'flex-shrink-0 h-5 w-5',
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                  <h5 className="text-lg font-semibold text-black">
                    Paper was written before the deadline.
                  </h5>
                  <p className="text-lg font-medium pt-2">
                    “Prof. Alicia is very professional and I am happy about her
                    work. She helped me a lot and saved me a huge amount of
                    time. I will be very happy to contact her for future
                    academic work again”
                  </p>
                </blockquote>
                <figcaption className="font-medium">
                  <div className="text-sky-500 dark:text-sky-400">
                    Callie D.
                  </div>
                  <div className="text-slate-700 dark:text-slate-500">
                    January 5, 2023
                  </div>
                </figcaption>
              </div>
            </figure>
          </div>
        </Container>

        <div className="bg-reef w-full">
          <Container className="xl:px-0 pb-20">
            <div className="space-y-2 pt-20 pb-16">
              <h2
                className={classNames(
                  lexend.className,
                  'text-5xl font-bold leading-none text-bermuda text-center',
                )}
              >
                Guarantees
              </h2>
              <p className="lg:text-md lg:max-w-lg mx-auto text-center text-gray-900">
                We offer quick and transparent support.
              </p>
            </div>
            <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-3 max-w-6xl mx-auto">
              <figure className="relative flex flex-col-reverse bg-slate-50 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5">
                <blockquote className="mt-6 text-slate-700 dark:text-slate-300">
                  <h5 className="font-bold text-2xl">100% money back</h5>
                  <p>Legitimate claims will be refunded</p>
                </blockquote>
                <figcaption className="flex items-center space-x-4">
                  <Image
                    src="/img_3.png"
                    alt=""
                    className="flex-none w-14 h-14 rounded-full object-cover"
                    loading="lazy"
                    width={96}
                    height={96}
                    decoding="async"
                  />
                </figcaption>
              </figure>
              <figure className="relative flex flex-col-reverse bg-slate-50 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5">
                <blockquote className="mt-6 text-slate-700 dark:text-slate-300">
                  <h5 className="font-bold text-2xl">Free revisions</h5>
                  <p>Get your worked revised on request</p>
                </blockquote>
                <figcaption className="flex items-center space-x-4">
                  <Image
                    src="/img_4.png"
                    alt=""
                    className="flex-none w-14 h-14 rounded-full object-cover"
                    loading="lazy"
                    width={96}
                    height={96}
                    decoding="async"
                  />
                </figcaption>
              </figure>
              <figure className="relative flex flex-col-reverse bg-slate-50 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5">
                <blockquote className="mt-6 text-slate-700 dark:text-slate-300">
                  <h5 className="font-bold text-2xl">Safe payments</h5>
                  <p>authentic payment processors</p>
                </blockquote>
                <figcaption className="flex items-center space-x-4">
                  <Image
                    src="/img_5.png"
                    alt=""
                    className="flex-none w-14 h-14 rounded-full object-cover"
                    loading="lazy"
                    width={96}
                    height={96}
                    decoding="async"
                  />
                </figcaption>
              </figure>
            </div>
          </Container>
        </div>

        <div className="w-full bg-gradient-radial from-plumes to-bermuda">
          <Container className="xl:px-0 pb-20">
            <div className="space-y-2 pt-20 pb-16">
              <h2
                className={classNames(
                  lexend.className,
                  'text-white font-bold text-[52px] tracking-tight leading-[63px] capitalize text-center',
                )}
              >
                Why Choose Us
              </h2>
              <p className="md:text-md md:max-w-xs mx-auto text-center text-white ">
                We guide you through your toughest academic task.
              </p>
            </div>
            <div className="space-y-32 flex flex-col items-center">
              <div className="grid space-y-16 md:gap-16 md:space-y-0 md:grid-cols-3 mx-auto">
                <div className="block">
                  <h6 className="text-center text-white font-semibold text-xl pb-1.5 capitalize">
                    we understand your style
                  </h6>
                  <p className="text-center text-xl text-white font-normal">
                    Our seasoned writers can imitate your desired style
                  </p>
                </div>

                <div className="block">
                  <h6 className="text-center text-white font-semibold text-xl pb-1.5 capitalize">
                    Young and Ambitious
                  </h6>
                  <p className="text-center text-xl text-white font-normal">
                    We break away from huge conglomerates whose interest is in
                    your dollar
                  </p>
                </div>

                <div className="block">
                  <h6 className="text-center text-white font-semibold text-xl pb-1.5 capitalize">
                    We take data privacy seriously
                  </h6>
                  <p className="text-center text-xl text-white font-normal">
                    Our seasoned writers can imitate your desired style
                  </p>
                </div>
              </div>
              <div className="grid space-y-16 md:gap-16 lg:space-y-0 lg:grid-cols-3 mx-auto">
                <div className="block">
                  <h6 className="text-center text-white font-semibold text-xl pb-1.5 capitalize">
                    High quality for affordable prices
                  </h6>
                  <p className="text-center text-xl text-white font-normal">
                    High-quality content for the most affordable prices on the
                    market
                  </p>
                </div>

                <div className="block">
                  <h6 className="text-center text-white font-semibold text-xl pb-1.5 capitalize">
                    Any subject, any deadline
                  </h6>
                  <p className="text-center text-xl text-white font-normal">
                    We will meet your expectations, just hire an essay writer
                    and take a look
                  </p>
                </div>

                <div className="block">
                  <h6 className="text-center text-white font-semibold text-xl pb-1.5 capitalize">
                    Quality Samples
                  </h6>
                  <p className="text-center text-xl text-white font-normal">
                    Some of the best work of our experienced essay writers
                  </p>
                </div>
              </div>
              <Link
                href="/order/create"
                className="bg-teal-300 rounded-md text-white py-3 px-12"
              >
                <span className="font-bold text-black">Order Now</span>
              </Link>
            </div>
          </Container>
        </div>

        <Container className="xl:px-0 pb-20">
          <div className="space-y-4 pt-20 pb-8">
            <h2
              className={classNames(
                lexend.className,
                'text-5xl max-w-2xl mx-auto font-bold leading-none text-bermuda text-center capitalize',
              )}
            >
              Frequently Asked Questions about Custom Writing.
            </h2>
            <p className="text-2xl lg:max-w-lg mx-auto text-center tracking-tight text-slate-600">
              What to expect in this virtual service?
            </p>
          </div>
          <div className="grid space-y-16 md:gap-16 md:space-y-0 md:grid-cols-10 max-w-7xl mx-auto bg-gray-50 px-2 md:px-8 py-8 rounded-2xl">
            <div className="col-span-12 md:col-span-4">
              <Listbox value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate font-medium text-lg text-center md:text-left">
                      {selected.name}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-250"
                    leaveFrom="transform translate-y-2"
                    leaveTo="transform translate-y-0"
                    enter="transition ease-in duration-250"
                    enterFrom="transform translate-y-0"
                    enterTo="transform translate-y-2"
                  >
                    <Listbox.Options className="block overflow-auto mt-4 px-2">
                      {FAQ.map((faq, faqIdx) => (
                        <Listbox.Option
                          key={faqIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 ${
                              active
                                ? 'bg-amber-100 text-amber-900'
                                : 'text-gray-900'
                            }`
                          }
                          value={faq}
                        >
                          {() => (
                            <>
                              <span
                                className={`block truncate text-center md:text-left ${
                                  selected.name == faq.name
                                    ? 'font-medium'
                                    : 'font-normal'
                                }`}
                              >
                                {faq.name}
                              </span>
                              {selected.name == faq.name ? (
                                <span className="absolute inset-y-0 right-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            <div className="col-span-12 md:col-span-6">
              <p className="font-normal text-lg text-center md:text-left">
                {selected.description}
              </p>
            </div>
          </div>
        </Container>

        <div className="w-full bg-reef">
          <Container className="xl:px-0 pb-20 bg-reef">
            <div className="space-y-2 pt-20 pb-16">
              <h2
                className={classNames(
                  lexend.className,
                  'text-4xl max-w-xl mx-auto font-bold leading-none tracking-tight text-gray-900 text-center',
                )}
              >
                Do You Need an Essay Writer?
              </h2>
              <p className="text-2xl lg:max-w-lg mx-auto text-center tracking-tight text-slate-600">
                What to expect in this virtual service?
              </p>
              <p className="max-w-5xl mx-auto text-center text-slate-600 pt-6">
                Can’t remember the last time you went out with your friends for
                a cup of tea? Do you feel like your tutors are completely
                oblivious of the fact that you have a life outside of college?
                Can’t deal with yet another academic piece you have to compose
                overnight? You are not alone! Thousands of students from all
                over the world feel the same way about their studying. However,
                the smartest of them choose to seek our custom essay writing
                service whenever they get overwhelmed with their education. Just
                think about it. No more sleepless nights! No more rush and
                gallons of coffee to keep you awake again and again. Just drop
                us a line and our essay writers will be on their way to craft an
                A+ piece for you whenever needed day or night. Your top-notch
                essay is just one click away. Do not lose your chance for top
                grades with the help of a professional essay writing service. No
                matter what subject you need an essay for, we have got it all
                covered.
              </p>
            </div>
            <div className="space-y-6 mx-auto max-w-6xl">
              <div className="flex flex-col">
                <h5 className="font-bold text-2xl text-bermuda">
                  Our Unique Features
                </h5>
                <p className="pt-4">
                  After years in this business, we know for sure what a student
                  needs from an online essay writing service. We have fine-tuned
                  our services to these needs to stay on top of things. Meet an
                  extensive list of every single feature that makes us unique
                  and outstanding. And believe us, we are not bragging. We are
                  just being realistic
                </p>
              </div>
              <div className="flex flex-col">
                <h5 className="font-bold text-2xl text-bermuda">
                  A massive team of online essay writers.
                </h5>
                <p className="pt-4">
                  We do our best to hire as many talents on our as possible. We
                  scan each resume that comes our way to ensure that not one
                  excellent essay writer is left unnoticed. Our team consists of
                  dozens of experts from various fields and backgrounds. And all
                  this is done to meet the growing demand for quality online
                  ghost writing.
                </p>
              </div>
              <div className="flex flex-col">
                <h5 className="font-bold text-2xl text-bermuda">
                  Reasonable prices.
                </h5>
                <p className="pt-4">
                  We aim to establish prices that will both motivate the essay
                  writers and not leave our customers wanting. Affordability is
                  at the core of our principles, so be sure you will not have to
                  rob the bank to get your piece written by our experts.
                </p>
              </div>
              <div className="flex flex-col">
                <h5 className="font-bold text-2xl text-bermuda">
                  100% originality.
                </h5>
                <p className="pt-4">
                  Yes, we do have a substantial base of ready-made essays. But
                  rest assured: we craft each new essay from scratch. Knowing
                  how bad plagiarism is to your good name at school, we avoid it
                  by all means and check each paper for its instances...
                </p>
              </div>
              <div className="flex flex-col">
                <h5 className="font-bold text-2xl text-bermuda">
                  Excellent quality-price ratio.
                </h5>
                <p className="pt-4">
                  When you pay us to write your essay, you are practically
                  investing fair money into top college grades. With our help,
                  you get to stretch a buck and meet every single deadline at
                  school without sacrificing your sleep, social life, and sanity
                </p>
              </div>
              <div className="flex flex-col">
                <h5 className="font-bold text-2xl text-bermuda">
                  How It Works
                </h5>
                <p className="pt-4">
                  By now, you might probably be looking for ways to place your
                  first order. If so, then we’ve got fantastic news for you! It
                  will only take a couple of minutes.
                </p>
              </div>
              <div className="flex flex-col">
                <h5 className="font-bold text-2xl text-bermuda">
                  Why Choose us
                </h5>
                <p className="pt-4">
                  Well, there are multiple reasons for it. The most important
                  among them include but are not limited to:
                </p>
              </div>
              <div className="flex flex-col">
                <h5 className="font-bold text-2xl text-bermuda">
                  Plagiarism Free Assignments.
                </h5>
                <p className="pt-4">
                  All our services are 100% original content, expect no trace of
                  plagiarism in any of your assignments handled by our competent
                  homework writers. The company has clear guidelines and rules
                  on plagiarism which our writers have always been keen to
                  adhere to. The level of discipline and commitment our writers
                  have has ensured that essaydons.com never gets to deal with
                  any plagiarism case for all the time we have been in the
                  homework help service industry. With the advancement of
                  plagiarism checking tools, it is even hard for us to submit
                  plagiarised work to you as our quality assurance team pass all
                  your assignments through these plagiarism checking tools
                  before your assignment is uploaded to you.
                </p>
              </div>
              <div className="flex flex-col">
                <h5 className="font-bold text-2xl text-bermuda">
                  Professional writing team.
                </h5>
                <p className="pt-4">
                  Our team of writers has been hired after a thorough
                  recruitment exercise conducted after every two years. We want
                  to ensure consistency, and for this reason, we like to train
                  and perfect on the writers we have as opposed to having new
                  writers in the company every other month, which will certainly
                  not work in favour of the company’s standards.
                </p>
              </div>
              <div className="flex flex-col">
                <h5 className="font-bold text-2xl text-bermuda">
                  Timely delivery.
                </h5>
                <p className="pt-4">
                  Your assignment will be delivered on time. We know the
                  implications late assignment submission could have on your
                  academic life, for this reason, we will ensure that you get to
                  submit all your assignments in time by having our writers
                  upload to you your homework in good time to allow you go
                  through your homework and have any necessary corrections made
                  on it by your homework writer. All we ask of you is to simply
                  place your order with us right away for our writers to
                  immediately start working on it. Timely order requests allow
                  our writers to have ample time and less pressure working on
                  your assignments. It is not late, place your order now.
                </p>
              </div>
              <div className="flex flex-col">
                <h5 className="font-bold text-2xl text-bermuda">
                  High quality.
                </h5>
                <p className="pt-4">
                  Our writers have gained industry experience in their various
                  fields of expertise. Therefore, they not only apply academic
                  knowledge to your homework but also add a professional touch
                  to it. Essaydons.com assures you that your assignment is in
                  the best hands and brains. Our quality assurance team also
                  conducts training and tests on our writers to ensure that
                  essaydons.com homework quality standards are always met by our
                  writers.
                </p>
              </div>
              <div className="flex flex-col">
                <h5 className="font-bold text-2xl text-bermuda">
                  Round-the-clock support.
                </h5>
                <p className="pt-4">
                  You can always get your homework needs tended to 24/7
                  regardless of your location. Essaydons.com has hired enough
                  writers and support personnel to ensure that you do not have
                  to wait to get your homework needs attended to. Our response
                  from both our writers and customer support is prompt and comes
                  as soon as you reach out to us. Our 24/7 availability has
                  especially been of great help to students with urgent homework
                  needs. Place your homework order with us anytime you wish. It
                  does not matter how close you are to your deadline; we will
                  effectively work on your assignment and deliver high-quality
                  homework help to you and on time.
                </p>
              </div>
            </div>
          </Container>
        </div>

        <Container className="xl:px-0 pb-20">
          <div className="space-y-2 pt-20 pb-16">
            <h2
              className={classNames(
                lexend.className,
                'text-4xl max-w-xl mx-auto font-bold leading-none text-gray-900 text-center',
              )}
            >
              What You Get in the End
            </h2>
            <p className="text-2xl lg:max-w-lg mx-auto text-center text-bermuda">
              We get you quality grades.
            </p>
            <div className="max-w-5xl mx-auto md:grid md:grid-cols-2 md:gap-12 pt-12">
              <p className="text-left text-slate-600 pt-6">
                Wondering why you should order an essay at our essay writing
                service? “What’s in it for me?” you might wonder. It’s a fair
                question! Here are several results of choosing to order a piece
                online. We are sure, they will speak louder than any of our
                words:
              </p>

              <div className="flex justify-center items-center">
                <Image
                  src="/illustrations1.png"
                  alt="writer 1"
                  width={548}
                  height={247}
                  priority
                />
              </div>
            </div>
          </div>
          <div className="space-y-6 mx-auto max-w-6xl">
            <div className="flex flex-col">
              <h5 className="font-bold text-2xl text-bermuda">Top Grades.</h5>
              <p className="pt-4">
                They are important. After all, we are all striving to achieve
                the highest grades. They have the potential to directly
                influence what jobs we get in the future. That is why it is in
                your best interest to hire a professional essay writing service
                to compose a decent piece.
              </p>
            </div>

            <div className="flex flex-col">
              <h5 className="font-bold text-2xl text-bermuda">
                A happy professor.
              </h5>
              <p className="pt-4">
                Don&apos;t look surprised! Earning a good reputation in the eyes
                of your college professor is vital, since in many cases your
                reputation will work for you even when you&apos;re far from
                being the best student.
              </p>
            </div>

            <div className="flex flex-col">
              <h5 className="font-bold text-2xl text-bermuda">
                Top-notch paper.
              </h5>
              <p className="pt-4">
                A decent paper can help you get into a college of your dream,
                improve your GPA, or even get you a scholarship. No matter which
                of these you&apos;re pursuing, it&apos;s always a good idea to
                have an essay professionally crafted.
              </p>
            </div>

            <div className="flex flex-col">
              <h5 className="font-bold text-2xl text-bermuda">
                Good social and academic life balance.
              </h5>
              <p className="pt-4">
                It is often essential for students to hire essay writing
                services to craft pieces for them because otherwise, students
                will have no personal life with all the overwhelming academic
                tasks they have to deal with daily. Can&apos;t help but miss
                going out with your friends? We&apos;re here to help! These are
                but a few benefits you get when ordering an essay online instead
                of writing it on your own. Look at this list again and if it
                sounds ike something you&apos;d like to take advantage of right
                now, drop us a line!
              </p>
            </div>
          </div>
        </Container>

        <div className="w-full bg-gradient-radial from-plumes to-bermuda">
          <Container className="xl:px-0 pb-20">
            <div className="space-y-2 pt-20 pb-16">
              <h2
                className={classNames(
                  lexend.className,
                  'text-white font-bold text-[52px] tracking-tight leading-[63px] capitalize text-center',
                )}
              >
                Blog
              </h2>
              <p className="text-2xl lg:max-w-lg mx-auto text-center text-white">
                Read about matters writing.
              </p>
            </div>
            <div className="grid space-y-16 md:gap-16 md:space-y-0 md:grid-cols-2 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Image
                    className="ml-auto"
                    src="/image15.png"
                    alt="essay"
                    width={107}
                    height={151}
                    priority
                  />
                </div>
                <div className="flex flex-col max-w-xs">
                  <h6 className="text-center text-white font-semibold text-xl pb-1.5 capitalize">
                    Steps Towards Mastering Proposal Essay Writing
                  </h6>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Image
                    className="ml-auto"
                    src="/image15.png"
                    alt="essay"
                    width={107}
                    height={151}
                    priority
                  />
                </div>
                <div className="flex flex-col max-w-xs">
                  <h6 className="text-center text-white font-semibold text-xl pb-1.5 capitalize">
                    How to write a character analysis essay?
                  </h6>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Image
                    className="ml-auto"
                    src="/image15.png"
                    alt="essay"
                    width={107}
                    height={151}
                    priority
                  />
                </div>
                <div className="flex flex-col max-w-xs">
                  <h6 className="text-center text-white font-semibold text-xl pb-1.5 capitalize">
                    How To Write A Character Analysis Essay?
                  </h6>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Image
                    className="ml-auto"
                    src="/image15.png"
                    alt="essay"
                    width={107}
                    height={151}
                    priority
                  />
                </div>
                <div className="flex flex-col max-w-sm">
                  <h6 className="text-center text-white font-semibold text-xl pb-1.5 capitalize">
                    We understand your style
                  </h6>
                </div>
              </div>
            </div>

            <div className="flex justify-center align-center pt-16">
              <Link
                href="/order/create"
                className="bg-teal-300 w-44 py-3 px-8 text-xl rounded-2xl text-black font-semibold hidden lg:inline-block mt-4 transform hover:scale-105 transition ease-in-out duration-100"
              >
                Order Now
              </Link>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
