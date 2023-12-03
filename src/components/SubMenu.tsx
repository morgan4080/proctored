import React, { ForwardedRef, forwardRef } from 'react'

interface MenuContainerProps {
  categories: {
    _id: string
    title: string
    slug: string
    subcategories: {
      _id: string
      title: string
      slug: string
      items: { _id: string; title: string; slug: string }[]
    }[]
  }[]
  children: React.ReactNode
}

const SubMenu = React.forwardRef<HTMLDivElement, MenuContainerProps>(
  (props, ref) => {
    return <div ref={ref as ForwardedRef<HTMLDivElement>}>{props.children}</div>
  },
)

SubMenu.displayName = 'ServicesMenu'

export default SubMenu
