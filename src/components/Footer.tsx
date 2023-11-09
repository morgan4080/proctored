import { Container } from '@/components/Container'
import { Inter } from 'next/font/google'
import classNames from '../utils/ClassNames'
import Link from 'next/link'
import Logo from '@/components/Logo'
import PaymentIcons from '@/components/transactions/PaymentIcons'
const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
})
const Footer = () => {
  const backToTop = () => {
    if (document) {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }
  }

  return (
    <>
      <Container className="py-10 min-w-full bg-gray-200 text-sm">
        <div className="sm:grid sm:grid-cols-2 sm:gap-8 xl:col-span-3 text-center lg:text-left">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div className="hidden lg:block">
              <ul role="list" className={classNames(inter.className, 'mt-6')}>
                <Logo className="w-52 md:mx-auto text-bermuda" />
              </ul>
            </div>
            <div className="mt-10 md:mt-0">
              <ul
                role="list"
                className={classNames(inter.className, 'mt-6 space-y-4')}
              >
                <li>
                  <Link href="/papers" className="dark:text-white">
                    Samples
                  </Link>
                </li>
                <li>
                  <Link href="/" className="dark:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <ul
                role="list"
                className={classNames(inter.className, 'mt-6 space-y-4')}
              >
                <li>
                  <Link href="/" className="dark:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/" className="dark:text-white">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mt-10 md:mt-0">
              <h2 className="text-2xl italic font-semibold leading-none pb-1 dark:text-white">
                We accept:
              </h2>
              <ul
                role="list"
                className={classNames(
                  inter.className,
                  'mt-6 space-x-2 flex justify-center lg:justify-start',
                )}
              >
                <li>
                  <PaymentIcons name={'visa'} />
                </li>
                <li>
                  <PaymentIcons name={'master-card'} />
                </li>
                <li>
                  <PaymentIcons name={'paypal'} />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
      <div className="text-center pb-8 lg:py-5 bg-gray-200 px-4 sm:px-6 lg:px-8">
        <p
          className={classNames(
            inter.className,
            'dark:text-white py-1 text-xs',
          )}
        >
          Copyright © 2023{' '}
          <a className="text-black" href="https://proctorowls.com">
            Proctor Owls
          </a>{' '}
          All Rights Reserved.
          <a
            href="https://morganmutugi.co.ke"
            target="_blank"
            className="hover:text-white text-sky-300"
          >
            {' '}
          </a>
        </p>
      </div>
    </>
  )
}

export default Footer
