import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  CategoryWithSubCategoryAndService,
  MenuType,
} from '@/lib/service_types'
import clsx from 'clsx'

const getLinks = async (): Promise<CategoryWithSubCategoryAndService[]> => {
  const res = await fetch('/api/services?links=true')
  const { data } = await res.json()
  return data
}

const INITIALMENU = [
  {
    name: 'Home',
    categories: [],
    link: '#',
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
  let [menu, setMenu] = useState<MenuType[]>(INITIALMENU)
  const mobileMenu = useRef<HTMLUListElement | null>(null)
  const [isOpen, setOpen] = useState(false)
  const [hovering, setHovering] = useState<number | null>(null)
  const [popoverLeft, setPopoverLeft] = useState<number | null>(null)
  const [popoverHeight, setPopoverHeight] = useState<number | null>(null)

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
          if (m.name == 'Services' && m.categories.length == 0) {
            m.categories = links
            return m
          } else {
            return m
          }
        })
      })
    })
  }, [])

  useEffect(() => {
    setMenus()
  }, [setMenus])

  return (
    <>
      <nav
        onMouseLeave={() => {
          setHovering(null)
        }}
        className="flex items-center justify-between w-full z-10 max-w-7xl mx-auto"
      >
        <Link
          href="/"
          className="text-neutral-50 text-lg font-bold self-stretch p-4 relative"
        >
          <Image
            loading="lazy"
            src="/logo.svg"
            width={10}
            height={10}
            className="object-contain object-center w-12 overflow-hidden self-center"
            alt="logo"
          />
          <span className="absolute top-7 -right-14 hidden md:flex flex-wrap text-xs text-left">
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
                    width={10}
                    height={10}
                    className="object-contain object-center w-12 overflow-hidden self-center"
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
                  setHovering(index)
                  setPopoverLeft(event.currentTarget.offsetLeft)
                }
              }}
            >
              <Link
                role={`navigation-${item.name}`}
                href={item.link}
                className="self-stretch flex flex-col"
              >
                <span className="flex items-center space-x-2 text-white text-base font-semibold">
                  <span>{item.name}</span>
                  <svg
                    className={clsx(
                      'text-white w-2 h-2',
                      item.categories.length > 0 ? 'block' : 'hidden',
                    )}
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
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    ></path>
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {hovering && (
          <div
            style={{
              left: popoverLeft || 0,
            }}
            className="absolute top-12 pt-6 -ml-24 w-[600px] bg-white overflow-hidden transform-gpu rounded shadow-lg transition-all duration-300"
          ></div>
        )}
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
          href="/order/create/proctored-exams-help"
          className="self-stretch flex justify-between items-center gap-4 px-4 lg:px-0"
        >
          <div className="text-white text-base font-bold ">ORDER NOW</div>
          <div className="self-center flex items-stretch gap-1 max-md:justify-center">
            <Image
              loading="lazy"
              src="/Path%206.svg"
              width={10}
              height={10}
              className="aspect-[0.6] object-contain object-center w-[9px] stroke-[2px] stroke-neutral-50 opacity-25 overflow-hidden shrink-0 max-w-full"
              alt={''}
            />
            <Image
              loading="lazy"
              src="/Path%207.svg"
              width={10}
              height={10}
              className="aspect-[0.6] object-contain object-center w-[9px] stroke-[2px] stroke-neutral-50 opacity-50 overflow-hidden shrink-0 max-w-full"
              alt={''}
            />
            <Image
              loading="lazy"
              src="/Path%208.svg"
              width={10}
              height={10}
              className="aspect-[0.6] object-contain object-center w-[9px] stroke-[2px] stroke-neutral-50 opacity-75 overflow-hidden shrink-0 max-w-full"
              alt={''}
            />
            <Image
              loading="lazy"
              src="/Path%209.svg"
              width={10}
              height={10}
              className="aspect-[0.6] object-contain object-center w-[9px] stroke-[2px] stroke-neutral-50 overflow-hidden shrink-0 max-w-full"
              alt={''}
            />
          </div>
        </Link>
      </nav>
    </>
  )
}

export default Navigation
