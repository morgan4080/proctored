import {FaqType, Service, ServiceCategoriesWithSubCategories, StoreDataType, WriterType} from "@/lib/service_types";
import {ReviewsType} from "@/app/components/Reviews";
import mongoClient from "@/lib/mongodb";
const { clientPromise } = mongoClient;

export async function getWriters(): Promise<WriterType[]> {
    const res = await fetch(process.env.NEXTAUTH_URL + '/api/writers')
    if (!res.ok) {
        throw new Error("Could not fetch writers")
    }

    const writers = await res.json()

    return JSON.parse(writers)
}

export async function getStoreData(): Promise<StoreDataType[]> {
    const res = await fetch(process.env.NEXTAUTH_URL + '/api/storedata')
    if (!res.ok) {
        throw new Error("Could not fetch store data")
    }

    const store_data = await res.json()

    return JSON.parse(store_data)
}

export async function getReviews(): Promise<ReviewsType> {
    return {
        average: 4,
        totalCount: 1624,
        counts: [
            { rating: 5, count: 1019 },
            { rating: 4, count: 162 },
            { rating: 3, count: 97 },
            { rating: 2, count: 199 },
            { rating: 1, count: 147 },
        ],
        reviews: [
            {
                id: 1,
                rating: 5,
                subject: ``,
                description: `
                <p>They were very professional, and I am happy with the work. They helped me a lot and saved me a huge amount of time. I will be very happy to contact them for future academic work again.</p>
            `,
                created: new Date().toDateString(),
                user: {
                    name: 'Emily Selman',
                    image:
                        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
                }
            },
        ]
    }
}

export async function getCompanyValues() {
    return [
        {
            name: 'We understand your style',
            description:
                'Our seasoned writers can imitate your desired style.',
        },
        {
            name: 'Young and Ambitious',
            description:
                'We break away from huge conglomerates whose interest is in your dollar.',
        },
        {
            name: 'We take data privacy seriously',
            description:
                'Our seasoned writers can imitate your desired style.',
        },
        {
            name: 'High quality for affordable prices',
            description:
                'High-quality content for the most affordable prices on the market.',
        },
        {
            name: 'Any subject, any deadline',
            description:
                'We will meet your expectations, just hire an essay writer and take a look.',
        },
        {
            name: 'Quality Samples',
            description:
                'Some of the best work of our experienced essay writers.',
        },
    ];
}

export async function getFAQS(): Promise<FaqType[]> {
    const res = await fetch(process.env.NEXTAUTH_URL + '/api/faqs')
    if (!res.ok) {
        throw new Error("Could not fetch faqs")
    }

    const faqs = await res.json()

    return JSON.parse(faqs)
}

export async function getBlogPartial() {
    const client = await clientPromise
    const db = client.db('proctor')
    const blogs = await db
        .collection<Service>('blogs')
        .find({})
        .sort({ metacritic: -1 })
        .limit(3)
        .toArray()


    return blogs.map((blog) => {
            return {
                ...blog,
                _id: blog._id.toString(),
            }
        }
    )
}

export async function getServiceCategories() {
    const client = await clientPromise
    const db = client.db('proctor')
    const servicesCategories = await db
        .collection('services_category')
        .aggregate<ServiceCategoriesWithSubCategories>([
            {
                $lookup: {
                    from: 'services_sub_category',
                    localField: 'subcategories',
                    foreignField: '_id',
                    as: 'subcategories_data',
                },
            },
            {
                $project: {
                    title: 1,
                    slug: 1,
                    description: 1,
                    products: 1,
                    subcategories: '$subcategories_data',
                },
            },
        ])
        .sort({ title: -1 })
        .limit(100)
        .toArray()

    return servicesCategories.map((s) => {
        const { _id, subcategories, ...sc } = s
        return {
            _id: _id.toString(),
            subcategories: subcategories.map((sc) => {
                const { _id, ...other } = sc
                return {
                    _id: _id.toString(),
                    ...other,
                }
            }),
            ...sc,
        }
    })
}