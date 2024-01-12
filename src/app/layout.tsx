import '@/styles/globals.scss';
import {ReactNode} from "react";
import { Metadata } from 'next';
import {CategoryWithSubCategoryAndService} from "@/lib/service_types";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {getServerSession} from "next-auth";
import type {Session} from "next-auth";
import NavBar from "@/components/navigation/NavBar";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata: Metadata = {
    title: 'Proctor Owls/ Research OWls',
    description: 'Offering Professional Help in Proctored Exams, Nursing Exams and Essay Writing',
}

// check for resolveMetadata for dynamic seo content

export default async function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children
}: Readonly<{
    children: ReactNode
}>) {
    let status: "loading" | "authenticated" | "unauthenticated" = "loading"
    const session = await getServerSession(authOptions)
    if (session == null) {
        status = "unauthenticated"
    } else {
        status = "authenticated"
    }
    const menu = await getLinks(session, status)
    return (
        <html lang="en">
        <Script src="https://fw-cdn.com/11081366/3816148.js"></Script>
        <body className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 relative">
        <NavBar menu={menu} session={session} status={status}/>
        <main className="min-h-screen">
            {children}
        </main>
        <Footer/>
        </body>
        </html>
    )
}

const getLinks = async (session: Session | null, status: "loading" | "authenticated" | "unauthenticated"): Promise<NavMenuDataType[]> => {
    const res = await fetch(process.env.NEXTAUTH_URL + '/api/services?links=true')
    // throw new Error('Application session is null')
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }
    return res.json().then(({data}) => data).then((links: CategoryWithSubCategoryAndService[]) => {
        return INITIALMENU.map((m) => {
            switch (m.name) {
                case 'Services':
                    if (m.categories.length == 0) {
                        m.categories = links.map(link => {
                            const {_id, title, slug, description, subcategories} = link
                            return {
                                _id,
                                title,
                                slug,
                                description,
                                subcategories: subcategories.map(subcategory => {
                                    return {
                                        _id: subcategory._id,
                                        title: subcategory.title,
                                        slug: subcategory.slug,
                                        description: subcategory.description,
                                        items: subcategory.services
                                    }
                                })
                            }
                        })
                    }
                    break
                case 'Account':
                    switch (status) {
                        case "authenticated":
                            const { user } = session as Session
                            if (user) {
                                switch (user.userRole) {
                                    case "user":
                                        m.categories = [
                                            {
                                                _id: 'me-' + Math.random().toString(36).slice(2, 18),
                                                title: "Profile",
                                                slug: "me",
                                                description: "Your account details",
                                                subcategories: [
                                                    {
                                                        _id: 'me-orders-' + Math.random().toString(36).slice(2, 18),
                                                        title: "Orders",
                                                        slug: "orders",
                                                        description: "orders",
                                                        items: []
                                                    },
                                                    {
                                                        _id: 'me-transactions-' + Math.random().toString(36).slice(2, 18),
                                                        title: "Transactions",
                                                        slug: "transactions",
                                                        description: "transactions",
                                                        items: []
                                                    }
                                                ]
                                            }
                                        ]
                                        break
                                    case "admin":
                                        m.categories = [
                                            {
                                                _id: 'me-' + Math.random().toString(36).slice(2, 18),
                                                title: "Profile",
                                                slug: "me",
                                                description: "Your account details",
                                                subcategories: [
                                                    {
                                                        _id: 'me-orders-' + Math.random().toString(36).slice(2, 18),
                                                        title: "Orders",
                                                        slug: "orders",
                                                        description: "orders",
                                                        items: []
                                                    },
                                                    {
                                                        _id: 'me-transactions-' + Math.random().toString(36).slice(2, 18),
                                                        title: "Transactions",
                                                        slug: "transactions",
                                                        description: "transactions",
                                                        items: []
                                                    }
                                                ]
                                            }
                                        ]
                                        break
                                    case "superuser":
                                        m.categories = [
                                            {
                                                _id: 'me-' + Math.random().toString(36).slice(2, 18),
                                                title: "Profile",
                                                slug: "me",
                                                description: "Your account details",
                                                subcategories: [
                                                    {
                                                        _id: 'me-orders-' + Math.random().toString(36).slice(2, 18),
                                                        title: "Your Orders",
                                                        slug: "orders",
                                                        description: "orders",
                                                        items: [
                                                            {
                                                                _id: 'me-orders-' + Math.random().toString(36).slice(2, 18),
                                                                title: "Orders",
                                                                slug: "",
                                                                excerpt: "prooctorowls orders"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        _id: 'me-transactions-' + Math.random().toString(36).slice(2, 18),
                                                        title: "Your Transactions",
                                                        slug: "transactions",
                                                        description: "transactions",
                                                        items: [
                                                            {
                                                                _id: 'me-transactions-' + Math.random().toString(36).slice(2, 18),
                                                                title: "Transaction",
                                                                slug: "",
                                                                excerpt: "prooctorowls transactions"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                _id: 'admin-' + Math.random().toString(36).slice(2, 18),
                                                title: "Admin Dashboard",
                                                slug: "admin",
                                                description: "Admin account pages",
                                                subcategories: [
                                                    {
                                                        _id: 'admin-users-' + Math.random().toString(36).slice(2, 18),
                                                        title: "All Users",
                                                        slug: "users",
                                                        description: "users",
                                                        items: [
                                                            {
                                                                _id: 'admin-users-' + Math.random().toString(36).slice(2, 18),
                                                                title: "Users",
                                                                slug: "",
                                                                excerpt: "prooctorowls users"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        _id: 'admin-orders-' + Math.random().toString(36).slice(2, 18),
                                                        title: "All Orders",
                                                        slug: "orders",
                                                        description: "orders",
                                                        items: [
                                                            {
                                                                _id: 'admin-orders-' + Math.random().toString(36).slice(2, 18),
                                                                title: "Orders",
                                                                slug: "",
                                                                excerpt: "prooctorowls orders"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        _id: 'admin-transactions-' + Math.random().toString(36).slice(2, 18),
                                                        title: "All Transactions",
                                                        slug: "transactions",
                                                        description: "transactions",
                                                        items: [
                                                            {
                                                                _id: 'admin-transactions-' + Math.random().toString(36).slice(2, 18),
                                                                title: "Transactions",
                                                                slug: "",
                                                                excerpt: "prooctorowls transactions"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        _id: 'admin-services-' + Math.random().toString(36).slice(2, 18),
                                                        title: "All Services",
                                                        slug: "services",
                                                        description: "services",
                                                        items: [
                                                            {
                                                                _id: 'admin-services-' + Math.random().toString(36).slice(2, 18),
                                                                title: "Services",
                                                                slug: "",
                                                                excerpt: "prooctorowls services"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        _id: 'admin-papers-' + Math.random().toString(36).slice(2, 18),
                                                        title: "All Papers",
                                                        slug: "papers",
                                                        description: "papers",
                                                        items: [
                                                            {
                                                                _id: 'admin-papers-' + Math.random().toString(36).slice(2, 18),
                                                                title: "Papers",
                                                                slug: "",
                                                                excerpt: "prooctorowls papers"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        _id: 'admin-blogs-' + Math.random().toString(36).slice(2, 18),
                                                        title: "All Blogs",
                                                        slug: "blogs",
                                                        description: "blogs",
                                                        items: [
                                                            {
                                                                _id: 'admin-blogs-' + Math.random().toString(36).slice(2, 18),
                                                                title: "Blogs",
                                                                slug: "",
                                                                excerpt: "prooctorowls blogs"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                        break
                                }
                            }
                            break
                        case "unauthenticated":
                            m.categories = [
                                {
                                    _id: 'login-' + Math.random().toString(36).slice(2, 18),
                                    title: "Login",
                                    slug: "",
                                    description: "signin   to account",
                                    subcategories: [
                                        {
                                            _id: 'login-' + Math.random().toString(36).slice(2, 18),
                                            title: "User Login",
                                            slug: "",
                                            description: "login",
                                            items: [
                                                {
                                                    _id: 'login-' + Math.random().toString(36).slice(2, 18),
                                                    title: "Login",
                                                    slug: "",
                                                    excerpt: "prooctorowls login"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    _id: 'signup-' + Math.random().toString(36).slice(2, 18),
                                    title: "Sign Up",
                                    slug: "",
                                    description: "create an account",
                                    subcategories: [
                                        {
                                            _id: 'signup-' + Math.random().toString(36).slice(2, 18),
                                            title: "User Signup",
                                            slug: "",
                                            description: "signup",
                                            items: [
                                                {
                                                    _id: 'signup-' + Math.random().toString(36).slice(2, 18),
                                                    title: "Signup",
                                                    slug: "",
                                                    excerpt: "prooctorowls signup"
                                                }
                                            ]
                                        },
                                    ]
                                }
                            ]
                            break
                    }
                    break
            }
            return m
        })
    })
}

export type NavMenuDataType = {
    name: string;
    categories:  {
        _id: string
        title: string
        slug: string
        description: string
        subcategories: {
            _id: string
            title: string
            slug: string
            description: string
            items: {
                _id: string
                title: string
                slug: string
                excerpt: string
            }[]
        }[]
    }[];
    link: string;
}

const INITIALMENU: NavMenuDataType[] = [
    {
        name: 'Home',
        categories: [],
        link: '/',
    },
    {
        name: 'Services',
        categories: [],
        link: '#services',
    },
    {
        name: 'Papers',
        categories: [],
        link: '/papers',
    },
    {
        name: 'Blogs',
        categories: [],
        link: '/blogs',
    },
    {
        name: 'Account',
        categories: [],
        link: '#account',
    },
]

