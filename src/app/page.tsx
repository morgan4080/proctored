import { Metadata } from 'next';
import HeroSection from "@/app/components/HeroSection";
import WriterSection from "@/app/components/WriterSection";
import HowTo from "@/app/components/HowTo";
import Stats from "@/app/components/Stats";
import Pricing from "@/app/components/Pricing";
import Reviews from "@/app/components/Reviews";
import TrustGuarantees from "@/app/components/TrustGuarantees";
import Values from "@/app/components/Values";
import Faqs from "@/app/components/FAQS";
import Features from "@/app/components/Features";
import EssayWriter from "@/app/components/Content";
import Blogs from "@/app/components/Blogs";
import {
    getBlogPartial,
    getCompanyValues,
    getFAQS,
    getReviews,
    getStoreData,
    getWriters
} from "@/commons/utility_functions";

export const metadata: Metadata = {
    title: 'Proctor Owls/ Research Owls | Homepage',
    description: 'Offering Professional Help in Proctored Exams, Nursing Exams and Essay Writing',
}

export default async function Page({searchParams}: Readonly<{ searchParams: Record<any, any> }>) {
    const {review, rating} = searchParams
    const writers = await getWriters()
    const storeData = await getStoreData()
    const faqs = await getFAQS()
    const {average, totalCount, counts, reviews} = await getReviews()
    const values = await getCompanyValues()
    const blogs = await getBlogPartial()
    return (
        <main className='flex min-h-screen flex-col items-center justify-between overflow-x-hidden relative'>
            <HeroSection/>
            <WriterSection writers={writers} />
            <HowTo />
            <Pricing storedata={storeData} />
            <Faqs Faqs={faqs} />
            <Stats />
            <Features />
            <Values values={values} />
            <Reviews average={average} totalCount={totalCount} counts={counts} reviews={reviews} review={review} rating={rating}/>
            <TrustGuarantees />
            <EssayWriter />
            <Blogs blogs={blogs} />
        </main>
    )
}