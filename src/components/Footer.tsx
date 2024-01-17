import classNames from '../utils/ClassNames'
import Link from 'next/link'
import Image from 'next/image'

import Container from "@/components/Container"

const Footer = () => {
  return (
    <footer>
      <div className="bg-reef/20 py-10 text-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 sm:grid sm:grid-cols-2 sm:gap-8 xl:col-span-3 text-center lg:text-left">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <ul role="list" className="font-serif mt-6 space-y-4">
                <li className="flex justify-center md:justify-start items-center space-x-2 mx-auto">
                  <Image
                      loading="lazy"
                      src="/logo.svg"
                      width={50}
                      height={50}
                      alt="logo"
                  />
                  <p className="text-xs hidden md:inline-flex">
                    PROCTOR<br/>OWLS ™
                  </p>
                </li>
              </ul>
            </div>
            <div className="mt-10 md:mt-0">
              <h2 className="text-xs font-semibold leading-none pb-1 dark:text-white">
                PAGES
              </h2>
              <ul
                  role="list"
                  className={classNames("font-serif", 'mt-6 space-y-4')}
              >
                <li>
                  <Link href="/papers" className="dark:text-white hover:underline">
                    Papers
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="dark:text-white hover:underline">
                    Blogs
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div className="mt-10 md:mt-0">
              <h2 className="text-xs font-semibold leading-none pb-1 dark:text-white">
                LEGAL
              </h2>
              <ul
                  role="list"
                  className={classNames("font-serif", 'mt-6 space-y-4')}
              >
                <li>
                  <Link href="/privacy-policy" className="dark:text-white hover:underline">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/termsofuse" className="dark:text-white hover:underline">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mt-10 md:mt-0">
              <h2 className="text-sm italic font-semibold leading-none pb-1 dark:text-white">
                We accept:
              </h2>
              <div role="list" className="mt-2">
                <Image
                    src="/secure-payment.svg"
                    width={250}
                    height={50}
                    alt="Secure payments"
                    className="mx-auto sm:mx-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4 bg-reef/30">
        <div className="mx-auto max-w-4xl space-y-2">
          <p
              className={classNames(
                  "font-serif",
                  'text-center dark:text-white pt-1 text-xs text-zinc-600',
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
    </footer>
  )
}

export default Footer
