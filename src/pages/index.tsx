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
                  sources: 1
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
                  sources: 1
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
                  sources: 1
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

          <Container className="xl:px-0 pt-32 pb-24 lg:pt-44 lg:pb-44">
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

          <Container className="lg:px-0 pb-20">
            <div className="space-y-4 pb-16">
              <h2 className="text-4xl font-bold leading-none text-gray-900 text-center">
                  Choose Your Writer
              </h2>
              <p className="lg:text-md lg:max-w-lg mx-auto text-center mb-4">
                  EssayDon expert writers are online and available for hire. Read through their profiles, and sample assignments to find your perfect match.
              </p>
            </div>
            <div className="grid lg:grid-cols-3">
                {
                    writers.map((writer, index) => (
                        <Link
                            key={index}
                            href="/"
                            className="group rounded-lg mx-auto lg:mx-0 max-w-sm border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                        >
                            <div className="flex-1 flex relative">
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
                        </Link>
                    ))
                }
            </div>
          </Container>
        </main>
        <Footer />
      </>
  )
}
