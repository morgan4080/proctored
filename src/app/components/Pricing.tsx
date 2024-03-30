'use client';
import Container from "@/components/Container";
import classNames from "@/utils/ClassNames";
import {motion, useInView} from "framer-motion";
import PaymentIcons from "@/components/transactions/PaymentIcons";
import PriceCalc from "@/components/transactions/PriceCalc";
import {useRef} from "react";
import {StoreDataType} from "@/lib/service_types";
import Link from "next/link";

export default function Pricing({ storedata }: { storedata: StoreDataType[] }) {
    const ref2 = useRef(null)
    const isInView2 = useInView(ref2, { once: false })
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                delayChildren: 0.5
            }
        }
    }
    const item = {
        hidden: { opacity: 0 },
        show: { opacity: 1 }
    }
    return <div className="w-full bg-gradient-to-br from-bermuda to-plumes">
        <Container className="xl:px-0 py-32">
            <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-2 max-w-6xl mx-auto">
                <div ref={ref2} className="col-span-1 text-center md:text-left">
                    <h1
                        className={classNames(
                            "font-sans",
                            'text-white font-bold text-[52px] tracking-tight leading-[63px] capitalize pb-2',
                        )}
                    >
                        Find out what your paper will cost
                    </h1>
                    <p className="my-6 text-white/80 font-normal text-xl">
                        Find out what the service will cost.
                    </p>
                    <Link className="bg-teal-300 w-44 py-3 px-8 text-xl rounded-2xl text-black font-semibold hidden lg:inline-block mt-4 transform hover:scale-105 transition ease-in-out duration-100"
                       href="/order/create" element-id="95">Order Now</Link>

                </div>
                <div className="col-span-1 scale-125 flex items-center justify-center lg:justify-end">
                    {/*<PriceCalc storedata={storedata}/>*/}
                    <motion.ul
                        role="list"
                        className="pt-4 space-x-2 flex items-center justify-center md:justify-start"
                        variants={container}
                        initial="hidden"
                        animate={isInView2 ? 'show' : 'hidden'}
                    >
                        <motion.li variants={item}>
                            <PaymentIcons name={'visa'}/>
                        </motion.li>
                        <motion.li variants={item}>
                            <PaymentIcons name={'master-card'}/>
                        </motion.li>
                        <motion.li variants={item}>
                            <PaymentIcons name={'union'}/>
                        </motion.li>
                    </motion.ul>
                </div>
            </div>
        </Container>
    </div>
}
