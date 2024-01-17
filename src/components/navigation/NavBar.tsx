'use client';

import {useRef, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    MenuType,
} from '@/lib/service_types'
import clsx from 'clsx'
import SubMenu from "@/components/SubMenu";
import {SlideWrapper} from "@/components/SlideWrapper";
import {Session} from "next-auth";
import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import {ArrowLeft} from "lucide-react";
import {signIn, signOut} from "next-auth/react";

const NavBar = ({menu, session, status}: {menu: MenuType[], session: Session | null, status: "loading" | "authenticated" | "unauthenticated" }) => {
    const { scrollY } = useScroll();
    const mobileMenu = useRef<HTMLUListElement | null>(null)
    const [scrollYPosition, setScrollYPosition] = useState(0)
    const [currentItem, setCurrentItem] = useState<MenuType | null>(null)
    const [isOpen, setOpen] = useState(false)
    const [hovering, setHovering] = useState<number | null>(null)
    const [popoverLeft, setPopoverLeft] = useState<number | null>(null)
    const [popoverHeight, setPopoverHeight] = useState<number | null>(null)

    // keep a reference for absolute menu to keep a reference for the content height
    const refs = useRef<(HTMLElement | null)[]>([])

    function onHover(index: number, el: HTMLElement) {
        console.log("wth", el.offsetLeft)
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

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrollYPosition(latest)
    })

    return (
        <motion.header className="fixed w-full top-0 z-[1000]" style={{ backdropFilter: "blur(10px)", backgroundColor: session && session.navigationBackground == 'transparent' ? `rgba(0,83,152, ${scrollYPosition /1500})` : `rgba(0,83,152, 0.8)` }}>
            <nav
                onMouseLeave={() => {
                    setHovering(null)
                }}
                className="flex items-center justify-between w-full z-10 max-w-7xl mx-auto px-4 lg:px-0 relative"
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
                        className="object-contain object-center w-12 overflow-hidden self-center"
                        alt="logo"
                    />
                    <span className="absolute top-6 -right-16 hidden lg:flex flex-wrap text-sm font-semibold font-serif text-left">
                        PROCTOR <br /> OWLS ™
                    </span>
                </Link>
                <ul
                    ref={mobileMenu}
                    role="menu"
                    className={clsx(
                        'lg:flex lg:items-center z-[-1] lg:z-auto lg:static fixed w-full left-0 lg:w-auto py-4 lg:py-0 px-4 lg:pl-0 lg:opacity-100 opacity-0 top-[-400px] transition-all ease-in duration-500 gap-14',
                    )}
                >
                    {currentItem ?
                        <div className="p-4 -mx-2 -my-2 h-full bg-white rounded-md overflow-y-scroll z-[2000]">

                            <div className="flex items-center justify-between relative">
                                <span className="flex items-center space-x-4">
                                    <button type="button" onClick={() => {
                                        setCurrentItem(null)
                                    }} className="rounded-md bg-bermuda">
                                        <ArrowLeft className="w-8 text-white"/>
                                    </button>
                                    <span
                                        className="flex-wrap text-sm font-semibold font-serif text-left text-black/80">
                                        {currentItem?.name}
                                    </span>
                                </span>
                                <button
                                    onClick={() => {
                                        setCurrentItem(null)
                                        oCmenu()
                                    }}
                                    type="button"
                                >
                                    <svg
                                        className="text-bermuda w-8 h-8"
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
                            </div>

                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mt-4">

                                {
                                    currentItem.categories.map((category, index) => (
                                        <article
                                            key={category._id}
                                            className="relative isolate flex max-w-2xl flex-col gap-x-2 gap-y-4 sm:flex-row sm:items-start lg:flex-col lg:items-stretch">

                                            <div>
                                                <h4 className="text-sm font-semibold leading-6 text-gray-900">
                                                    {category.title}
                                                </h4>
                                                <div className="mt-2">
                                                    {category.subcategories.map((sub, index) => (
                                                        sub.items.length > 0 ?
                                                            <div
                                                                key={sub._id}
                                                                className="flex flex-col group h-full"
                                                            >
                                                                <h4 className="text-zinc-800/50 text-[12px] pb-1.5 font-[600]">
                                                                    {sub.title}
                                                                </h4>
                                                                <span className="sr-only">
                                                                {sub.description}
                                                            </span>
                                                                {
                                                                    sub.items.map((item, i) => {
                                                                        let element

                                                                        if (item._id.includes("login") || item._id.includes("signup")) {
                                                                            element = <button type="button" onClick={() => signIn()}
                                                                                              className="cursor-pointer text-left hover:underline">
                                                                                <p className="tracking-normal font-semibold text-slate-600 hover:text-slate-800">{"› " +item.title}</p>
                                                                            </button>
                                                                        } else

                                                                        if (item._id.includes("logout")) {
                                                                            element = <button type="button" onClick={() => signOut()}
                                                                                              className="cursor-pointer text-left hover:underline">
                                                                                <p className="tracking-normal font-semibold text-slate-600 hover:text-slate-800">{"› " +item.title}</p>
                                                                            </button>
                                                                        } else

                                                                        if (item._id.includes("admin") || item._id.includes("me")) {
                                                                            element = <Link
                                                                                href={`/${category.slug}/${sub.slug}/${item.slug}`}
                                                                                className="hover:underline">
                                                                                <p className="tracking-normal font-semibold text-slate-600 hover:text-slate-800">{"› " +item.title}</p>
                                                                            </Link>
                                                                        } else {
                                                                            element = <Link
                                                                                href={`/services/${category.slug}/${sub.slug}/${item.slug}`}
                                                                                className="hover:underline">
                                                                                <p className="tracking-normal font-semibold text-slate-600 hover:text-slate-800">{"› " + item.title}</p>
                                                                            </Link>
                                                                        }

                                                                        return (
                                                                            <div key={item._id}>
                                                                                {element}
                                                                                <p className="sr-only">{item.excerpt}</p>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }

                                                            </div>
                                                            :
                                                            null
                                                    ))}
                                                </div>
                                            </div>
                                        </article>
                                    ))
                                }

                            </div>
                        </div>
                        :
                        (
                            <>
                                {isOpen ? (
                                    <li className="flex mb-6 items-center justify-between relative">
                                        <span className="flex items-center space-x-6">
                                            <span className="rounded-md">
                                                  <Image
                                                      loading="lazy"
                                                      src="/logo.svg"
                                                      width={14}
                                                      height={14}
                                                      className="object-contain object-center w-12 overflow-hidden self-center"
                                                      alt="logo"
                                                  />
                                            </span>
                                            <span
                                                className="flex-wrap text-sm font-semibold font-serif text-left text-white/80">
                                                PROCTOR <br/> OWLS ™
                                            </span>
                                        </span>

                                        <button
                                            onClick={() => {
                                                oCmenu()
                                            }}
                                            type="button"
                                            className="p-4"
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
                                    <li key={`${(index + 1)}` + item.name} className="relative">
                                        {
                                            item.categories.length > 0 ?
                                                <button
                                                    onClick={(event) => {
                                                        if (item.categories.length > 0) {
                                                            setCurrentItem(item)
                                                        }
                                                    }}
                                                    type="button"
                                                    className="absolute h-full w-full pointer-events-auto lg:pointer-events-none"
                                                />
                                                :
                                                null
                                        }

                                        <button
                                            type="button"
                                            onMouseEnter={(event) => {
                                                if (item.categories.length > 0) {
                                                    if (event.currentTarget.parentElement) {
                                                        onHover(index, event.currentTarget.parentElement)
                                                    }
                                                }
                                            }}
                                            className={clsx("w-full", item.categories.length > 0 && "pointer-events-none lg:pointer-events-auto")}
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
                                        </button>
                                    </li>
                                ))}
                            </>
                        )
                    }
                </ul>


                <div className="flex space-between flex-row-reverse">
                    <div
                        aria-expanded={isOpen}
                        aria-hidden={!isOpen}
                        className="flex items-start justify-between gap-5 lg:hidden"
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
                        className="flex justify-between items-center gap-4 pl-0 pr-8"
                    >
                        <div className="text-white text-base font-bold ">ORDER NOW</div>
                        <div className="self-center flex items-stretch gap-1 max-md:justify-center">
                            <Image
                                loading="lazy"
                                src="/Path%206.svg"
                                width={10}
                                height={10}
                                className="animate-ripple aspect-[0.6] object-contain object-center w-[9px] stroke-[2px] stroke-neutral-50 opacity-25 overflow-hidden shrink-0 max-w-full"
                                alt={''}
                            />
                            <Image
                                loading="lazy"
                                src="/Path%207.svg"
                                width={10}
                                height={10}
                                className="animate-ripple aspect-[0.6] object-contain object-center w-[9px] stroke-[2px] stroke-neutral-50 opacity-50 overflow-hidden shrink-0 max-w-full"
                                alt={''}
                            />
                            <Image
                                loading="lazy"
                                src="/Path%208.svg"
                                width={10}
                                height={10}
                                className="animate-ripple aspect-[0.6] object-contain object-center w-[9px] stroke-[2px] stroke-neutral-50 opacity-75 overflow-hidden shrink-0 max-w-full"
                                alt={''}
                            />
                            <Image
                                loading="lazy"
                                src="/Path%209.svg"
                                width={10}
                                height={10}
                                className="animate-ripple aspect-[0.6] object-contain object-center w-[9px] stroke-[2px] stroke-neutral-50 overflow-hidden shrink-0 max-w-full"
                                alt={''}
                            />
                        </div>
                    </Link>
                </div>

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
                        "absolute top-16 -ml-24 w-[600px] duration-300",
                        hovering !== null ? "transition-all" : "opacity-0 pointer-events-none"
                    )}
                    style={{
                        left: popoverLeft || 0
                    }}
                >
                    <div style={{height: popoverHeight || 0}}
                         className="bg-[#eff3f9] overflow-hidden transform-gpu rounded shadow">
                        <SlideWrapper index={1} hovering={hovering}>
                            <SubMenu ref={ref => refs.current[1] = ref} categories={menu[1].categories} className=""/>
                        </SlideWrapper>
                        <SlideWrapper index={4} hovering={hovering}>
                            <SubMenu ref={ref => refs.current[4] = ref} categories={menu[4].categories} className=""/>
                        </SlideWrapper>
                    </div>
                </div>
            </nav>
        </motion.header>
    )
}

export default NavBar
