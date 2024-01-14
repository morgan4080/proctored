import classNames from "@/utils/ClassNames";
import Container from "@/components/Container";
import Link from "next/link";
import {Dialog, DialogOverlay, DialogPortal} from "@/components/ui/dialog";



export type ReviewsType = {
    average: number;
    totalCount: number;
    counts: {rating: number; count: number}[]
    reviews: {
        id: number;
        rating: number;
        subject: string;
        description: string;
        created: string;
        user: {
            name: string;
            image: string;
        }
    }[]
}

export default function Reviews({average, totalCount, counts, reviews, review, rating}: Readonly<ReviewsType & {review: string | null; rating: number | null}>) {
    const addReview = async (formData: FormData) => {
        'use server'
        const comment = formData.get('comment')
        console.log("read review", rating, comment)
    }
    return <Container className="xl:px-0 space-y-16 relative">
        <div id="review" className="pt-20 max-w-4xl space-y-6 -mb-16">
            <h2
                className={classNames(
                    "font-sans",
                    'text-3xl leading-snug tracking-tight sm:text-4xl md:text-5xl text-slate-900 text-left',
                )}
            >
                Reviews, comments from customers and
                 community
            </h2>
            <p className="text-xl mx-auto text-left tracking-tight text-slate-600">
                Feel free to leave us a review.
            </p>
        </div>
        <div>
            <div
                className="max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:py-32 lg:px-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
                <div className="lg:col-span-4">
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Customer Reviews</h2>

                    <div className="mt-3 flex items-center">
                        <div>
                            <div className="flex items-center">

                                {
                                    Array.from({ length: 5 }, (_, index) => index).map((item, index) => (
                                        index < average ?
                                            <svg key={item} className="flex-shrink-0 h-5 w-5 text-yellow-400"
                                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                 fill="currentColor"
                                                 aria-hidden="true">
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg> :
                                            <svg key={item} className="flex-shrink-0 h-5 w-5 text-gray-300"
                                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                 fill="currentColor" aria-hidden="true">
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                    ))
                                }

                            </div>
                            <p className="sr-only">{average} out of 5 stars</p>
                        </div>
                        <p className="ml-2 text-sm text-gray-900">Based on {totalCount} reviews</p>
                    </div>

                    <div className="mt-6">
                        <h3 className="sr-only">Review data</h3>

                        <dl className="space-y-3">

                            {
                                counts.map((item, index) => (
                                    <div key={`${index + item.rating + item.count}`} className="flex items-center text-sm">
                                        <dt className="flex-1 flex items-center">
                                            <p className="w-3 font-medium text-gray-900">5<span className="sr-only"> star reviews</span>
                                            </p>
                                            <div aria-hidden="true" className="ml-1 flex-1 flex items-center">
                                                <svg className="flex-shrink-0 h-5 w-5 text-yellow-400"
                                                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                     fill="currentColor"
                                                     aria-hidden="true">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </svg>

                                                <div className="ml-3 relative flex-1">
                                                    <div
                                                        className="h-3 bg-gray-100 border border-gray-200 rounded-full"></div>

                                                    <div style={{width: `calc(${item.count/totalCount * 100}%)`}}
                                                         className="absolute inset-y-0 bg-yellow-400 border border-yellow-400 rounded-full"></div>
                                                </div>
                                            </div>
                                        </dt>
                                        <dd className="ml-3 w-10 text-right tabular-nums text-sm text-gray-900">{Math.round(item.count/totalCount * 100)}%</dd>
                                    </div>
                                ))
                            }

                        </dl>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-lg font-medium text-gray-900">Share your thoughts</h3>
                        <p className="mt-1 text-sm text-gray-600">If you’ve used this product, share your thoughts with
                            other customers</p>

                        <Link href="?review='' ''"
                           className="mt-6 inline-flex w-full bg-white border border-gray-300 rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full">Write
                            a review</Link>
                    </div>
                </div>

                <div className="mt-16 lg:mt-0 lg:col-start-6 lg:col-span-7">
                    <h3 className="sr-only">Recent reviews</h3>

                    <div className="flow-root">
                        <div className="-my-12 divide-y divide-gray-200">

                            {
                                reviews.map((review, index) => (
                                    <div key={`${index + review.id}`} className="py-12">
                                        <div className="flex items-center">
                                            <img
                                                src={review.user.image}
                                                alt={review.user.name} className="h-12 w-12 rounded-full"/>
                                            <div className="ml-4">
                                                <h4 className="text-sm font-bold text-gray-900">{review.user.name}</h4>
                                                <div className="mt-1 flex items-center">

                                                    {
                                                        Array.from({ length: 5 }, (_, index) => index).map((item, index) => (
                                                            index < review.rating ?
                                                                <svg key={item} className="text-yellow-400 h-5 w-5 flex-shrink-0"
                                                                     xmlns="http://www.w3.org/2000/svg"
                                                                     viewBox="0 0 20 20"
                                                                     fill="currentColor" aria-hidden="true">
                                                                    <path
                                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                                </svg> :
                                                                <svg key={item}
                                                                     className="flex-shrink-0 h-5 w-5 text-gray-300"
                                                                     xmlns="http://www.w3.org/2000/svg"
                                                                     viewBox="0 0 20 20"
                                                                     fill="currentColor" aria-hidden="true">
                                                                    <path
                                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                                </svg>
                                                        ))
                                                    }

                                                </div>
                                                <p className="sr-only">5 out of 5 stars</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-6 text-base italic text-gray-600" dangerouslySetInnerHTML={{
                                            __html: review.description,
                                        }} />
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Dialog open={!!review} defaultOpen={false}>
            <DialogPortal>
                <DialogOverlay className="flex items-center justify-center">
                    <div
                        className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                        <form className="space-y-3" action={addReview as any}>
                            <div className="col-span-full">
                                <label htmlFor="rating"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    Rating (1-5)
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center">
                                        {Array.from({length: 5}, (_, index) => index).map((item, index) => (
                                            <Link key={item} href={`?review=${review}&rating=${item + 1}`}>
                                                {
                                                    rating && index < rating ?
                                                        <svg key={item}
                                                             className="flex-shrink-0 h-5 w-5 text-yellow-400"
                                                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                             fill="currentColor"
                                                             aria-hidden="true">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                        </svg> :
                                                        <svg
                                                            className="flex-shrink-0 h-5 w-5 text-gray-300 hover:text-yellow-500"
                                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                            fill="currentColor" aria-hidden="true">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                        </svg>
                                                }
                                            </Link>
                                        ))}
                                    </div>
                                    <input
                                        id="rating"
                                        name="rating"
                                        className="hidden w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 p-2 outline-0 sm:text-sm sm:leading-6"
                                        defaultValue={rating ?? 1}
                                        type="number"
                                        max={5}
                                        min={1}
                                    />
                                </div>
                                <label htmlFor="comment"
                                       className="block text-sm font-medium leading-6 text-gray-900 mt-1">
                                    Review
                                </label>
                                <div className="mt-2">
                                        <textarea
                                            id="comment"
                                            name="comment"
                                            rows={3}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 p-2 outline-0 sm:text-sm sm:leading-6"
                                            defaultValue={review ?? ''}
                                        />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about
                                    the service.</p>

                            </div>
                            <div className="mt-5 sm:mt-6 flex gap-4">
                                <Link
                                    href="/"
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </DialogOverlay>
            </DialogPortal>
        </Dialog>
    </Container>
}