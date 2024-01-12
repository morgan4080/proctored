import Container from "@/components/Container";
import classNames from "@/utils/ClassNames";
import Link from "next/link";
import {Card, CardContent} from "@/components/ui/card";
import {Service} from "@/lib/service_types";

const Blogs = ({blogs}: {blogs: Service[]}) => {
    return (
        <div className="w-full bg-reef">
            <Container className="xl:px-0 pb-20">
                <div className="space-y-2 pt-20 pb-16">
                    <h2
                        className={classNames(
                            "font-sans",
                            'text-bermuda font-bold text-[52px] tracking-tight leading-[63px] capitalize text-center',
                        )}
                    >
                        Blog
                    </h2>
                    <p className="text-2xl lg:max-w-lg mx-auto text-center text-zinc-800">
                        Read about matters writing.
                    </p>
                </div>

                <div
                    className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {blogs.map((blog) => (
                        <Card key={blog._id}>
                            <CardContent>
                                <article className="flex max-w-xl flex-col items-start justify-between pt-6">
                                    <div className="flex items-center gap-x-4 text-xs">
                                        <time dateTime="2020-03-16" className="text-gray-500">
                                            Mar 16, 2020
                                        </time>
                                    </div>
                                    <div className="group relative">
                                        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                            <a href="#">
                                                <span className="absolute inset-0"></span>
                                                {blog.title}
                                            </a>
                                        </h3>
                                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                                            {blog.excerpt}
                                        </p>
                                    </div>
                                    <div className="relative mt-8 flex items-center gap-x-4">
                                        <Link
                                            href={'/blogs/' + blog.slug}
                                            className="text-sm font-semibold leading-6 text-slate-800"
                                        >
                                            Read more <span aria-hidden="true">→</span>
                                        </Link>
                                    </div>
                                </article>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-center align-center pt-16">
                    <Link
                        href="/order/create"
                        className="bg-teal-300 w-44 py-3 px-8 text-xl rounded-2xl text-black font-semibold hidden lg:inline-block mt-4 transform hover:scale-105 transition ease-in-out duration-100"
                    >
                        Order Now
                    </Link>
                </div>
            </Container>
        </div>
    )
}

export default Blogs