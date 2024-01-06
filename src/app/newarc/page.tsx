import { Metadata } from 'next';
import HeroSection from "@/app/newarc/components/HeroSection";
import WriterSection from "@/app/newarc/components/WriterSection";
import {FaqType, StoreDataType, WriterType} from "@/lib/service_types";
import HowTo from "@/app/newarc/components/HowTo";
import Stats from "@/app/newarc/components/Stats";
import Pricing from "@/app/newarc/components/Pricing";
import Reviews, {ReviewsType} from "@/app/newarc/components/Reviews";
import TrustGuarantees from "@/app/newarc/components/TrustGuarantees";
import Values from "@/app/newarc/components/Values";
import FAQS from "@/app/newarc/components/FAQS";
import Features from "@/app/newarc/components/Features";

export const metadata: Metadata = {
    title: 'Test Page',
}

export default async function Page() {
    const writers: WriterType[] = JSON.parse(await getWriters())
    const storeData: StoreDataType[] = JSON.parse(await getStoreData())
    const faqs: FaqType[] = JSON.parse(await getFAQS())
    const {average, totalCount, counts, reviews} = await getReviews()
    const values = await getCompanyValues()
    return (
        <div className='flex min-h-screen flex-col items-center justify-between relative'>
            <HeroSection/>
            <WriterSection writers={writers} />
            <HowTo />
            <Stats />
            <Pricing storedata={storeData} />
            <Reviews average={average} totalCount={totalCount} counts={counts} reviews={reviews} />
            <TrustGuarantees />
            <Values values={values} />
            <FAQS FAQs={faqs} />
            <Features />
        </div>
    )
}

async function getWriters(): Promise<string> {
    const res = await fetch(process.env.NEXTAUTH_URL + '/api/writers')
    if (!res.ok) {
        throw new Error("Could not fetch writers")
    }

    return res.json()
}

async function getStoreData(): Promise<string> {
    const res = await fetch(process.env.NEXTAUTH_URL + '/api/storedata')
    if (!res.ok) {
        throw new Error("Could not fetch store data")
    }

    return res.json()
}

async function getReviews(): Promise<ReviewsType> {
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
                <p>This is the bag of my dreams. I took it on my last vacation and was able to fit an absurd amount of snacks for the many long and hungry flights.</p>
            `,
                created: new Date().toDateString(),
                user: {
                    name: 'Emily Selman',
                    image:
                        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
                }
            },
            {
                id: 1,
                rating: 5,
                subject: ``,
                description: `
                <p>This is the bag of my dreams. I took it on my last vacation and was able to fit an absurd amount of snacks for the many long and hungry flights.</p>
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

async function getCompanyValues() {
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

async function getFAQS() {
    const res = await fetch(process.env.NEXTAUTH_URL + '/api/faqs')
    if (!res.ok) {
        throw new Error("Could not fetch faqs")
    }

    return res.json()
}