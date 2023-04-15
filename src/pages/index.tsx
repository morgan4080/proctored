import Image from 'next/image'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Footer from "@/components/Footer";
import Link from "next/link";
import Logo from "@/components/Logo";
import NavigationMenu from "@/components/NavigationMenu";
import {Container} from "@/components/Container";
import HeroArt from "@/components/HeroArt";
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
      <>
        <Head>
          <title>PROCTOR OWLS</title>
          <meta name="description" content="We take proctored exams for you" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-between">
          <div className="z-10 w-full max-w-7xl items-center justify-between font-mono text-sm lg:flex py-10">
            <div className="fixed border border-gray-300/50 rounded-2xl left-0 top-0 flex w-full justify-center pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:p-4">
              <NavigationMenu/>
            </div>
            <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
              <Link
                  className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                <Logo className="w-56 dark:invert text-black"/>
              </Link>
            </div>
          </div>

          <Container className="lg:px-0 min-h-screen">
            <div className="lg:grid lg:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl max-w-xl md:text-5xl lg:text-7xl text-black font-black leading-tight tracking-tighter py-2 lg:py-0">
                  Professional Essay Academic Writers
                </h1>
                <p className="text-gray-900 opacity-75 text-lg lg:text-2xl py-6 max-w-4xl leading-normal">
                  We write your papers - you get top grades!
                </p>
                <button type="button" className="bg-black w-44 py-3 px-8 text-xl rounded-2xl text-white font-semibold hidden lg:inline-block mt-4 transform hover:scale-105 transition ease-in-out duration-100">
                  Order Now
                </button>
              </div>
              <div className="lg:flex lg:justify-end">
                <HeroArt/>
              </div>
            </div>
          </Container>

          <div className="">

          </div>

          <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
            <a
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                target="_blank"
                rel="noopener noreferrer"
            >
              <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
                Docs{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
              </h2>
              <p
                  className={`${inter.className} m-0 max-w-[30ch] text-sm opacity-50`}
              >
                Find in-depth information about Next.js features and API.
              </p>
            </a>

            <a
                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                target="_blank"
                rel="noopener noreferrer"
            >
              <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
                Learn{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
              </h2>
              <p
                  className={`${inter.className} m-0 max-w-[30ch] text-sm opacity-50`}
              >
                Learn about Next.js in an interactive course with&nbsp;quizzes!
              </p>
            </a>

            <a
                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                target="_blank"
                rel="noopener noreferrer"
            >
              <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
                Templates{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
              </h2>
              <p
                  className={`${inter.className} m-0 max-w-[30ch] text-sm opacity-50`}
              >
                Discover and deploy boilerplate example Next.js&nbsp;projects.
              </p>
            </a>

            <a
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                target="_blank"
                rel="noopener noreferrer"
            >
              <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
                Deploy{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
              </h2>
              <p
                  className={`${inter.className} m-0 max-w-[30ch] text-sm opacity-50`}
              >
                Instantly deploy your Next.js site to a shareable URL with Vercel.
              </p>
            </a>
          </div>
        </main>
        <Footer />
      </>
  )
}
