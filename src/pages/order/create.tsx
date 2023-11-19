import mongoClient from '@/lib/mongodb'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'

const { clientPromise } = mongoClient
export const getServerSideProps = (async () => {
  const client = await clientPromise
  const db = client.db('proctor')
  const servicesCategory = await db.collection('services_category').findOne()
  if (servicesCategory) {
    return {
      redirect: {
        destination: '/order/create/' + servicesCategory.slug,
        permanent: true,
      },
    }
  }

  return {
    props: {
      error: 'No Service Categories Found',
    },
  }
}) satisfies GetServerSideProps<{
  error: string
}>
const redirectToOrderCategory = ({
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {error}
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Services not fully setup
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href={'/admin/services'}
            className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create Service Categories
          </Link>
        </div>
      </div>
    </main>
  )
}

export default redirectToOrderCategory
