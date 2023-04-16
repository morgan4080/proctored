import Image from 'next/image'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Footer from "@/components/Footer";
import Link from "next/link";
import Logo from "@/components/Logo";
import NavigationMenu from "@/components/NavigationMenu";
import {Container} from "@/components/Container";
import HeroArt from "@/components/HeroArt";
import { StarIcon } from "@heroicons/react/24/solid"
import {write} from "fs";
import classNames from "@/Utils/ClassNames";
const inter = Inter({ subsets: ['latin'] })

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
                  image: '/img.png'
              }
          ]
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
                  image: '/img.png'
              }
          ]
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
                  image: '/img.png'
              }
          ]
      }
  ]
  return (
      <>
        <Head>
          <title>PROCTOR OWLS</title>
          <meta name="description" content="We take proctored exams for you" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-between relative">
          <div className="fixed max-w-7xl w-full z-50 py-10 px-4 xl:px-0">
            <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex">
              <div className="fixed border border-gray-300/50 rounded-2xl left-0 top-0 flex w-full justify-center pb-6 pt-8 backdrop-blur-md lg:static lg:w-auto lg:p-4">
                <NavigationMenu/>
              </div>
              <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                <Link
                    className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0 rounded-2xl backdrop-blur-md"
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                  <Logo className="w-56 dark:invert text-black"/>
                </Link>
              </div>
            </div>
          </div>

          <Container className="xl:px-0 pt-32 pb-24 lg:pt-44 lg:pb-36">
            <div className="lg:grid lg:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl text-center lg:text-left md:text-5xl lg:text-7xl text-black font-black leading-tight tracking-tighter py-2 lg:py-0">
                  Professional Essay Academic Writers
                </h1>
                <p className="text-gray-900 opacity-75 text-lg text-center lg:text-left lg:text-2xl py-6 leading-normal">
                  We write your papers - you get top grades!
                </p>
                <button type="button" className="bg-black w-44 py-3 px-8 text-xl rounded-2xl text-white font-semibold hidden lg:inline-block mt-4 transform hover:scale-105 transition ease-in-out duration-100">
                  Order Now
                </button>
              </div>
              <div className="flex justify-center lg:justify-end">
                <HeroArt className="h-1/2 lg:w-full lg:h-full"/>
              </div>
            </div>
          </Container>

          <Container className="xl:px-0 pb-20">
            <div className="space-y-4 pb-14">
              <h2 className="text-4xl font-bold leading-none text-gray-900 text-center">
                  Choose Your Writer
              </h2>
              <p className="lg:text-md lg:max-w-lg mx-auto text-center">
                  EssayDon expert writers are online and available for hire. Read through their profiles, and sample assignments to find your perfect match.
              </p>
            </div>
            <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-3 max-w-6xl mx-auto">
                {
                    writers.map((writer, index) => (
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
                                    <h4 className="text-lg font-semibold leading-none">{writer.name}</h4>
                                    <p className="text-sm leading-tight py-2">Completed order: {writer.orders_complete}</p>
                                    <div className="flex items-center">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <StarIcon
                                                key={rating}
                                                className={classNames(
                                                    writer.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                                                    'flex-shrink-0 h-5 w-5'
                                                )}
                                                aria-hidden="true"
                                            />
                                        ))}
                                        <span>{writer.rating} ({writer.reviewCount})</span>
                                    </div>
                                </div>
                            </div>
                            {writer.featured_work.map((work,i) => (
                                <div key={i} className="flex flex-col">
                                    <h5 className="font-semibold text-black text-sm leading-tight text-center pt-3">{work.title}</h5>
                                    <div className="grid grid-cols-2 pt-5">
                                        <div className="flex flex-col space-y-5">
                                            <div className="">
                                                <p className="text-xs capitalize">paper type:</p>
                                                <p className="text-xs font-semibold text-black capitalize">{work.paper_type}</p>
                                            </div>
                                            <div className="">
                                                <p className="text-xs capitalize">subject:</p>
                                                <p className="text-xs font-semibold text-black capitalize">{work.subject}</p>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <div>
                                                    <p className="text-xs capitalize">style:</p>
                                                    <p className="text-xs font-semibold text-black capitalize">{work.style}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs capitalize">sources:</p>
                                                    <p className="text-xs font-semibold text-black capitalize">{work.sources}</p>
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
                                    <button type="button" className="bg-green-400 rounded-md text-white py-3 mt-4">
                                        <span className="">Hire A Writer</span>
                                    </button>
                                </div>
                            ))}
                        </Link>
                    ))
                }
            </div>
          </Container>

          <Container className="xl:px-0 pb-20">
            <div className="space-y-4 pb-14">
              <h2 className="text-4xl font-bold leading-none text-gray-900 text-center">
                  How To Place An Order
              </h2>
            </div>
            <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-4 max-w-6xl mx-auto">
                <div className=""></div>
                <div className=""></div>
                <div className=""></div>
                <div className=""></div>
            </div>
          </Container>

          <Container className="xl:px-0 pb-20">
            <div className="space-y-4 pb-14">
              <h2 className="text-4xl font-bold leading-none text-gray-900 text-center">
                  Proctor Owl Activity
              </h2>
            </div>
            <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-2 max-w-6xl mx-auto">
                <div className=""></div>
                <div className=""></div>
            </div>
          </Container>

          <Container className="xl:px-0 pb-20">
            <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-2 max-w-6xl mx-auto">
                <div className=""></div>
                <div className=""></div>
            </div>
          </Container>

            <Container className="xl:px-0 pb-20">
                <div className="space-y-4 pb-14">
                    <h2 className="text-4xl max-w-xl mx-auto font-bold leading-none text-gray-900 text-center capitalize">
                        Reviews, comments, and love from essaydons2 customers and community
                    </h2>
                </div>
                <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-1 max-w-6xl mx-auto">
                    <div className=""></div>
                </div>
            </Container>

            <Container className="xl:px-0 pb-20">
                <div className="space-y-4 pb-14">
                    <h2 className="text-4xl font-bold leading-none text-gray-900 text-center">
                        Guarantees
                    </h2>
                </div>
                <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-3 max-w-6xl mx-auto">
                    <div className=""></div>
                    <div className=""></div>
                    <div className=""></div>
                </div>
            </Container>

            <Container className="xl:px-0 pb-20">
                <div className="space-y-4 pb-14">
                    <h2 className="text-4xl font-bold leading-none text-gray-900 text-center">
                        why choose us
                    </h2>
                </div>
                <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-3 max-w-6xl mx-auto">
                    <div className=""></div>
                    <div className=""></div>
                    <div className=""></div>
                </div>
            </Container>

            <Container className="xl:px-0 pb-20">
                <div className="space-y-4 pb-14">
                    <h2 className="text-4xl max-w-xl mx-auto font-bold leading-none text-gray-900 text-center">
                        Frequently Asked Questions about Custom Writing.
                    </h2>
                </div>
                <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-2 max-w-6xl mx-auto">
                    <div className=""></div>
                    <div className=""></div>
                </div>
            </Container>

            <Container className="xl:px-0 pb-20">
                <div className="space-y-4 pb-14">
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
                <div className="space-y-4 pb-14">
                    <h2 className="text-4xl max-w-xl mx-auto font-bold leading-none text-gray-900 text-center">
                        What You Get in the End
                    </h2>
                </div>
                <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-2 max-w-6xl mx-auto">
                    <div className=""></div>
                    <div className=""></div>
                </div>
            </Container>

            <Container className="xl:px-0 pb-20">
                <div className="space-y-4 pb-14">
                    <h2 className="text-4xl max-w-xl mx-auto font-bold leading-none text-gray-900 text-center">
                        Blog
                    </h2>
                </div>
                <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-2 max-w-6xl mx-auto">
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
