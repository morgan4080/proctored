import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  CategoryWithSubCategoryAndService,
  MenuType,
} from '@/lib/service_types'
import clsx from 'clsx'
import {useSession} from "next-auth/react";
import SubMenu from "@/components/SubMenu";
import {SlideWrapper} from "@/components/SlideWrapper";

const getLinks = async (): Promise<CategoryWithSubCategoryAndService[]> => {
  const res = await fetch('/api/services?links=true')
  const { data } = await res.json()
  return data
}

const INITIALMENU = [
  {
    name: 'Home',
    categories: [],
    link: '/',
  },
  {
    name: 'Services',
    categories: [],
    link: '#',
  },
  {
    name: 'Papers',
    categories: [],
    link: '/papers',
  },
  {
    name: 'Blogs',
    categories: [],
    link: '/blogs',
  },
  {
    name: 'Account',
    categories: [],
    link: '#',
  },
]

const Navigation = () => {
  const {data: session, status} = useSession()

  let [menu, setMenu] = useState<MenuType[]>(INITIALMENU)
  const mobileMenu = useRef<HTMLUListElement | null>(null)
  const [isOpen, setOpen] = useState(false)
  const [hovering, setHovering] = useState<number | null>(null)
  const [popoverLeft, setPopoverLeft] = useState<number | null>(null)
  const [popoverHeight, setPopoverHeight] = useState<number | null>(null)

  // keep a reference for absolute menu to keep a reference for the content height
  const refs = useRef<(HTMLElement | null)[]>([])

  function onHover(index: number, el: HTMLElement) {
    setPopoverLeft(el.offsetLeft)
    setPopoverHeight(refs.current[index]?.offsetHeight || null)
    setTimeout(() => {
      setHovering(index)
    })
  }

  function oCmenu() {
    // change menu to close
    setOpen(!isOpen)
    if (!isOpen) {
      mobileMenu.current?.classList.add('top-[0px]')
      mobileMenu.current?.classList.add('opacity-100')
      mobileMenu.current?.classList.add('z-[10]')
      mobileMenu.current?.classList.add('bg-bermuda')
      mobileMenu.current?.classList.add('h-screen')
      mobileMenu.current?.classList.add('space-y-4')
    } else {
      mobileMenu.current?.classList.remove('top-[0px]')
      mobileMenu.current?.classList.remove('opacity-100')
      mobileMenu.current?.classList.remove('z-[10]')
      mobileMenu.current?.classList.remove('bg-bermuda')
      mobileMenu.current?.classList.remove('h-screen')
      mobileMenu.current?.classList.remove('space-y-4')
    }
  }

  const setMenus = useCallback(() => {
    getLinks().then((links) => {
      setMenu((menuItems) => {
        return menuItems.map((m) => {
          switch (m.name) {
            case 'Services':
              if (m.categories.length == 0) {
                m.categories = links.map(link => {
                  const {_id, title, slug, description, subcategories} = link
                  return {
                    _id,
                    title,
                    slug,
                    description,
                    subcategories: subcategories.map(subcategory => {
                      return {
                        _id: subcategory._id,
                        title: subcategory.title,
                        slug: subcategory.slug,
                        description: subcategory.description,
                        items: subcategory.services
                      }
                    })
                  }
                })
              }
              break
            case 'Account':
              switch (status) {
                case "authenticated":
                  const { user } = session
                  if (user) {
                    switch (user.userRole) {
                      case "user":
                        m.categories = [
                          {
                            _id: 'me-' + Math.random().toString(36).slice(2, 18),
                            title: "Profile",
                            slug: "me",
                            description: "Your account details",
                            subcategories: [
                              {
                                _id: 'me-orders-' + Math.random().toString(36).slice(2, 18),
                                title: "Orders",
                                slug: "orders",
                                description: "orders",
                                items: []
                              },
                              {
                                _id: 'me-transactions-' + Math.random().toString(36).slice(2, 18),
                                title: "Transactions",
                                slug: "transactions",
                                description: "transactions",
                                items: []
                              }
                            ]
                          }
                        ]
                        break
                      case "admin":
                        m.categories = [
                          {
                            _id: 'me-' + Math.random().toString(36).slice(2, 18),
                            title: "Profile",
                            slug: "me",
                            description: "Your account details",
                            subcategories: [
                              {
                                _id: 'me-orders-' + Math.random().toString(36).slice(2, 18),
                                title: "Orders",
                                slug: "orders",
                                description: "orders",
                                items: []
                              },
                              {
                                _id: 'me-transactions-' + Math.random().toString(36).slice(2, 18),
                                title: "Transactions",
                                slug: "transactions",
                                description: "transactions",
                                items: []
                              }
                            ]
                          }
                        ]
                        break
                      case "superuser":
                        m.categories = [
                          {
                            _id: 'me-' + Math.random().toString(36).slice(2, 18),
                            title: "Profile",
                            slug: "me",
                            description: "Your account details",
                            subcategories: [
                              {
                                _id: 'me-orders-' + Math.random().toString(36).slice(2, 18),
                                title: "Your Orders",
                                slug: "orders",
                                description: "orders",
                                items: [
                                  {
                                    _id: 'me-orders-' + Math.random().toString(36).slice(2, 18),
                                    title: "Orders",
                                    slug: "",
                                  }
                                ]
                              },
                              {
                                _id: 'me-transactions-' + Math.random().toString(36).slice(2, 18),
                                title: "Your Transactions",
                                slug: "transactions",
                                description: "transactions",
                                items: [
                                  {
                                    _id: 'me-transactions-' + Math.random().toString(36).slice(2, 18),
                                    title: "Transaction",
                                    slug: "",
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            _id: 'admin-' + Math.random().toString(36).slice(2, 18),
                            title: "Admin Dashboard",
                            slug: "admin",
                            description: "Admin account pages",
                            subcategories: [
                              {
                                _id: 'admin-users-' + Math.random().toString(36).slice(2, 18),
                                title: "All Users",
                                slug: "users",
                                description: "users",
                                items: [
                                  {
                                    _id: 'admin-users-' + Math.random().toString(36).slice(2, 18),
                                    title: "Users",
                                    slug: "",
                                  }
                                ]
                              },
                              {
                                _id: 'admin-orders-' + Math.random().toString(36).slice(2, 18),
                                title: "All Orders",
                                slug: "orders",
                                description: "orders",
                                items: [
                                  {
                                    _id: 'admin-orders-' + Math.random().toString(36).slice(2, 18),
                                    title: "Orders",
                                    slug: "",
                                  }
                                ]
                              },
                              {
                                _id: 'admin-transactions-' + Math.random().toString(36).slice(2, 18),
                                title: "All Transactions",
                                slug: "transactions",
                                description: "transactions",
                                items: [
                                  {
                                    _id: 'admin-transactions-' + Math.random().toString(36).slice(2, 18),
                                    title: "Transactions",
                                    slug: "",
                                  }
                                ]
                              },
                              {
                                _id: 'admin-services-' + Math.random().toString(36).slice(2, 18),
                                title: "All Services",
                                slug: "services",
                                description: "services",
                                items: [
                                  {
                                    _id: 'admin-services-' + Math.random().toString(36).slice(2, 18),
                                    title: "Services",
                                    slug: "",
                                  }
                                ]
                              },
                              {
                                _id: 'admin-papers-' + Math.random().toString(36).slice(2, 18),
                                title: "All Papers",
                                slug: "papers",
                                description: "papers",
                                items: [
                                  {
                                    _id: 'admin-papers-' + Math.random().toString(36).slice(2, 18),
                                    title: "Papers",
                                    slug: "",
                                  }
                                ]
                              },
                              {
                                _id: 'admin-blogs-' + Math.random().toString(36).slice(2, 18),
                                title: "All Blogs",
                                slug: "blogs",
                                description: "blogs",
                                items: [
                                  {
                                    _id: 'admin-blogs-' + Math.random().toString(36).slice(2, 18),
                                    title: "Blogs",
                                    slug: "",
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                        break
                    }
                  }
                  break
                case "unauthenticated":
                  m.categories = [
                    {
                      _id: 'login-' + Math.random().toString(36).slice(2, 18),
                      title: "Login",
                      slug: "",
                      description: "signin   to account",
                      subcategories: [
                        {
                          _id: 'login-' + Math.random().toString(36).slice(2, 18),
                          title: "User Login",
                          slug: "",
                          description: "login",
                          items: [
                            {
                              _id: 'login-' + Math.random().toString(36).slice(2, 18),
                              title: "Login",
                              slug: "",
                            }
                          ]
                        },
                      ]
                    },
                    {
                      _id: 'signup-' + Math.random().toString(36).slice(2, 18),
                      title: "Sign Up",
                      slug: "",
                      description: "create an account",
                      subcategories: [
                        {
                          _id: 'signup-' + Math.random().toString(36).slice(2, 18),
                          title: "User Signup",
                          slug: "",
                          description: "signup",
                          items: [
                            {
                              _id: 'signup-' + Math.random().toString(36).slice(2, 18),
                              title: "Signup",
                              slug: "",
                            }
                          ]
                        },
                      ]
                    }
                  ]
                  break
              }
              break
          }
          return m
        })
      })

    })
  }, [session, status])

  useEffect(() => {
    setMenus()
  }, [setMenus, session, status])

  return (
    <>
      <nav
        onMouseLeave={() => {
          setHovering(null)
        }}
        className="flex items-center justify-between w-full z-10 max-w-7xl mx-auto px-4 sm:px-0 relative"
      >
        <Link
          href="/"
          className="text-neutral-50 text-lg font-bold self-stretch py-4 pr-4 relative"
        >
          <Image
            loading="lazy"
            src="/logo.svg"
            width={14}
            height={14}
            className="object-contain object-center w-16 overflow-hidden self-center"
            alt="logo"
          />
          <span className="absolute top-10 -right-14 hidden md:flex flex-wrap text-xs text-left">
            PROCTOR <br /> OWLS ™
          </span>
        </Link>
        <ul
          ref={mobileMenu}
          role="menu"
          className={clsx(
            'md:flex md:items-center z-[-1] md:z-auto md:static fixed w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 opacity-0 top-[-400px] transition-all ease-in duration-500 gap-14',
          )}
        >
          {isOpen ? (
            <li className="flex mb-6 items-center justify-between relative">
              <span className="flex items-center space-x-6">
                <span className="rounded-md">
                  <Image
                    loading="lazy"
                    src="/logo.svg"
                    width={14}
                    height={14}
                    className="object-contain object-center w-16 overflow-hidden self-center"
                    alt="logo"
                  />
                </span>
                <span className="flex flex-wrap pt-2 text-center text-white font-bold text-2xl">
                  PROCTOR OWLS
                </span>
              </span>

              <button
                onClick={() => {
                  oCmenu()
                }}
                type="button"
                className="p-2 absolute -top-2 right-2"
              >
                <svg
                  className="text-white w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </li>
          ) : null}

          {menu.map((item, index) => (
            <li
              key={index}
              role="menuitem"
              onMouseEnter={(event) => {
                if (item.categories.length > 0) {
                  onHover(index, event.currentTarget)
                }
              }}
            >
              <Link
                role={`navigation-${item.name}`}
                href={item.link}
                className="self-stretch flex flex-col"
              >
                <span className="flex items-center space-x-1 text-white text-base font-semibold">
                  <span>{item.name}</span>
                  <svg
                    className={clsx(
                      'text-white w-3 h-3',
                      item.categories.length > 0 ? 'block' : 'hidden',
                    )}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    ></path>
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div
          role="mobile-menu-toggle-collapsed"
          aria-expanded={isOpen}
          aria-hidden={!isOpen}
          className="flex items-start justify-between gap-5 md:hidden"
        >
          <button
            onClick={() => {
              oCmenu()
            }}
            type="button"
            className="p-2"
          >
            {isOpen ? (
              <svg
                className="text-white w-12 h-12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="text-white w-12 h-12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
                ></path>
              </svg>
            )}
          </button>
        </div>
        <Link
          role="CTA"
          href="/order/create"
          className="self-stretch flex justify-between items-center gap-4 px-4 lg:px-0"
        >
          <div className="text-white text-base font-bold ">ORDER NOW</div>
          <div className="self-center flex items-stretch gap-1 max-md:justify-center">
            <Image
              loading="lazy"
              src="/Path%206.svg"
              width={10}
              height={10}
              className="animate-pulse aspect-[0.6] object-contain object-center w-[9px] stroke-[2px] stroke-neutral-50 opacity-25 overflow-hidden shrink-0 max-w-full"
              alt={''}
            />
            <Image
              loading="lazy"
              src="/Path%207.svg"
              width={10}
              height={10}
              className="animate-pulse aspect-[0.6] object-contain object-center w-[9px] stroke-[2px] stroke-neutral-50 opacity-50 overflow-hidden shrink-0 max-w-full"
              alt={''}
            />
            <Image
              loading="lazy"
              src="/Path%208.svg"
              width={10}
              height={10}
              className="animate-pulse aspect-[0.6] object-contain object-center w-[9px] stroke-[2px] stroke-neutral-50 opacity-75 overflow-hidden shrink-0 max-w-full"
              alt={''}
            />
            <Image
              loading="lazy"
              src="/Path%209.svg"
              width={10}
              height={10}
              className="animate-pulse aspect-[0.6] object-contain object-center w-[9px] stroke-[2px] stroke-neutral-50 overflow-hidden shrink-0 max-w-full"
              alt={''}
            />
          </div>
        </Link>

        <div
            className={clsx(
                "absolute ml-[30px] w-[12px] h-[12px] bottom-2 rounded-tl-sm bg-[#eff3f9] origin-center rotate-45",
                hovering !== null ? "transition-all -translate-y-2 delay-100" : "opacity-0 translate-y-0 pointer-events-none"
            )}
            style={{
              left: popoverLeft || 0
            }}
        />
        <div
          className={clsx(
              "absolute top-20 -ml-24 w-[600px] duration-300",
              hovering !== null ? "transition-all" : "opacity-0 pointer-events-none"
          )}
          style={{
            left: popoverLeft || 0
          }}
        >
          <div style={{height: popoverHeight || 0}} className="bg-[#eff3f9] overflow-hidden transform-gpu rounded shadow">
            <SlideWrapper index={1} hovering={hovering}>
              <SubMenu ref={ref => refs.current[1] = ref} categories={menu[1].categories} className="" />
            </SlideWrapper>
            <SlideWrapper index={4} hovering={hovering}>
              <SubMenu ref={ref => refs.current[4] = ref} categories={menu[4].categories} className="" />
            </SlideWrapper>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navigation
