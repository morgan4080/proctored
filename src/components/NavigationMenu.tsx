import classNames from '@/Utils/ClassNames'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Sulphur_Point } from 'next/font/google'
import { useSession } from 'next-auth/react'
import { useOnClickOutside } from '@/Utils/hooks'
const sulphur_point_400 = Sulphur_Point({ subsets: ['latin'], weight: '400' })
const NavigationMenu = () => {
  const { data: session, status } = useSession()

  const loading = status === 'loading'

  const [serviceMenuOpen, setServiceMenuOpen] = useState(false)

  const refDropDown = useRef<HTMLDivElement>(null)

  useOnClickOutside(refDropDown, () => setServiceMenuOpen(false))

  return (
    <div className="fixed rounded-2xl left-0 top-0 flex w-full justify-center pb-6 pt-8 backdrop-blur-md lg:static lg:w-auto lg:p-4">
      <div
        className={classNames(
          sulphur_point_400.className,
          'flex items-center relative text-base text-slate-800',
        )}
      >
        <div className="group mx-2 tracking-wide font-semibold py-3 px-4 inline-block">
          <button
            onClick={() => setServiceMenuOpen(!serviceMenuOpen)}
            type="button"
            className="flex flex-row items-center hover:text-green-600"
          >
            Services
            <svg
              className="ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {serviceMenuOpen ? (
            <div
              ref={refDropDown}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              className="absolute w-44 rounded-xl border bg-gray-200 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit transform px-2 lg:mt-2 sm:px-0 lg:ml-0"
            >
              <Link
                href="/"
                className="group p-2 flex items-start space-x-4 transition ease-in-out duration-150"
              >
                <div className="flex-1 space-y-1">
                  <p className="transform hover:translate-x-2 hover:text-blue-700 -mb-1 leading-6 flex flex-row items-center transition ease-in-out duration-150">
                    Proctored Exams
                  </p>
                </div>
              </Link>
              <Link
                href="/"
                className="group p-2 flex items-start space-x-4 transition ease-in-out duration-150"
              >
                <div className="flex-1 space-y-1">
                  <p className="transform hover:translate-x-2 hover:text-blue-700 -mb-1 leading-6 flex flex-row items-center transition ease-in-out duration-150">
                    Academic Writing
                  </p>
                </div>
              </Link>
              <Link
                href="/"
                className="group p-2 flex items-start space-x-4 transition ease-in-out duration-150"
              >
                <div className="flex-1 space-y-1">
                  <p className="transform hover:translate-x-2 hover:text-blue-700 -mb-1 leading-6 flex flex-row items-center transition ease-in-out duration-150">
                    Essay Writing
                  </p>
                </div>
              </Link>
              <Link
                href="/"
                className="group p-2 flex items-start space-x-4 transition ease-in-out duration-150"
              >
                <div className="flex-1 space-y-1">
                  <p className="transform hover:translate-x-2 hover:text-blue-700 -mb-1 leading-6 flex flex-row items-center transition ease-in-out duration-150">
                    Thesis Writing
                  </p>
                </div>
              </Link>
              <Link
                href="/"
                className="group p-2 flex items-start space-x-4 transition ease-in-out duration-150"
              >
                <div className="flex-1 space-y-1">
                  <p className="transform hover:translate-x-2 hover:text-blue-700 -mb-1 leading-6 flex flex-row items-center transition ease-in-out duration-150">
                    Research Writing
                  </p>
                </div>
              </Link>
              <Link
                href="/"
                className="group p-2 flex items-start space-x-4 transition ease-in-out duration-150"
              >
                <div className="flex-1 space-y-1">
                  <p className="transform hover:translate-x-2 hover:text-blue-700 -mb-1 leading-6 flex flex-row items-center transition ease-in-out duration-150">
                    Dissertation Work
                  </p>
                </div>
              </Link>
            </div>
          ) : null}
        </div>
        <Link
          href="/"
          className="mx-2 tracking-wide font-semibold px-4 hover:text-blue-700"
        >
          Sample Papers
        </Link>

        <div className="mx-2 flex tracking-wide font-semibold hover:text-blue-700 rounded-2xl bg-green-200">
          <button
            type={'button'}
            className="rounded-2xl z-20 bg-green-700 hover:bg-green-900 px-3 text-white font-black"
          >
            Sign Up
          </button>
          <button
            type={'button'}
            className="rounded-r-2xl z-10 -ml-2 px-4 text-black font-black hover:text-white hover:bg-green-900"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  )
}

export default NavigationMenu
