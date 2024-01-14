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
                    <p
                        className={classNames(
                            "font-sans",
                            'mb-2 text-3xl tracking-tight sm:text-4xl md:text-5xl text-bermuda text-center',
                        )}
                    >
                        Blog
                    </p>
                    <h2 className="text-base font-semibold leading-7 text-zinc-600 text-center">Read about matters writing.</h2>
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
                                            <Link href={'/blogs/' + blog.slug}>
                                                <span className="absolute inset-0"></span>
                                                {blog.title}
                                            </Link>
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
            </Container>
        </div>
    )
}

export default Blogs