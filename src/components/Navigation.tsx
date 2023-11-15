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
import { ChevronDown } from 'lucide-react'
import { CategoryWithSubCategoryAndService } from '@/lib/service_types'

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

  const [menu, setMenu] = useState<
    {
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
    }[]
  >([
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

  return (
    <div className="w-full z-50 px-0 xl:px-0">
      <div
        className={classNames(
          inter.className,
          'my-4 z-10 max-w-7xl mx-auto w-full items-center justify-between font-mono text-sm lg:flex',
        )}
      >
        <Link href="/">
          <Logo className="w-52 mx-auto text-white" />
        </Link>
        <div className="hidden md:flex mx-auto lg:mx-0">
          <Menubar className="bg-transparent border-0 text-white">
            {menu.map((item, index) =>
              item.categories.length > 0 ? (
                <MenubarMenu key={index}>
                  <MenubarTrigger className="focus:bg-transparent focus:text-white data-[state=open]:bg-transparent data-[state=open]:text-white">
                    <span className="mr-2">{item.name}</span>
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
                                  <MenubarItem key={s._id} className="text-xs">
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
              ) : (
                <MenubarMenu key={index}>
                  <MenubarTrigger className="focus:bg-transparent focus:text-white data-[state=open]:bg-transparent data-[state=open]:text-white">
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
                    className="bg-black hover:bg-black p-0 h-6 rounded-full"
                  >
                    {session.user && session.user.name ? (
                      <div className="flex items-center space-x-2 bg-black rounded-full">
                        <p className="text-xs pl-2 text-white">
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
                        icon={<></>}
                      ></ListItem>
                      {session.user &&
                      (session.user.userRole == 'admin' ||
                        session.user.userRole == 'superuser') ? (
                        <ListItem
                          href="/admin/users"
                          title="Admin"
                          icon={<></>}
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
                        icon={<></>}
                      ></ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem>
                  <button type={'button'} onClick={() => signIn()}>
                    <NavigationMenuLink className="NavigationMenuLink">
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
