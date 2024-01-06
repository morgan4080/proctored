import Container from "@/components/Container";
import Link from "next/link";
import dynamic from "next/dynamic";
const HeroArt = dynamic(() => import('@/components/HeroArt'), {
    ssr: true,
});

export default function HeroSection() {
    return <div className="w-full -mt-44 md:-mt-44 lg:-mt-28 relative">
        <div className="absolute inset-0 w-full h-full designHero"></div>
        <Container className="xl:px-0 pb-24 pt-56 lg:pt-44 lg:pb-36" parentClassName="relative">
            <div className="lg:grid lg:grid-cols-2">
                <div className="flex flex-col justify-center items-center lg:items-start">
                    <h1
                        className="font-sans text-4xl text-center lg:text-left md:text-6xl lg:text-7xl text-white font-medium leading-tight tracking-tight py-2 lg:py-0"
                    >
                        <span>Professional</span>
                        <br/>
                        <span className="wrap transition duration-150 ease-in-out"></span>
                        <br/>
                        <span>Help</span>
                    </h1>
                    <p className="py-6 max-w-2xl text-lg tracking-wider text-white text-center lg:text-left">
                        We are reliable professional writers & academic researchers.
                        We pursue quality and excellence in providing academic help.
                    </p>

                    <Link
                        href="/order/create"
                        className="group mb-12 text-xl bg-black/25 text-center w-52 drop-shadow-2xl shadow-sm py-3 px-8 rounded-full text-white backdrop-blur font-semibold mt-4 transform hover:scale-105 transition ease-in-out duration-100"
                    >
                        Get Started <span
                        className="opacity-0 transform group-hover:opacity-100 transition ease-in-out duration-100 w-1">→</span>
                    </Link>
                </div>
                <div className="flex justify-center lg:justify-end relative">
                    <HeroArt className="h-1/2 lg:w-full lg:h-full md:translate-x-12"/>
                </div>
            </div>
        </Container>
    </div>
}