import {Container} from "@/components/Container";
import {Sulphur_Point, Stalinist_One} from "@next/font/google";
import classNames from "@/Utils/ClassNames";
import Link from "next/link";
import Logo from "@/components/Logo";
const sulphur_point_400 = Sulphur_Point({subsets: ['latin'], weight: "400"})
const Footer = () => {
    const backToTop = () => {
        if (document) {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
    }

    return (
        <>
            <Container className="py-10 min-w-full dark:bg-gray-900">
                <div className="sm:grid sm:grid-cols-2 sm:gap-8 xl:col-span-3">
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                        <div className="hidden lg:block">
                            <ul role="list" className={classNames(sulphur_point_400.className, "mt-6")}>
                                <Logo className="w-52 md:mx-auto dark:text-white"/>
                            </ul>
                        </div>
                        <div className="mt-10 md:mt-0">
                            <ul role="list" className={classNames(sulphur_point_400.className, "mt-6 space-y-4")}>
                                <li>
                                    <Link href="/" className="dark:text-white">
                                        Samples
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="dark:text-white">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                        <div>
                            <ul role="list" className={classNames(sulphur_point_400.className, "mt-6 space-y-4")}>

                                <li>
                                    <Link href="/" className="dark:text-white">
                                        Privacy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="dark:text-white">
                                        Terms & Conditions
                                    </Link>
                                </li>

                            </ul>
                        </div>
                        <div className="mt-10 md:mt-0">
                            <h2 className="text-2xl italic font-semibold leading-none pb-1 dark:text-white">
                                We accept:
                            </h2>
                            <ul role="list" className={classNames(sulphur_point_400.className, "mt-6 space-x-2 flex")}>

                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px"
                                         height="48px">
                                        <path fill="#1565C0"
                                              d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"/>
                                        <path fill="#FFF"
                                              d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30L20.56 30 22.296 19 19.389 19zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.674 1.991.674l.466-2.309c0 0-1.358-.515-2.691-.515-3.019 0-4.576 1.444-4.576 3.272 0 3.306 3.979 2.853 3.979 4.551 0 .291-.231.964-1.888.964-1.662 0-2.759-.609-2.759-.609l-.495 2.216c0 0 1.063.606 3.117.606 2.059 0 4.915-1.54 4.915-3.752C30.354 23.586 26.369 23.394 26.369 22.206z"/>
                                        <path fill="#FFC107"
                                              d="M12.212,24.945l-0.966-4.748c0,0-0.437-1.029-1.573-1.029c-1.136,0-4.44,0-4.44,0S10.894,20.84,12.212,24.945z"/>
                                    </svg>
                                </li>
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px"
                                         height="48px">
                                        <linearGradient id="NgmlaCv2fU27PJOuiUvQVa" x1="20.375" x2="28.748"
                                                        y1="1365.061" y2="1394.946"
                                                        gradientTransform="translate(0 -1354)"
                                                        gradientUnits="userSpaceOnUse">
                                            <stop offset="0" stopColor="#00b3ee"/>
                                            <stop offset="1" stopColor="#0082d8"/>
                                        </linearGradient>
                                        <path fill="url(#NgmlaCv2fU27PJOuiUvQVa)"
                                              d="M43.125,9H4.875C3.287,9,2,10.287,2,11.875v24.25C2,37.713,3.287,39,4.875,39h38.25 C44.713,39,46,37.713,46,36.125v-24.25C46,10.287,44.713,9,43.125,9z"/>
                                        <circle cx="17.053" cy="24.053" r="10.053" fill="#cf1928"/>
                                        <linearGradient id="NgmlaCv2fU27PJOuiUvQVb" x1="20" x2="40.107" y1="24.053"
                                                        y2="24.053" gradientUnits="userSpaceOnUse">
                                            <stop offset="0" stopColor="#fede00"/>
                                            <stop offset="1" stopColor="#ffd000"/>
                                        </linearGradient>
                                        <circle cx="30.053" cy="24.053" r="10.053" fill="url(#NgmlaCv2fU27PJOuiUvQVb)"/>
                                        <path fill="#d97218"
                                              d="M20,24.053c0,3.072,1.382,5.818,3.553,7.662c2.172-1.844,3.553-4.59,3.553-7.662 s-1.382-5.818-3.553-7.662C21.382,18.235,20,20.981,20,24.053z"/>
                                    </svg>
                                </li>
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px"
                                         height="48px">
                                        <path fill="#1565C0"
                                              d="M18.7,13.767l0.005,0.002C18.809,13.326,19.187,13,19.66,13h13.472c0.017,0,0.034-0.007,0.051-0.006C32.896,8.215,28.887,6,25.35,6H11.878c-0.474,0-0.852,0.335-0.955,0.777l-0.005-0.002L5.029,33.813l0.013,0.001c-0.014,0.064-0.039,0.125-0.039,0.194c0,0.553,0.447,0.991,1,0.991h8.071L18.7,13.767z"/>
                                        <path fill="#039BE5"
                                              d="M33.183,12.994c0.053,0.876-0.005,1.829-0.229,2.882c-1.281,5.995-5.912,9.115-11.635,9.115c0,0-3.47,0-4.313,0c-0.521,0-0.767,0.306-0.88,0.54l-1.74,8.049l-0.305,1.429h-0.006l-1.263,5.796l0.013,0.001c-0.014,0.064-0.039,0.125-0.039,0.194c0,0.553,0.447,1,1,1h7.333l0.013-0.01c0.472-0.007,0.847-0.344,0.945-0.788l0.018-0.015l1.812-8.416c0,0,0.126-0.803,0.97-0.803s4.178,0,4.178,0c5.723,0,10.401-3.106,11.683-9.102C42.18,16.106,37.358,13.019,33.183,12.994z"/>
                                        <path fill="#283593"
                                              d="M19.66,13c-0.474,0-0.852,0.326-0.955,0.769L18.7,13.767l-2.575,11.765c0.113-0.234,0.359-0.54,0.88-0.54c0.844,0,4.235,0,4.235,0c5.723,0,10.432-3.12,11.713-9.115c0.225-1.053,0.282-2.006,0.229-2.882C33.166,12.993,33.148,13,33.132,13H19.66z"/>
                                    </svg>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>
            <div className="text-center pb-52 lg:py-5 dark:bg-gray-900">
                <p className={classNames(sulphur_point_400.className, "dark:text-white py-1")}>
                    Copyright © 2020 <a className="text-sky-300" href="https://proctorowls.com">Proctor Owls</a> All Rights Reserved.
                    <a href="https://morganmutugi.co.ke" target="_blank" className="hover:text-white text-sky-300"> By
                        Morgan.</a>
                </p>
            </div>
        </>
    )
}

export default Footer