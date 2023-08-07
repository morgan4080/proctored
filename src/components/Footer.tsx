import { Container } from '@/components/Container'
import { Sulphur_Point } from 'next/font/google'
import classNames from '@/Utils/ClassNames'
import Link from 'next/link'
import Logo from '@/components/Logo'
import PaymentIcons from '@/components/PaymentIcons'
const sulphur_point_400 = Sulphur_Point({ subsets: ['latin'], weight: '400' })
const Footer = () => {
  const backToTop = () => {
    if (document) {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }
  }

  return (
    <>
      <Container className="py-10 min-w-full dark:bg-gray-900">
        <div className="sm:grid sm:grid-cols-2 sm:gap-8 xl:col-span-3 text-center lg:text-left">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div className="hidden lg:block">
              <ul
                role="list"
                className={classNames(sulphur_point_400.className, 'mt-6')}
              >
                <Logo className="w-52 md:mx-auto dark:text-white" />
              </ul>
            </div>
            <div className="mt-10 md:mt-0">
              <ul
                role="list"
                className={classNames(
                  sulphur_point_400.className,
                  'mt-6 space-y-4',
                )}
              >
                <li>
                  <Link href="/" className="dark:text-white">
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
                className={classNames(
                  sulphur_point_400.className,
                  'mt-6 space-y-4',
                )}
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
                  sulphur_point_400.className,
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
      <div className="text-center pb-8 lg:py-5 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
        <p
          className={classNames(
            sulphur_point_400.className,
            'dark:text-white py-1',
          )}
        >
          Copyright © 2023{' '}
          <a className="text-sky-300" href="https://proctorowls.com">
            Proctor Owls
          </a>{' '}
          All Rights Reserved.
          <a
            href="https://morganmutugi.co.ke"
            target="_blank"
            className="hover:text-white text-sky-300"
          >
            {' '}
            By Morgan.
          </a>
        </p>
      </div>
    </>
  )
}

export default Footer
