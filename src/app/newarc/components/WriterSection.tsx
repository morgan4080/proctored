'use client';

import {WriterType} from "@/lib/service_types";
import {motion, scroll, useInView, useMotionValue, useScroll, useTransform} from "framer-motion";
import classNames from "@/utils/ClassNames";
import Image from "next/image";
import {StarIcon} from "lucide-react";
import Link from "next/link";
import {useEffect, useRef} from "react";

export default function WriterSection({writers}: {writers: WriterType[]}) {
    const chooseWriterView = useRef(null)
    const chooseWriterInView = useInView(chooseWriterView, { once: false })
    const progressWheel = useRef(null)
    const containerRef = useRef(null)


    const { scrollYProgress } = useScroll({
        target: containerRef,
    });

    const x = useMotionValue(0)

    const xValue = useTransform(x, [0, 1], ["1%", "-95%"])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        if (progressWheel && progressWheel.current) {
            const progWheel: HTMLElement = progressWheel.current
             scroll(
                (progress) => {
                    progWheel.style.strokeDasharray = `${progress}, 1`
                },
                {
                    source: container,
                    axis: 'x',
                },
            )
        }
        return () => {
            containerRef.current = null
        }
    }, []);
    return <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-0 pb-28 pt-20 sm:py-32">
        <div
            ref={chooseWriterView}
            className="px-4 mx-auto text-center max-w-sm md:max-w-7xl"
        >
            <motion.h2
                className={classNames(
                    "font-sans",
                    'text-3xl tracking-tight sm:text-4xl md:text-5xl text-bermuda text-left',
                )}
                initial="hidden"
                animate={chooseWriterInView ? 'visible' : 'hidden'}
                variants={{
                    hidden: {clipPath: 'inset(100% 0% 0% 0%)'},
                    visible: {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        transition: {duration: 0.5},
                    },
                }}
            >
                Featured Writers
            </motion.h2>
            <motion.p
                initial="hidden"
                animate={chooseWriterInView ? 'visible' : 'hidden'}
                variants={{
                    hidden: {clipPath: 'inset(100% 0% 0% 0%)'},
                    visible: {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        transition: {duration: 0.8},
                    },
                }}
                className="mt-6 text-lg tracking-tight text-slate-600 text-left"
            >
                Expert writers available for hire. Read through their profiles,
                and sample assignments to find your perfect match.
            </motion.p>
        </div>
        <div className="md:max-w-7xl mx-auto mt-16 w-full relative">
            <svg
                id="progress"
                width="100"
                height="100"
                viewBox="0 0 100 100"
                className="-bottom-24 right-0 -z-10"
            >
                <circle cx="50" cy="50" r="30" pathLength="1" className="bg"/>
                <circle
                    ref={progressWheel}
                    cx="50"
                    cy="50"
                    r="30"
                    pathLength="1"
                    className="indicator"
                />
            </svg>
            <div className="flex-1 mx-auto">
                <motion.div
                    ref={containerRef}
                    className="flex justify-center gap-8 px-8 sm:mx-auto whitespace-nowrap overflow-x-scroll horizontalScroll"
                    style={{ x: xValue }}
                >
                    {writers.map((writer, index) => (
                        <motion.div
                            key={index}
                            className="shrink-0 group rounded-lg max-w-xs border px-5 py-4 border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30 relative shadow-lg"
                        >
                            <div className="flex-1 flex relative">
                                <div className="mr-6">
                                    <Image
                                        src={writer.profile_image}
                                        alt={writer.name}
                                        width={77}
                                        height={77}
                                        priority
                                        className="border-0.5 rounded-md"
                                    />
                                </div>
                                <div>
                                    <h4
                                        className={classNames(
                                            "font-sans",
                                            'text-lg font-semibold leading-none',
                                        )}
                                    >
                                        {writer.name}
                                    </h4>
                                    <p className="text-sm leading-tight py-2">
                                        Completed order: {writer.orders_complete}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex">
                                            {[0, 1, 2, 3, 4].map((rating) => (
                                                <StarIcon
                                                    key={rating}
                                                    className={classNames(
                                                        writer.rating > rating
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-200',
                                                        'flex-shrink-0 h-4 w-4',
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            ))}
                                        </div>
                                        <div className={classNames("font-sans text-sm")}>
                                            {writer.rating} ({writer.reviewCount})
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {writer.featured_work.map((work, i) => (
                                <div key={i} className="flex flex-col">
                                    <h5
                                        className={classNames(
                                            "font-sans",
                                            'font-semibold text-slate-700 text-sm leading-tight pt-3 text-left',
                                        )}
                                    >
                                        {work.title}
                                    </h5>
                                    <div className="grid grid-cols-2 pt-5">
                                        <div className="flex flex-col space-y-5">
                                            <div className="">
                                                <p className="text-xs capitalize">paper type:</p>
                                                <p className="text-xs font-semibold text-black capitalize">
                                                    {work.paper_type}
                                                </p>
                                            </div>
                                            <div className="">
                                                <p className="text-xs capitalize">subject:</p>
                                                <p className="text-xs font-semibold text-black capitalize">
                                                    {work.subject}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <div>
                                                    <p className="text-xs capitalize">style:</p>
                                                    <p className="text-xs font-semibold text-black capitalize">
                                                        {work.style}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs capitalize">sources:</p>
                                                    <p className="text-xs font-semibold text-black capitalize">
                                                        {work.sources}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Image
                                                className="ml-auto"
                                                src={work.image}
                                                alt="essay"
                                                width={107}
                                                height={151}
                                                priority
                                            />
                                        </div>
                                    </div>
                                    <Link
                                        href={`/order/create`}
                                        className="bg-bermuda text-center rounded-full text-white text-sm font-semibold py-3 mt-4"
                                    >
                                        <span className="">Hire Writer</span>
                                    </Link>
                                </div>
                            ))}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <button
                onClick={() => {
                    x.set(scrollYProgress.get() - 0.1)
                }}
                className="absolute left-0 top-[50%] z-30 rounded-r-xl bg-slate-400/30 p-3 pl-2 text-4xl text-white backdrop-blur-sm transition-all hover:pl-3 hover:bg-slate-800/50"
                style={{transform: "translateX(-100%) translateZ(0px)"}}>
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"
                     strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>

            <button
                onClick={() => {
                    x.set(scrollYProgress.get() + 0.1)
                }}
                className="absolute right-0 top-[50%] z-30 rounded-l-xl bg-slate-400/30 p-3 pr-2 text-4xl text-white backdrop-blur-sm transition-all hover:pr-3 hover:bg-slate-800/50"
                style={{transform: "translateX(0%) translateZ(0)"}}>
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"
                     strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>


        </div>
    </div>
}