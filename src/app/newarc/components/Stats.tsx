'use client';
import classNames from "@/utils/ClassNames";
import {motion, useInView} from "framer-motion";
import Container from "@/components/Container";
import {useEffect, useRef, useState} from "react";

const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function Stats() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false })
    const [completedOrders, setCompletedOrders] = useState(0)
    const [professionalWriters, setProfessionalWriters] = useState(0)
    const [writersOnline, setWritersOnline] = useState(0)
    const [supportStaffOnline, setSupportStaffOnline] = useState(0)
    const [averageScore, setAverageScore] = useState('')
    useEffect(() => {
        setCompletedOrders(getRandomNumber(95000, 100000))
        setProfessionalWriters(450)
        setWritersOnline(getRandomNumber(40, 80))
        setSupportStaffOnline(getRandomNumber(8, 20))
        setAverageScore(`${getRandomNumber(40, 49) / 10}/5`)
    }, []);

    return <Container className="xl:px-0 pb-28 pt-20 sm:py-28">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
            <h2
                className={classNames(
                    "font-sans",
                    'text-3xl tracking-tight sm:text-4xl md:text-5xl text-bermuda text-center',
                )}
            >
                Proctor Owl Activity
            </h2>
        </div>
        <div className="mt-16 grid gap-16 md:gap-24 lg:gap-48 space-y-16 lg:space-y-0 lg:grid-cols-2 mx-auto">
            <div className="flex items-center justify-center">
                <div className="space-y-3">
                    <motion.h1
                        className={classNames(
                            "font-sans",
                            'font-semibold text-8xl text-bermuda',
                        )}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        variants={{
                            hidden: {
                                opacity: 0,
                                scale: 0.96,
                                translateY: 40,
                                clipPath: 'inset(100% 0% 0% 0%)',
                            },
                            visible: {
                                clipPath: 'inset(0% 0% 0% 0%)',
                                opacity: 1,
                                scale: 1,
                                translateY: 0,
                                transition: {duration: 0.5},
                            },
                        }}
                    >
                        {completedOrders.toLocaleString()}
                    </motion.h1>
                    <motion.p
                        className="text-sm capitalize py-2"
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        variants={{
                            hidden: {opacity: 0, scale: 0.96, translateX: 40},
                            visible: {
                                opacity: 1,
                                scale: 1,
                                translateX: 0,
                                transition: {duration: 0.5, delay: 0.1},
                            },
                        }}
                    >
                        completed orders
                    </motion.p>
                </div>
            </div>
            <div ref={ref} className="flex flex-col space-y-6">
                <div className="grid gap-8 grid-cols-2">
                    <div>
                        <motion.h1
                            className={classNames(
                                "font-sans",
                                'font-bold text-6xl text-bermuda',
                            )}
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    scale: 0.96,
                                    translateY: 40,
                                    clipPath: 'inset(100% 0% 0% 0%)',
                                },
                                visible: {
                                    clipPath: 'inset(0% 0% 0% 0%)',
                                    opacity: 1,
                                    scale: 1,
                                    translateY: 0,
                                    transition: {duration: 0.5, delay: 0.2},
                                },
                            }}
                        >
                            {professionalWriters}
                        </motion.h1>
                        <motion.p
                            className="text-sm capitalize py-2"
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            variants={{
                                hidden: {opacity: 0, scale: 0.96, translateX: 40},
                                visible: {
                                    opacity: 1,
                                    scale: 1,
                                    translateX: 0,
                                    transition: {duration: 0.5, delay: 0.3},
                                },
                            }}
                        >
                            Professional Writers
                        </motion.p>
                    </div>
                    <div>
                        <motion.h1
                            className={classNames(
                                "font-sans",
                                'font-bold text-6xl text-bermuda',
                            )}
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    scale: 0.96,
                                    translateY: 40,
                                    clipPath: 'inset(100% 0% 0% 0%)',
                                },
                                visible: {
                                    clipPath: 'inset(0% 0% 0% 0%)',
                                    opacity: 1,
                                    scale: 1,
                                    translateY: 0,
                                    transition: { duration: 0.5, delay: 0.4 },
                                },
                            }}
                        >
                            {writersOnline}
                        </motion.h1>
                        <motion.p
                            className="text-sm capitalize py-2"
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            variants={{
                                hidden: { opacity: 0, scale: 0.96, translateX: 40 },
                                visible: {
                                    opacity: 1,
                                    scale: 1,
                                    translateX: 0,
                                    transition: { duration: 0.5, delay: 0.5 },
                                },
                            }}
                        >
                            Writers Online
                        </motion.p>
                    </div>
                </div>
                <div className="grid gap-8 grid-cols-2">
                    <div>
                        <motion.h1
                            className={classNames(
                                "font-sans",
                                'font-bold text-6xl text-bermuda',
                            )}
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    scale: 0.96,
                                    translateY: 40,
                                    clipPath: 'inset(100% 0% 0% 0%)',
                                },
                                visible: {
                                    clipPath: 'inset(0% 0% 0% 0%)',
                                    opacity: 1,
                                    scale: 1,
                                    translateY: 0,
                                    transition: { duration: 0.5, delay: 0.6 },
                                },
                            }}
                        >
                            {supportStaffOnline}
                        </motion.h1>
                        <motion.p
                            className="text-sm capitalize py-2"
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            variants={{
                                hidden: { opacity: 0, scale: 0.96, translateX: 40 },
                                visible: {
                                    opacity: 1,
                                    scale: 1,
                                    translateX: 0,
                                    transition: { duration: 0.5, delay: 0.7 },
                                },
                            }}
                        >
                            Support Staff Online
                        </motion.p>
                    </div>
                    <div>
                        <motion.h1
                            className={classNames(
                                "font-sans",
                                'font-bold text-6xl text-bermuda',
                            )}
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    scale: 0.96,
                                    translateY: 40,
                                    clipPath: 'inset(100% 0% 0% 0%)',
                                },
                                visible: {
                                    clipPath: 'inset(0% 0% 0% 0%)',
                                    opacity: 1,
                                    scale: 1,
                                    translateY: 0,
                                    transition: { duration: 0.5, delay: 0.8 },
                                },
                            }}
                        >
                            {averageScore}
                        </motion.h1>
                        <motion.p
                            className="text-sm capitalize py-2"
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            variants={{
                                hidden: { opacity: 0, scale: 0.96, translateX: 40 },
                                visible: {
                                    opacity: 1,
                                    scale: 1,
                                    translateX: 0,
                                    transition: { duration: 0.5, delay: 0.9 },
                                },
                            }}
                        >
                            Average Writer’s Score
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    </Container>
}