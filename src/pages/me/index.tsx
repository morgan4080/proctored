import { useSession } from 'next-auth/react'
import Head from 'next/head'
import classNames from '@/Utils/ClassNames'
import NavigationMenu from '@/components/NavigationMenu'
import { Inter } from 'next/font/google'
import { Container } from '@/components/Container'
import Footer from '@/components/Footer'
import { LogoImg } from '@/components/LogoImg'
import Link from 'next/link'
const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export default function MePage() {
  const { data } = useSession()

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
          'flex min-h-screen flex-col items-center',
        )}
      >
        <div className="bg-bermuda w-full z-50 px-4 xl:px-0">
          <div className="z-10  max-w-7xl mx-auto w-full items-center justify-between font-mono text-sm lg:flex">
            <Link href="/">
              <LogoImg />
            </Link>
            <NavigationMenu />
          </div>
        </div>
        <div className="w-full -mt-28 md:-mt-20">
          <Container className="xl:px-0 pt-32 pb-24 lg:pt-44 lg:pb-36">
            <div className="lg:grid lg:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl text-center lg:text-left md:text-5xl lg:text-4xl text-white font-black leading-tight tracking-tight py-2 lg:py-0">
                  My Account
                </h1>
              </div>
            </div>
          </Container>
        </div>
      </main>

      <Footer />
    </>
  )
}
