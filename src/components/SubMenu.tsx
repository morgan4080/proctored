import React, {ForwardedRef, forwardRef, useState} from 'react';
import {motion} from 'framer-motion'
import {cn} from "@/lib/utils";
import {MenuCategory} from "@/lib/service_types";
import {clsx} from "clsx";
import Link from "next/link";

type MenuContainerProps = {
  categories: MenuCategory[]
  className: string
}

const SubMenu = forwardRef<HTMLDivElement, MenuContainerProps>(
  (props, ref) => {
    const [hoveredCat, setHoveredCat] = useState<number>(0)
    return <nav ref={ref as ForwardedRef<HTMLDivElement>} className={cn(props.className)}>
        <div className="p-1 gap-2 flex">
            <div className="w-1/3 space-y-1">
                {
                    props.categories.map((category, i) => (
                        <div key={i} className="group relative">
                            <button onMouseEnter={(event) => {
                                setHoveredCat(i)
                            }} onMouseLeave={(event) => {
                                setHoveredCat(0)
                            }} className={
                                clsx(
                                "w-full text-left text-[13px] cursor-pointer rounded-md p-4 relative z-[2]"
                                )
                            } aria-expanded={hoveredCat ? "true" : "false"}>
                                <dl className="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center z-[3] relative">
                                    <div>
                                        <dt className="sr-only">Category Title</dt>
                                        <dd className="font-[600] tracking-wide text-zinc-600 group-hover:text-zinc-700">
                                            {category.title}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="sr-only">Description</dt>
                                        <dd className="font-normal tracking-wide group-hover:text-slate-600 line-clamp-2">{category.description}</dd>
                                    </div>
                                </dl>
                                <div className={clsx(
                                    "absolute h-full w-full bg-white top-0 left-0 rounded-md transition-all duration-300 z-[2]",
                                    hoveredCat === i ? "opacity-100 translate-y-0" : i === 0 ? "opacity-0 translate-y-6" : "opacity-0 -translate-y-6"
                                )}></div>
                            </button>

                            <div
                                style={{outlineStyle: "solid", outlineWidth: 3, outlineColor: "#eff3f9"}}
                                className={clsx(
                                    "z-[1] transition-all duration-300 opacity-0 group-hover:opacity-100 border-1 border-[#eff3f9] absolute w-[12px] h-[12px] bottom-[44%] -right-1.5 rounded-tl-sm bg-white origin-center rotate-[135deg]",
                                    hoveredCat === i ? "opacity-100 translate-y-0" : i === 0 ? "opacity-0 translate-y-6" : "opacity-0 -translate-y-6"
                                )}
                            />
                        </div>
                    ))
                }
            </div>
            <div className="w-2/3 grid grid-cols-2 gap-4 text-[13px] rounded-md bg-white p-4 -ml-1">
                {props.categories[hoveredCat] ? props.categories[hoveredCat].subcategories.map((sub, index) => (
                    sub.items.length > 0 ?
                        <motion.div
                            key={index}
                            className="flex flex-col group"
                            initial="hidden"
                            animate={index === hoveredCat ? 'visible' : 'hidden'}
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    translateY: 40,
                                },
                                visible: {
                                    opacity: 1,
                                    translateY: 0,
                                    transition: { duration: 10 },
                                }
                            }}
                        >
                            <h4 className="text-slate-400 text-[13px] pb-0.5 font-[600]">
                                {sub.title}
                            </h4>
                            <span className="sr-only">
                                {sub.description}
                            </span>
                           <div className="space-y-1.5">
                               {
                                   sub.items.map((item, i) => (
                                       <Link key={i} href={`/services/${props.categories[hoveredCat].slug}/${sub.slug}/${item.slug}`}>
                                           <p className="tracking-wide text-slate-500 hover:text-slate-800">{'🔗' + item.title}</p>
                                       </Link>
                                   ))
                               }
                           </div>
                        </motion.div>
                    : null
                ))
                : null}
            </div>
        </div>
    </nav>
  },
)

SubMenu.displayName = 'ServicesMenu'

export default SubMenu
