import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Head from 'next/head'
import classNames from '../../../libs/utils/ClassNames'
import Navigation from '@/components/Navigation'
import { Inter } from 'next/font/google'
import Footer from '@/components/Footer'
import { UserCircleIcon, InboxIcon, PhoneIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

const fetchJWT = async () => {
  const res = await fetch('/api/examples/jwt')
  return await res.json()
}

export default function MePage() {
  const { data: session, status } = useSession()

  const [content, setContent] = useState<any>()

  // Fetch content from protected route
  useEffect(() => {
    fetchJWT()
      .then((json) => setContent(json))
      .catch((e) => console.log(e))
  }, [session])

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
        <Navigation />
        <div className="w-full">
          <section className="relative block h-500-px">
            <div className="absolute top-0 w-full h-full bg-center bg-cover bg-gray-600">
              <span
                id="blackOverlay"
                className="w-full h-full absolute opacity-50 bg-black"
              ></span>
            </div>
            <div
              className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
              style={{ transform: 'translateZ(0px)' }}
            >
              <svg
                className="absolute bottom-0 overflow-hidden"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="text-gray-200 fill-current"
                  points="2560 0 2560 100 0 100"
                ></polygon>
              </svg>
            </div>
          </section>
          <section className="relative py-16">
            <div className="container mx-auto px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div className="px-6">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center relative">
                      {session?.user && (
                        <Image
                          unoptimized
                          alt={'logo'}
                          width={100}
                          height={100}
                          src={`${session.user?.image}`}
                          className="shadow-xl rounded-full h-auto align-middle absolute -top-12 border-none"
                        />
                      )}
                    </div>
                    <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                      <div className="py-6 px-3 mt-32 sm:mt-0 max-w-xs space-x-4">
                        <button
                          className="bg-bermuda active:bg-black uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                          type="button"
                        >
                          ODER NOW
                        </button>
                        <button
                          className="bg-green-400 active:bg-black uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                          type="button"
                        >
                          CONTACT US
                        </button>
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4 lg:order-1">
                      <div className="flex justify-center py-4 lg:pt-4 pt-8">
                        <div className="mr-4 p-3 text-center">
                          <span className="text-xl font-bold block uppercase tracking-wide text-gray-600">
                            22
                          </span>
                          <span className="text-sm text-gray-400">Orders</span>
                        </div>
                        <div className="mr-4 p-3 text-center">
                          <span className="text-xl font-bold block uppercase tracking-wide text-gray-600">
                            10
                          </span>
                          <span className="text-sm text-gray-400">Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-12">
                    <h3 className="text-4xl font-semibold leading-normal mb-2">
                      {session ? session.user?.name : ''}
                    </h3>
                    <div className="text-sm leading-normal mt-0 mb-2 font-bold uppercase">
                      <UserCircleIcon className="h-6 w-6 text-gray-500 mr-2 inline-flex" />
                      {content ? content.userRole : ''} PAGE
                    </div>
                    <div className="mb-2 mt-10">
                      <InboxIcon className="h-4 w-4 text-gray-500 mr-2 inline-flex" />
                      {session?.user?.email}
                    </div>
                    {content && content.phoneNumber && (
                      <div className="mb-2">
                        <PhoneIcon className="h-4 w-4 text-gray-500 mr-2 inline-flex" />
                        {content.phoneNumber}
                      </div>
                    )}
                  </div>
                  <div className="mt-10 py-10 border-t border-gray-200 text-center">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full lg:w-9/12 px-4">
                        <div className="overflow-x-scroll">
                          <table className="min-w-full">
                            <thead className="bg-white border-b">
                              <tr>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                                >
                                  #
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                                >
                                  First
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                                >
                                  Last
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                                >
                                  Handle
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-gray-100 border-b">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  1
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                  Mark
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                  Otto
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                  @mdo
                                </td>
                              </tr>
                              <tr className="bg-white border-b">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  2
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                  Jacob
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                  Dillan
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                  @fat
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
