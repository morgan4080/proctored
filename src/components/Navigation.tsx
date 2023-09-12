import classNames from '../../libs/utils/ClassNames'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import { Comfortaa } from 'next/font/google'
import { useOnClickOutside } from '../../libs/utils/hooks'
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getInitials } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu'
import { LogoImg } from '@/components/LogoImg'

const comfortaa = Comfortaa({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
})

const services: { title: string; href: string }[] = [
  {
    title: 'Proctored Exams',
    href: '/services/proctored-exams',
  },
  {
    title: 'Academic Writing',
    href: '/services/proctored-exams',
  },
  {
    title: 'Essay Writing',
    href: '/services/essay-writing',
  },
  {
    title: 'Thesis Writing',
    href: '/services/thesis-writing',
  },
  {
    title: 'Dissertation Work',
    href: '/services/dissertation-work',
  },
]

const menu = [
  {
    name: 'Services',
    items: services,
    href: null,
  },
  {
    name: 'Papers',
    items: [],
    href: '/papers',
  },
  {
    name: 'Login',
    items: [],
    href: null,
  },
]

const Navigation = () => {
  const { data: session, status } = useSession()

  const [serviceMenuOpen, setServiceMenuOpen] = useState(false)

  const refDropDown = useRef<HTMLDivElement>(null)

  useOnClickOutside(refDropDown, () => setServiceMenuOpen(false))

  return (
    <div className="w-full z-50 px-4 xl:px-0">
      <div
        className={classNames(
          comfortaa.className,
          'z-10 max-w-7xl mx-auto w-full items-center justify-between font-mono text-sm lg:flex',
        )}
      >
        <Link href="/">
          <LogoImg />
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            {menu.map((item) =>
              item.items.length > 0 ? (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-1 p-6 md:w-[400px] lg:w-[200px] lg:grid-cols-1">
                      {item.items.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : item.name == 'Login' ? (
                !session ? (
                  <NavigationMenuItem key={item.name}>
                    {/*<Link href={'#'} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </Link>*/}
                  </NavigationMenuItem>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {session.user && session.user.name ? (
                        <Avatar>
                          <AvatarImage
                            src={session.user.image ? session.user.image : ''}
                          />
                          <AvatarFallback>
                            {getInitials(session.user.name)}
                          </AvatarFallback>
                        </Avatar>
                      ) : null}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-32">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Billing</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault()
                          signOut().catch((e) => console.log(e))
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              ) : (
                <NavigationMenuItem key={item.name}>
                  <Link
                    href={item.href ? item.href : ''}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
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
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
