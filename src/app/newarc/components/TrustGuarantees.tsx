import Container from "@/components/Container";
import classNames from "@/utils/ClassNames";
import Image from "next/image";

export default function TrustGuarantees() {
    return <Container className="xl:px-0 pb-20" parentClassName="bg-reef w-full">
        <div className="space-y-2 pt-20 pb-16">
            <p
                className={classNames(
                    "font-sans",
                    'mb-2 text-3xl tracking-tight sm:text-4xl md:text-5xl text-bermuda text-center',
                )}
            >
                Guarantees
            </p>
            <h2 className="text-base font-semibold leading-7 text-zinc-600 text-center">Bang for the buck</h2>
        </div>
        <div className="grid space-y-16 lg:space-y-0 lg:grid-cols-3 max-w-7xl mx-auto">
            <figure
                className="relative flex flex-col-reverse items-center rounded-lg p-6">
                <blockquote className="mt-6 text-slate-700 dark:text-slate-300">
                    <h5 className="font-bold text-2xl text-center">
                        100% money back
                    </h5>
                    <p className="text-center">
                        Legitimate claims will be refunded
                    </p>
                </blockquote>
                <figcaption className="flex items-center space-x-4">
                    <Image
                        src="/img_3.png"
                        alt=""
                        className="flex-none w-14 h-14 rounded-full object-cover"
                        loading="lazy"
                        width={96}
                        height={96}
                        decoding="async"
                    />
                </figcaption>
            </figure>
            <figure
                className="relative flex flex-col-reverse items-center rounded-lg p-6">
                <blockquote className="mt-6 text-slate-700 dark:text-slate-300">
                    <h5 className="font-bold text-2xl text-center">
                        Free revisions
                    </h5>
                    <p className="text-center">
                        Get your worked revised on request
                    </p>
                </blockquote>
                <figcaption className="flex items-center space-x-4">
                    <Image
                        src="/img_4.png"
                        alt=""
                        className="flex-none w-14 h-14 rounded-full object-cover"
                        loading="lazy"
                        width={96}
                        height={96}
                        decoding="async"
                    />
                </figcaption>
            </figure>
            <figure
                className="relative flex flex-col-reverse items-center rounded-lg p-6">
                <blockquote className="mt-6 text-slate-700 dark:text-slate-300">
                    <h5 className="font-bold text-2xl text-center">
                        Safe payments
                    </h5>
                    <p className="text-center">authentic payment processors</p>
                </blockquote>
                <figcaption className="flex items-center space-x-4">
                    <Image
                        src="/img_5.png"
                        alt=""
                        className="flex-none w-14 h-14 rounded-full object-cover"
                        loading="lazy"
                        width={96}
                        height={96}
                        decoding="async"
                    />
                </figcaption>
            </figure>
        </div>
    </Container>
}