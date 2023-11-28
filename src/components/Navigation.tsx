import classNames from '../utils/ClassNames'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Inter } from 'next/font/google'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getInitials } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu'
import Logo from '@/components/Logo'
import { useRouter } from 'next/router'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'
import {
  ChevronDown,
  ChevronRightIcon,
  UserCog,
  Users2Icon,
  LogOutIcon,
} from 'lucide-react'
import {
  ArchiveBoxArrowDownIcon,
  AcademicCapIcon,
  NewspaperIcon,
  ShoppingCartIcon,
} from '@heroicons/react/20/solid'
import { CategoryWithSubCategoryAndService } from '@/lib/service_types'
import { motion, useCycle } from 'framer-motion'
import { useDimensions } from '@/hooks/use-dimensions'

const inter = Inter({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
})

const getLinks = async (): Promise<CategoryWithSubCategoryAndService[]> => {
  const res = await fetch('/api/services?links=true')
  const { data } = await res.json()
  return data
}

const Navigation = () => {
  const { data: session } = useSession()

  const router = useRouter()

  const [menu, setMenu] = useState<MenuType[]>([
    {
      name: 'Services',
      categories: [],
      href: null,
    },
    {
      name: 'Papers',
      categories: [],
      href: '/papers',
    },
    {
      name: 'Blogs',
      categories: [],
      href: '/blogs',
    },
    {
      name: 'Create Order',
      categories: [],
      href: '/order/create/proctored-exams-help',
    },
  ])

  const [openMenu, setOpenMenu] = useState('')

  const addLinks = useCallback(() => {
    getLinks().then((links) => {
      setMenu((men) => {
        return men.map((m) => {
          if (m.name == 'Services' && m.categories.length == 0) {
            console.log()
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
    addLinks()
  }, [])

  const [isOpen, toggleOpen] = useCycle(false, true)
  const containerRef = useRef(null)
  const { height } = useDimensions(containerRef)

  const sidebar = {
    open: (height = 200) => ({
      clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
      transition: {
        type: 'spring',
        stiffness: 20,
        restDelta: 2,
      },
    }),
    closed: {
      clipPath: 'circle(25px at 40px 40px)',
      transition: {
        delay: 0.5,
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  }

  return (
    <div className="flex items-center w-full">
      <motion.nav
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        custom={height}
        ref={containerRef}
        className="absolute top-0 left-0 bottom-0 md:hidden"
      >
        <MenuToggle toggle={() => toggleOpen()} />
        <motion.div
          className="absolute top-0 left-0 bottom-0 w-screen bg-white z-10"
          variants={sidebar}
        />
        <Nav menu={menu} className={cn(isOpen && 'z-10')} />
      </motion.nav>

      <div className="w-full px-0 xl:px-0 z-10">
        <div
          className={classNames(
            inter.className,
            'my-4 max-w-7xl mx-auto w-full items-center md:justify-between font-mono text-sm flex',
          )}
        >
          <Link href="/" className="mx-auto md:mx-0 md:mr-auto">
            <Logo className="w-44 md:w-52 mx-auto text-white" />
          </Link>
          <div className="hidden md:flex mx-auto lg:mx-0">
            <Menubar className="bg-transparent border-0 text-white">
              {menu.map((item, index) =>
                item.categories.length > 0 ? (
                  <MenubarMenu key={index}>
                    <MenubarTrigger className="focus:bg-transparent focus:text-white data-[state=open]:bg-transparent data-[state=open]:text-white">
                      <span className="mr-2 font-semibold">{item.name}</span>
                      <ChevronDown className="h-3 w-3 text-white" />
                    </MenubarTrigger>
                    <MenubarContent>
                      {item.categories.map((category, i) => (
                        <MenubarSub key={i}>
                          <MenubarSubTrigger className="text-xs">
                            {category.title}
                          </MenubarSubTrigger>
                          <MenubarSubContent>
                            {category.subcategories.map((sub) => (
                              <MenubarSub key={sub._id}>
                                <MenubarSubTrigger className="text-xs">
                                  {sub.title}
                                </MenubarSubTrigger>
                                <MenubarSubContent>
                                  {sub.services.map((s) => (
                                    <MenubarItem
                                      key={s._id}
                                      className="text-xs"
                                    >
                                      <Link
                                        href={`/services/${category.slug}/${sub.slug}/${s.slug}`}
                                      >
                                        {s.title}
                                      </Link>
                                    </MenubarItem>
                                  ))}
                                </MenubarSubContent>
                              </MenubarSub>
                            ))}
                          </MenubarSubContent>
                        </MenubarSub>
                      ))}
                    </MenubarContent>
                  </MenubarMenu>
                ) : item.name == 'Create Order' ? (
                  <MenubarMenu key={index}>
                    <MenubarTrigger className="group font-semibold focus:bg-transparent focus:text-white data-[state=open]:bg-transparent data-[state=open]:text-white bg-white/10 rounded-full">
                      <Link href={item.href ? item.href : ''}>{item.name}</Link>
                      <ChevronRightIcon className="h-4 w-4 text-white ml-0.5 transition duration-200 ease-in-out group-hover:translate-x-0.5" />
                    </MenubarTrigger>
                  </MenubarMenu>
                ) : (
                  <MenubarMenu key={index}>
                    <MenubarTrigger className="font-semibold focus:bg-transparent focus:text-white data-[state=open]:bg-transparent data-[state=open]:text-white">
                      <Link href={item.href ? item.href : ''}>{item.name}</Link>
                    </MenubarTrigger>
                  </MenubarMenu>
                ),
              )}
            </Menubar>

            <NavigationMenu originalViewport={false} className="pl-4">
              <NavigationMenuList className="space-x-4 pl-4 border-l">
                {session ? (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      chevron={false}
                      className="bg-white/10 p-0 h-6 rounded-full"
                    >
                      {session.user && session.user.name ? (
                        <div className="flex items-center justify-center space-x-2 rounded-full">
                          <p className="text-xs pl-3 text-white font-semibold">
                            {session.user.email}
                          </p>
                          <Avatar className="w-8 h-8 cursor-pointer">
                            <AvatarImage src={`${session.user.image}`} />
                            <AvatarFallback className="text-xs text-black">
                              {getInitials(session.user.name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      ) : null}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="flex flex-col gap-2 p-4 w-[180px]">
                        <ListItem
                          href="/me/orders"
                          title="Profile"
                          icon={<UserCog className="h-4 w-4 text-black mr-5" />}
                        ></ListItem>
                        {session.user &&
                        (session.user.userRole == 'admin' ||
                          session.user.userRole == 'superuser') ? (
                          <ListItem
                            href="/admin/users"
                            title="Admin"
                            icon={
                              <Users2Icon className="h-4 w-4 text-black mr-5" />
                            }
                          ></ListItem>
                        ) : null}
                        <ListItem
                          onClick={(e) => {
                            e.preventDefault()
                            signOut()
                              .then(() => router.push('/'))
                              .catch((e) => console.log(e))
                          }}
                          title="Logout"
                          icon={
                            <LogOutIcon className="h-4 w-4 text-black mr-5" />
                          }
                        ></ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem>
                    <button type={'button'} onClick={() => signIn()}>
                      <NavigationMenuLink className="NavigationMenuLink font-semibold">
                        Sign In
                      </NavigationMenuLink>
                    </button>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
              <NavigationMenuViewport viewportClassName="absolute right-0 top-full flex justify-end" />
            </NavigationMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navigation

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { icon: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            'flex-1 block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          href={props.href ? props.href : ''}
          {...props}
        >
          <div className="flex items-center">
            {icon}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'

const variantsN = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

type MenuType = {
  name: string
  categories: {
    _id: string
    title: string
    slug: string
    subcategories: {
      _id: string
      title: string
      slug: string
      services: { _id: string; title: string; slug: string }[]
    }[]
  }[]
  href: string | null
}

export const Nav = React.forwardRef<
  React.ElementRef<'ul'>,
  React.ComponentPropsWithoutRef<'a'> & { menu: MenuType[] }
>(({ className, menu }, ref) => {
  return (
    <motion.ul
      ref={ref}
      variants={variantsN}
      className={cn('absolute top-[80px] w-screen p-[25px]', className)}
    >
      {menu.map((item, index) => (
        <MenuI item={item} key={index} />
      ))}
    </motion.ul>
  )
})

Nav.displayName = 'CustomNav'

const variantsM = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
}

const IconMenu = ({ name }: { name: string }) => {
  return (
    <>
      {name == 'Papers' && (
        <ArchiveBoxArrowDownIcon className="w-6 h-6 text-slate-700" />
      )}
      {name == 'Services' && (
        <AcademicCapIcon className="w-6 h-6 text-slate-700" />
      )}
      {name == 'Blogs' && <NewspaperIcon className="w-6 h-6 text-slate-700" />}
      {name == 'Create Order' && (
        <ShoppingCartIcon className="w-6 h-6 text-slate-700" />
      )}
    </>
  )
}

export const MenuI = ({ item }: { item: MenuType }) => {
  return (
    <motion.li
      variants={variantsM}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="listItem"
    >
      <div className="icon-placeholder flex items-center justify-center">
        <IconMenu name={item.name} />
      </div>
      <div className="text-placeholder">{item.name}</div>
    </motion.li>
  )
}

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
)

const MenuToggle = ({ toggle }: any) => (
  <button
    onClick={toggle}
    className="menuBtn flex flex-col justify-center z-50"
  >
    <svg className="z-10 mx-auto" width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </svg>
  </button>
)
