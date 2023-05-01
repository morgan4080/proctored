import Image from 'next/image'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Logo from '@/components/Logo'
import NavigationMenu from '@/components/NavigationMenu'
import { Container } from '@/components/Container'
import HeroArt from '@/components/HeroArt'
import { StarIcon } from '@heroicons/react/24/solid'
import classNames from '@/Utils/ClassNames'
import PaymentIcons from '@/components/PaymentIcons'
import PriceCalc from '@/components/PriceCalc'
const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export default function Home() {
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
  return (
    <>
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
        <div className="fixed max-w-7xl w-full z-50 py-10 px-4 xl:px-0">
          <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex lg:flex-row-reverse">
            <NavigationMenu />

            <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
              <Link
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0 rounded-2xl backdrop-blur-md"
                href="/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Logo className="w-56 dark:invert text-black" />
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full bg-gradient-radial from-plumes to-bermuda">
          <Container className="xl:px-0 pt-32 pb-24 lg:pt-44 lg:pb-36">
            <div className="lg:grid lg:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl text-center lg:text-left md:text-5xl lg:text-7xl text-white font-black leading-tight tracking-tight py-2 lg:py-0">
                  Professional Essay & Academic Writers
                </h1>
                <p className="text-white opacity-75 text-lg text-center lg:text-left lg:text-2xl py-6 leading-normal">
                  We write your papers - you get top grades!
                </p>
                <button
                  type="button"
                  className="bg-green-400 w-44 py-3 px-8 text-xl rounded-2xl text-white font-semibold hidden lg:inline-block mt-4 transform hover:scale-105 transition ease-in-out duration-100"
                >
                  Order Now
                </button>
              </div>
              <div className="flex justify-center lg:justify-end">
                <HeroArt className="h-1/2 lg:w-full lg:h-full" />
              </div>
            </div>
          </Container>
        </div>

        <Container className="xl:px-0 pb-20">
          <div className="space-y-2 pt-20 pb-16">
            <h2 className="text-5xl font-bold leading-none text-bermuda text-center">
              Choose Your Writer
            </h2>
            <p className="lg:text-md lg:max-w-lg mx-auto text-center text-gray-900">
              EssayDon expert writers are online and available for hire. Read
              through their profiles, and sample assignments to find your
              perfect match.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-col items-center justify-center pb-16 lg:pb-0">
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
                    fill="#36C880"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 grid space-y-16 lg:space-y-0 lg:grid-cols-3 max-w-6xl mx-auto">
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
                      <h4 className="text-lg font-semibold leading-none">
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
                        <span>
                          {writer.rating} ({writer.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>
                  {writer.featured_work.map((work, i) => (
                    <div key={i} className="flex flex-col">
                      <h5 className="font-semibold text-black text-sm leading-tight text-center pt-3">
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
                        className="bg-green-400 rounded-md text-white py-3 mt-4"
                      >
                        <span className="">Hire A Writer</span>
                      </button>
                    </div>
                  ))}
                </Link>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center pt-16 lg:pt-0">
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
                    fill="#36C880"
                  />
                </svg>
              </button>
            </div>
          </div>
        </Container>

        <div className="bg-reef w-full">
          <Container className="xl:px-0 pb-20">
            <div className="space-y-2 pt-20 pb-16">
              <h2 className="text-5xl font-bold leading-none text-bermuda text-center">
                How To Place An Order
              </h2>
            </div>
            <div className="grid lg:gap-8 lg:grid-cols-4 space-y-16 lg:space-y-0 mx-auto relative">
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
                  <h6 className="text-center font-semibold text-slate-900 text-xl pb-1.5">
                    1. Submit instructions
                  </h6>
                  <p className="text-center text-xl font-medium">
                    Fill out an order form and include as much detail as
                    possible.
                  </p>
                </div>
              </div>
              <div className="flex flex-col-reverse lg:flex-col">
                <div className="flex-1 flex flex-col items-center justify-center pb-0 lg:pb-11">
                  <h6 className="text-center font-semibold text-slate-900 text-xl pb-1.5">
                    2. Choose writer
                  </h6>
                  <p className="text-center text-xl font-medium">
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
                  <h6 className="text-center font-semibold text-slate-900 text-xl pb-1.5">
                    3.Track order
                  </h6>
                  <p className="text-center text-xl font-medium">
                    Check the status of your order or chat with your writer at
                    any time.
                  </p>
                </div>
              </div>
              <div className="flex flex-col-reverse lg:flex-col">
                <div className="flex-1 flex flex-col items-center justify-center pb-0 lg:pb-11">
                  <h6 className="text-center font-semibold text-slate-900 text-xl pb-1.5">
                    4.Check paper
                  </h6>
                  <p className="text-center text-xl font-medium">
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

        <Container className="xl:px-0 pb-20">
          <div className="space-y-4 pt-20 pb-24">
            <h2 className="text-5xl font-bold leading-none text-bermuda text-center">
              Proctor Owl Activity
            </h2>
          </div>
          <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-2 mx-auto">
            <div className="flex items-center justify-center">
              <div className="space-y-3">
                <h1 className="font-bold text-8xl text-bermuda">95,000</h1>
                <p>completed orders</p>
              </div>
            </div>
            <div className="flex flex-col space-y-6">
              <div className="grid grid-cols-2">
                <div>
                  <h1 className="font-bold text-6xl text-bermuda">512</h1>
                  <p>Professional Writers</p>
                </div>
                <div>
                  <h1 className="font-bold text-6xl text-bermuda">60</h1>
                  <p>Writers Online</p>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div>
                  <h1 className="font-bold text-6xl text-bermuda">12</h1>
                  <p>Support Staff Online</p>
                </div>
                <div>
                  <h1 className="font-bold text-6xl text-bermuda">4.9/5</h1>
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
                <h1 className="text-white font-bold text-[52px] tracking-tight leading-[63px] capitalize pb-2">
                  Find out what your paper will cost
                </h1>
                <p className="text-white font-normal text-xl">
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
            <h2 className="text-4xl max-w-xl mx-auto font-bold leading-none text-gray-900 text-center capitalize">
              Reviews, comments, and love from papers owl customers and
              community
            </h2>
          </div>
          <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-1 max-w-6xl mx-auto">
            <figure className="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800">
              <Image
                className="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto"
                src="/img_2.png"
                alt=""
                width="384"
                height="512"
              />
              <div className="pt-6 md:p-8 text-center md:text-left space-y-4">
                <blockquote>
                  <p className="text-lg font-medium">
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
              <h2 className="text-5xl font-bold leading-none text-bermuda text-center">
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

        <Container className="xl:px-0 pb-20">
          <div className="space-y-2 pt-20 pb-16">
            <h2 className="text-5xl font-bold leading-none text-gray-900 text-center">
              Why Choose Us
            </h2>
          </div>
          <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-3 mx-auto">
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
          </div>
        </Container>

        <Container className="xl:px-0 pb-20">
          <div className="space-y-2 pt-20 pb-16">
            <h2 className="text-5xl max-w-xl mx-auto font-bold leading-none text-gray-900 text-center">
              Frequently Asked Questions about Custom Writing.
            </h2>
          </div>
          <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-2 max-w-7xl mx-auto">
            <div className=""></div>
            <div className=""></div>
          </div>
        </Container>

        <Container className="xl:px-0 pb-20">
          <div className="space-y-2 pt-20 pb-16">
            <h2 className="text-4xl max-w-xl mx-auto font-bold leading-none text-gray-900 text-center">
              Do You Need an Essay Writer?
            </h2>
          </div>
          <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-1 max-w-6xl mx-auto">
            <div className=""></div>
            <div className=""></div>
          </div>
        </Container>

        <Container className="xl:px-0 pb-20">
          <div className="space-y-2 pt-20 pb-16">
            <h2 className="text-4xl max-w-xl mx-auto font-bold leading-none text-gray-900 text-center">
              What You Get in the End
            </h2>
          </div>
          <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-2 max-w-7xl mx-auto">
            <div className=""></div>
            <div className=""></div>
          </div>
        </Container>

        <Container className="xl:px-0 pb-20">
          <div className="space-y-2 pt-20 pb-16">
            <h2 className="text-4xl max-w-xl mx-auto font-bold leading-none text-gray-900 text-center">
              Blog
            </h2>
          </div>
          <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-2 max-w-7xl mx-auto">
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
          </div>
        </Container>

        <Container className="xl:px-0 pb-20">
          <div className="space-y-4 pb-14">
            <h2 className="text-4xl max-w-xl mx-auto font-bold leading-none text-gray-900 text-center lg:text-left">
              Offers & Updates
            </h2>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
