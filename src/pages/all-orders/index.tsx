import Head from 'next/head'
import classNames from '../../../libs/utils/ClassNames'
import Navigation from '@/components/Navigation'
import { Inter, Lexend } from 'next/font/google'
import { Container } from '@/components/Container'

const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})
const AllOrders = () => {
  return (
    <div className="relative">
      <Head>
        <title>Service Listing</title>
        <meta name="description" content="Create Services" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={classNames(
          inter.className,
          'flex min-h-screen flex-col items-center justify-between relative',
        )}
      >
        <Container className="xl:px-0" parentClassName="bg-bermuda/95 w-full">
          <section className="bg-cover bg-center w-full">
            <div className="h-full">
              <div className="pt-3">
                <Navigation />
              </div>
            </div>
          </section>
        </Container>
      </main>
    </div>
  )
}

export default AllOrders
