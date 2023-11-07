import classNames from '../../libs/utils/ClassNames'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { Inter } from 'next/font/google'
import { useOnClickOutside } from '../../libs/utils/hooks'
import {
  LogOut,
  User,
  Boxes,
  ListOrderedIcon,
  PackageIcon,
  LucideNewspaper,
  LucideArchive,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getInitials } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import Logo from '@/components/Logo'

const inter = Inter({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
})

const getLinks = async () => {
  const res = await fetch('/api/services?links=true')
  const { data, message } = await res.json()
  return data
}

const Navigation = () => {
  const { data: session, status } = useSession()

  const [serviceMenuOpen, setServiceMenuOpen] = useState(false)

  const refDropDown = useRef<HTMLDivElement>(null)

  useOnClickOutside(refDropDown, () => setServiceMenuOpen(false))

  const [menu, setMenu] = useState<
    {
      name: string
      items: { title: string; slug: string }[]
      href: string | null
    }[]
  >([
    {
      name: 'Services',
      items: [],
      href: null,
    },
    {
      name: 'Papers',
      items: [],
      href: '/papers',
    },
    {
      name: 'Blogs',
      items: [],
      href: '/blogs',
    },
    {
      name: 'Sign In',
      items: [],
      href: null,
    },
  ])

  useEffect(() => {
    getLinks().then((links) => {
      setMenu((men) => {
        return men.map((m) => {
          if (m.name == 'Services' && m.items.length == 0) {
            m.items = links
            return m
          } else {
            return m
          }
        })
      })
    })
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
        <NavigationMenu className="hidden md:block mx-auto lg:mx-0">
          <NavigationMenuList className="space-x-4">
            {menu.map((item) =>
              item.items.length > 0 ? (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuTrigger className="NavigationMenuTrigger">
                    {item.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="NavigationMenuContent">
                    <ul className="grid gap-1 p-6 md:w-[180px] lg:w-[200px] lg:grid-cols-1">
                      {item.items.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={'/services/' + component.slug}
                          icon={<></>}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : item.name == 'Sign In' ? (
                !session ? (
                  <NavigationMenuItem key={item.name}>
                    <button type={'button'} onClick={() => signIn()}>
                      <NavigationMenuLink className="NavigationMenuLink">
                        {item.name}
                      </NavigationMenuLink>
                    </button>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-transparent">
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
                      <ul className="grid gap-2 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                        <ListItem
                          href="/me"
                          title="My Profile"
                          icon={<User className="mr-2 h-4 w-4" />}
                        ></ListItem>
                        <ListItem
                          href="/all-services"
                          title="Create Services"
                          icon={<ListOrderedIcon className="mr-2 h-4 w-4" />}
                        ></ListItem>
                        <ListItem
                          href="/all-orders"
                          title="All Orders"
                          icon={<PackageIcon className="mr-2 h-4 w-4" />}
                        ></ListItem>
                        <ListItem
                          href="/all-blogs"
                          title="Create Blogs"
                          icon={<LucideNewspaper className="mr-2 h-4 w-4" />}
                        ></ListItem>
                        <ListItem
                          href="/all-papers"
                          title="Create Papers"
                          icon={<LucideArchive className="mr-2 h-4 w-4" />}
                        ></ListItem>
                        <ListItem
                          onClick={(e) => {
                            e.preventDefault()
                            signOut().catch((e) => console.log(e))
                          }}
                          title="Logout"
                          icon={<LogOut className="mr-2 h-4 w-4" />}
                        ></ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              ) : (
                <NavigationMenuItem key={item.name}>
                  <Link
                    href={item.href ? item.href : ''}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink className="NavigationMenuLink">
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>
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
