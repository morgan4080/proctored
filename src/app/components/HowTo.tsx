'use client';
import Container from "@/components/Container";
import classNames from "@/utils/ClassNames";
import {motion, useInView} from "framer-motion";
import Image from "next/image";
import {useRef} from "react";

export default function HowTo() {
    const line = useRef(null)
    const isLineInView = useInView(line, { once: false })
    return <div className="bg-reef w-full">
        <Container className="xl:px-0 pb-28 pt-20 sm:py-32">
            <div className="mx-auto max-w-7xl">
                <h2 className="text-3xl tracking-tight sm:text-4xl md:text-5xl text-bermuda text-center lg:text-left font-sans">
                    Creating an order?
                </h2>
            </div>
            <motion.div
                ref={line}
                className="grid lg:gap-8 lg:grid-cols-4 space-y-16 lg:space-y-0 mx-auto relative pt-20"
            >
                <motion.div className="flex flex-col">
                    <div className="flex-1 flex items-center justify-center pb-11">
                        <Image
                            className="overflow-hidden z-10"
                            src={'/image 10.png'}
                            alt="how to place your order 1"
                            width={151}
                            height={151}
                            priority
                        />
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <h6
                            className={classNames(
                                "font-sans",
                                'text-center font-semibold text-slate-900 text-xl pb-1.5',
                            )}
                        >
                            1. Submit instructions
                        </h6>
                        <p className="text-center text-lg font-light">
                            Fill out an order form and include as much detail as
                            possible.
                        </p>
                    </div>
                </motion.div>
                <motion.div className="flex flex-col-reverse lg:flex-col">
                    <div className="flex-1 flex flex-col items-center justify-center pb-0 lg:pb-11">
                        <h6
                            className={classNames(
                                "font-sans",
                                'text-center font-semibold text-slate-900 text-xl pb-1.5',
                            )}
                        >
                            2. Choose writer
                        </h6>
                        <p className="text-center text-lg font-light">
                            Pick a writer or leave it to our AI matching system, then
                            add funds
                        </p>
                    </div>
                    <div className="flex-1 flex items-center justify-center pb-11 lg:pb-0">
                        <Image
                            className="overflow-hidden z-10"
                            src={'/image 11.png'}
                            alt="how to place your order 2"
                            width={151}
                            height={151}
                            priority
                        />
                    </div>
                </motion.div>
                <motion.div className="flex flex-col">
                    <div className="flex-1 flex items-center justify-center pb-11">
                        <Image
                            className="overflow-hidden z-10"
                            src={'/image 12.png'}
                            alt="how to place your order 3"
                            width={151}
                            height={151}
                            priority
                        />
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <h6
                            className={classNames(
                                "font-sans",
                                'text-center font-semibold text-slate-900 text-xl pb-1.5',
                            )}
                        >
                            3. Track order
                        </h6>
                        <p className="text-center text-lg font-light">
                            Check the status of your order or chat with your writer at
                            any time.
                        </p>
                    </div>
                </motion.div>
                <motion.div className="flex flex-col-reverse lg:flex-col">
                    <div className="flex-1 flex flex-col items-center justify-center pb-0 lg:pb-11">
                        <h6
                            className={classNames(
                                "font-sans",
                                'text-center font-semibold text-slate-900 text-xl pb-1.5',
                            )}
                        >
                            4. Check paper
                        </h6>
                        <p className="text-center text-lg font-light">
                            Revise your paper and release funds to the writer when
                            you’re satisfied.
                        </p>
                    </div>
                    <div className="flex-1 flex items-center justify-center pb-11 lg:pb-0">
                        <Image
                            className="overflow-hidden z-10"
                            src={'/image 13.png'}
                            alt="how to place your order 4"
                            width={151}
                            height={151}
                            priority
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate={isLineInView ? 'visible' : 'hidden'}
                    variants={{
                        hidden: {clipPath: 'inset(0% 100% 0% 0%)'},
                        visible: {
                            clipPath: 'inset(0% 0% 0% 0%)',
                            transition: {duration: 2},
                        },
                    }}
                    className="absolute w-full h-full hidden lg:flex items-center justify-center"
                >
                    <Image
                        className="w-2/3 -translate-x-4"
                        src={'/img_1.png'}
                        alt="how to place your order 1"
                        width={868.5}
                        height={192.74}
                        priority
                    />
                </motion.div>
                <motion.div
                    initial="hidden"
                    animate={isLineInView ? 'visible' : 'hidden'}
                    variants={{
                        hidden: {clipPath: 'inset(0% 100% 0% 0%)'},
                        visible: {
                            clipPath: 'inset(0% 0% 0% 0%)',
                            transition: {duration: 2},
                        },
                    }}
                    className="absolute h-full flex lg:hidden items-center justify-center z-0"
                >
                    <Image
                        className="scale-[3] translate-x-8 translate-y-1 rotate-45"
                        src={'/img_1.png'}
                        alt="how to place your order 1"
                        width={868.5}
                        height={192.74}
                        priority
                    />
                </motion.div>
            </motion.div>
        </Container>
    </div>
}