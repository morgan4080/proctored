import classNames from '../../libs/utils/ClassNames'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import { Comfortaa } from 'next/font/google'
import { useOnClickOutside } from '../../libs/utils/hooks'
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

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
]

const Navigation = () => {
  const { data: session, status } = useSession()

  const [serviceMenuOpen, setServiceMenuOpen] = useState(false)

  const refDropDown = useRef<HTMLDivElement>(null)

  useOnClickOutside(refDropDown, () => setServiceMenuOpen(false))

  return (
    <div className="w-full z-50 px-4 xl:px-0">
      <div className="z-10 max-w-7xl mx-auto w-full items-center justify-between font-mono text-sm lg:flex">
        <Link href="/">
          <LogoImg />
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <ListItem href="/docs" title="Introduction">
                    Re-usable components built using Radix UI and Tailwind CSS.
                  </ListItem>
                  <ListItem href="/docs/installation" title="Installation">
                    How to install dependencies and structure your app.
                  </ListItem>
                  <ListItem
                    href="/docs/primitives/typography"
                    title="Typography"
                  >
                    Styles for headings, paragraphs, lists...etc
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Documentation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
    /* <div className="left-0 top-0 flex w-full justify-center pb-6 pt-8 lg:static lg:w-auto lg:p-4">
         <div
           className={classNames(
             comfortaa.className,
             'flex items-center space-x-6 sm:space-x-8 md:space-x-10 lg:space-x-12 relative text-base text-slate-800',
           )}
         >
           <div className="group tracking-wide font-semibold py-3 inline-block">
             <button
               onClick={() => setServiceMenuOpen(!serviceMenuOpen)}
               type="button"
               className="flex flex-row items-center text-white"
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
           <Link href="/" className="tracking-wide font-semibold text-white">
             Papers
           </Link>
           <div className="flex items-center justify-between tracking-wide font-semibold rounded-2xl">
             {!session && (
               <>
                 <Link
                   href="/api/auth/signin"
                   className="rounded-2xl z-20 bg-black px-3 text-white font-black"
                   onClick={(e) => {
                     e.preventDefault()
                     signIn().catch((e) => console.log(e))
                   }}
                 >
                   Sign Up
                 </Link>
                 <button
                   type={'button'}
                   className="rounded-r-2xl z-10 -ml-2 px-4 text-black font-black bg-white"
                   onClick={(e) => {
                     e.preventDefault()
                     signIn().catch((e) => console.log(e))
                   }}
                 >
                   Log in
                 </button>
               </>
             )}

             {session?.user && (
               <div className="space-x-2 flex items-center">
                 {session.user.name && (
                   <Link href={`/me`}>
                     {/!*<span id={'name'} className="text-white mr-2 underline">
                       {session.user.name}
                     </span>*!/}
                     <Avatar>
                       <AvatarImage
                         src={session.user.image ? session.user.image : ''}
                       />
                       <AvatarFallback>
                         {getInitials(session.user.name)}
                       </AvatarFallback>
                     </Avatar>
                   </Link>
                 )}
                 <Link
                   id={'logout'}
                   className="rounded-2xl z-20 text-white"
                   href={`/api/auth/signout`}
                   onClick={(e) => {
                     e.preventDefault()
                     signOut().catch((e) => console.log(e))
                   }}
                 >
                   <ArrowRightOnRectangleIcon className="w-6 h-6" />
                 </Link>
               </div>
             )}
           </div>
         </div>
       </div>*/
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
