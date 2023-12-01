import dynamic from 'next/dynamic'

const Container = dynamic(() => import('@/components/Container'), {
  ssr: true,
})
import { Inter } from 'next/font/google'
import classNames from '../utils/ClassNames'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useRouter } from 'next/router'
import Image from 'next/image'
const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
})
const Footer = () => {
  const router = useRouter()
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
                    Papers
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="dark:text-white">
                    Blogs
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
                  <Link href="/privacy-policy" className="dark:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/termsofuse" className="dark:text-white">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mt-10 md:mt-0">
              <h2 className="text-xl italic font-semibold leading-none pb-1 dark:text-white">
                We accept:
              </h2>
              <div role="list" className="mt-2">
                <Image
                  src="/secure-payment.svg"
                  width={190}
                  height={26}
                  alt="Secure payments"
                  className="mx-auto sm:mx-0"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="pb-2 bg-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-2">
          <p
            className={classNames(
              inter.className,
              'text-center dark:text-white pt-1 text-xs text-zinc-800',
            )}
          >
            Copyright © 2023 Proctor & Research Owls All Rights Reserved.
          </p>
          <p className="text-center dark:text-white text-xs">
            Disclaimer: The reference papers provided by proctorowls.com &
            researchowls.com serve as model papers for students and are not to
            be submitted as it is. These papers are intended to be used for
            research and reference purposes only.
          </p>
        </div>
      </div>
    </>
  )
}

export default Footer
