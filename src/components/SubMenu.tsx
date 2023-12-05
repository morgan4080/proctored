import React, { ForwardedRef, forwardRef } from 'react'
import {cn} from "@/lib/utils"


/* categories: {
    _id: string
    title: string
    slug: string
    subcategories: {
      _id: string
      title: string
      slug: string
      items: { _id: string; title: string; slug: string }[]
    }[]
  }[]*/

interface MenuContainerProps {
  children: React.ReactNode
  className: string
}

const SubMenu = forwardRef<HTMLDivElement, MenuContainerProps>(
  (props, ref) => {
    return <div ref={ref as ForwardedRef<HTMLDivElement>} className={cn(props.className)}>{props.children}</div>
  },
)

SubMenu.displayName = 'ServicesMenu'

export default SubMenu
