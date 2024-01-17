import {CheckCircleIcon} from "lucide-react";

const EssayWriter = () => {
    return (
        <div className="bg-white px-6 py-32 lg:px-8">
            <div className="mx-auto max-w-7xl text-base leading-7 text-gray-700">
                <p className="text-base font-semibold leading-7 text-bermuda text-left">We get you quality grades.</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What you get in the end.</h1>
                <p className="mt-6 text-xl leading-8">
                    Wondering why you should order an essay at our essay writing service? “What’s in it for me?” you might wonder. It’s a fair question! Here are several results of choosing to order a piece online. We are sure, they will speak louder than any of our words:
                </p>
                <div className="mt-10 max-w-7xl">
                    <ul className="max-w-7xl space-y-8 text-gray-600">
                        <li className="flex gap-x-3">
                            <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-bermuda" aria-hidden="true"/>
                            <span>
                                <strong className="font-semibold text-gray-900">Top Grades.</strong> They are important. After all, we are all striving to achieve the highest grades. They have the potential to directly influence what jobs we get in the future. That is why it is in your best interest to hire a professional essay writing service to compose a decent piece.
                              </span>
                        </li>
                        <li className="flex gap-x-3">
                            <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-bermuda" aria-hidden="true"/>
                            <span>
                                <strong className="font-semibold text-gray-900">A happy professor.</strong> Don&apos;t look surprised! Earning a good reputation in the eyes of your college professor is vital, since in many cases your reputation will work for you even when you&apos;re far from being the best student.
                              </span>
                        </li>
                        <li className="flex gap-x-3">
                            <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-bermuda" aria-hidden="true"/>
                            <span>
                                <strong className="font-semibold text-gray-900">Top-notch paper.</strong> A decent paper can help you get into a college of your dream, improve your GPA, or even get you a scholarship. No matter which of these you&apos;re pursuing, it&apos;s always a good idea to have an essay professionally crafted.
                              </span>
                        </li>
                        <li className="flex gap-x-3">
                            <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-bermuda" aria-hidden="true"/>
                            <span>
                                <strong className="font-semibold text-gray-900">Good social and academic life balance.</strong> It is often essential for students to hire essay writing services to craft pieces for them because otherwise, students will have no personal life with all the overwhelming academic tasks they have to deal with daily. Can&apos;t help but miss going out with your friends? We&apos;re here to help! These are but a few benefits you get when ordering an essay online instead of writing it on your own. Look at this list again and if it sounds ike something you&apos;d like to take advantage of right now, drop us a line!
                              </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default EssayWriter