import Head from 'next/head'
import classNames from '@/utils/ClassNames'
import Navigation from '@/components/Navigation'
import Container from "@/components/Container"
import { cn } from '@/lib/utils'
import UsersAdmin from '@/components/users/usersAdmin'
import {
  Blog,
  OrderWithOwnerAndTransactionAndWriter,
  Paper,
  Service,
  ServiceCategoriesWithSubCategories,
  ServiceSubCategories,
  TransactionWithOwnerAndOrder,
  User,
} from '@/lib/service_types'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import mongoClient from '@/lib/mongodb'
import Link from 'next/link'
import Error from 'next/error'
import OrdersAdmin from '@/components/orders/OrdersAdmin'
import TransactionsAdmin from '@/components/transactions/TransactionsAdmin'
import ServicesAdmin from '@/components/services/ServicesAdmin'
import BlogsAdmin from '@/components/blogs/BlogsAdmin'
import PapersAdmin from '@/components/papers/PapersAdmin'
import dynamic from 'next/dynamic'

type Tabs =
  | 'users'
  | 'orders'
  | 'transactions'
  | 'services'
  | 'papers'
  | 'blogs'

const { clientPromise } = mongoClient
export const getServerSideProps = (async (context) => {
  const client = await clientPromise
  const db = client.db('proctor')
  const tab: Tabs | null =
    context.params && context.params.link
      ? (`${context.params.link}` as Tabs)
      : null

  switch (tab) {
    case 'users':
      const usersData = await db
        .collection('users')
        .aggregate<User>([
          {
            $lookup: {
              from: 'orders',
              localField: '_id',
              foreignField: 'userId',
              as: 'user_orders',
            },
          },
          {
            $addFields: {
              orders: {
                $size: '$user_orders',
              },
            },
          },
          {
            $project: {
              user_orders: 0,
            },
          },
        ])
        .sort({ metacritic: -1 })
        .limit(1000)
        .toArray()
      const users = usersData.map((u) => {
        const { _id, ...user } = u
        return {
          _id: _id.toString(),
          ...user,
        }
      })
      return {
        props: {
          users,
          orders: [],
          transactions: [],
          services: [],
          serviceCategories: [],
          serviceSubCategories: [],
          papers: [],
          blogs: [],
          tab,
        },
      }
    case 'orders':
      //add transaction from transactionId and writer from writerId
      const ordersData = await db
        .collection('orders')
        .aggregate<OrderWithOwnerAndTransactionAndWriter>([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'owner',
            },
          },
          {
            $lookup: {
              from: 'transactions',
              localField: 'transactionId',
              foreignField: '_id',
              as: 'transaction',
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'writerId',
              foreignField: '_id',
              as: 'writer',
            },
          },
          {
            $lookup: {
              from: 'services_category',
              localField: 'serviceCategoryId',
              foreignField: '_id',
              pipeline: [
                {
                  $lookup: {
                    from: 'services_sub_category',
                    localField: 'subcategories',
                    foreignField: '_id',
                    as: 'subcategories',
                  },
                },
              ],
              as: 'serviceCategory',
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ['$owner', 0] },
              transaction: { $arrayElemAt: ['$transaction', 0] },
              writer: { $arrayElemAt: ['$writer', 0] },
              serviceCategory: { $arrayElemAt: ['$serviceCategory', 0] },
            },
          },
        ])
        .sort({ metacritic: -1 })
        .limit(1000)
        .toArray()
      const orders = ordersData.map((o) => {
        const {
          _id,
          userId,
          owner: { _id: ownerId, ...ownerData },
          serviceCategory: {
            _id: serviceCategoryId,
            title,
            slug,
            products,
            description,
            subcategories,
          },
          ...order
        } = o
        return {
          _id: _id.toString(),
          userId: userId.toString(),
          owner: {
            _id: ownerId.toString(),
            ...ownerData,
          },
          serviceCategory: {
            _id: serviceCategoryId.toString(),
            title,
            slug,
            description,
            products,
            subcategories: subcategories.map((sc) => {
              const { _id, ...other } = sc
              return {
                _id: _id.toString(),
                ...other,
              }
            }),
          },
          ...order,
          serviceCategoryId: serviceCategoryId.toString(),
        }
      })
      return {
        props: {
          users: [],
          orders: orders,
          transactions: [],
          services: [],
          serviceCategories: [],
          serviceSubCategories: [],
          papers: [],
          blogs: [],
          tab,
        },
      }
    case 'transactions':
      // TODO: Aggregate order and owner
      const transactionsData = await db
        .collection('transactions')
        .aggregate<TransactionWithOwnerAndOrder>([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'owner',
            },
          },
          {
            $lookup: {
              from: 'orders',
              localField: 'OrderId',
              foreignField: '_id',
              as: 'order',
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ['$owner', 0] },
              order: { $arrayElemAt: ['$order', 0] },
            },
          },
        ])
        .sort({ metacritic: -1 })
        .limit(1000)
        .toArray()
      const transactions = transactionsData.map((t) => {
        const { _id, ...transaction } = t
        return {
          _id: _id.toString(),
          ...transaction,
        }
      })
      return {
        props: {
          users: [],
          orders: [],
          transactions: transactions,
          services: [],
          serviceCategories: [],
          serviceSubCategories: [],
          papers: [],
          blogs: [],
          tab,
        },
      }
    case 'services':
      const servicesData = await db
        .collection<Service>('services')
        .find({})
        .sort({ metacritic: -1 })
        .limit(1000)
        .toArray()
      const services = servicesData.map((s) => {
        const { _id, category, subcategory, ...service } = s
        return {
          _id: _id.toString(),
          category: category.toString(),
          subcategory: subcategory.toString(),
          ...service,
        }
      })
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
        .sort({ metacritic: -1 })
        .limit(1000)
        .toArray()
      const serviceCategories = servicesCategories.map((s) => {
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
      const services_sub_category = await db
        .collection<ServiceSubCategories>('services_sub_category')
        .find({})
        .sort({ metacritic: -1 })
        .limit(1000)
        .toArray()
      const services_sub_categories = services_sub_category.map((s) => {
        const { _id, ...ssc } = s
        return {
          _id: _id.toString(),
          ...ssc,
        }
      })
      return {
        props: {
          users: [],
          orders: [],
          transactions: [],
          services: services,
          serviceCategories: serviceCategories,
          serviceSubCategories: services_sub_categories,
          papers: [],
          blogs: [],
          tab,
        },
      }
    case 'papers':
      const papersData = await db
        .collection<Paper>('papers')
        .find({})
        .sort({ metacritic: -1 })
        .limit(1000)
        .toArray()
      const papers = papersData.map((p) => {
        const { _id, ...paper } = p
        return {
          _id: _id.toString(),
          ...paper,
        }
      })
      return {
        props: {
          users: [],
          orders: [],
          transactions: [],
          services: [],
          serviceCategories: [],
          serviceSubCategories: [],
          papers: papers,
          blogs: [],
          tab,
        },
      }
    case 'blogs':
      const blogsData = await db
        .collection<Blog>('blogs')
        .find({})
        .sort({ metacritic: -1 })
        .limit(1000)
        .toArray()
      const blogs = blogsData.map((b) => {
        const { _id, ...blog } = b
        return {
          _id: _id.toString(),
          ...blog,
        }
      })
      return {
        props: {
          users: [],
          orders: [],
          transactions: [],
          services: [],
          serviceCategories: [],
          serviceSubCategories: [],
          papers: [],
          blogs: blogs,
          tab,
        },
      }
    default:
      return {
        props: {
          users: [],
          orders: [],
          transactions: [],
          services: [],
          serviceCategories: [],
          serviceSubCategories: [],
          papers: [],
          blogs: [],
          tab: null,
        },
      }
  }
}) satisfies GetServerSideProps<{
  users: User[]
  orders: OrderWithOwnerAndTransactionAndWriter[]
  transactions: TransactionWithOwnerAndOrder[]
  services: Service[]
  serviceCategories: ServiceCategoriesWithSubCategories[]
  serviceSubCategories: ServiceSubCategories[]
  papers: Paper[]
  blogs: Blog[]
  tab: Tabs | null
}>

const Admin = ({
  users,
  orders,
  transactions,
  services,
  serviceCategories,
  serviceSubCategories,
  papers,
  blogs,
  tab,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (tab) {
    return (
      <div className="relative">
        <Head>
          <title>Admin Dashboard</title>
          <meta name="description" content="Proctor Owls Order" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main
          className={classNames(
            "font-serif",
            'flex min-h-screen flex-col relative',
          )}
        >
          <div className="bg-bermuda/95 w-full">
            <Navigation />
          </div>

          <Container
            className="xl:px-0"
            parentClassName="pt-10 bg-white w-full"
          >
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex gap-4 items-center">
                  <span className={classNames("font-sans")}>
                    Admin Dashboard{' '}
                  </span>
                </h2>
                <div className="mt-2 text-lg leading-8 text-gray-600 space-x-2">
                  Admin portal
                </div>
              </div>
              <div className="mt-5 flex lg:ml-4 lg:mt-0">
                <span className="block"></span>
              </div>
            </div>
          </Container>
          <Container
            className="xl:px-0"
            parentClassName="pb-32 bg-white w-full"
          >
            <div
              data-orientation="horizontal"
              role="none"
              className="shrink-0 bg-border h-[1px] w-full my-6"
            ></div>
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <aside className="px-4 -mx-4 lg:w-1/5">
                <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                  <Link
                    href={'/admin/' + 'users'}
                    className={cn(
                      'inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-muted justify-start',
                      tab == 'users' && 'bg-muted',
                    )}
                  >
                    <svg
                      className="w-3 h-3 mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      ></path>
                    </svg>
                    <span>Users</span>
                  </Link>
                  <Link
                    href={'/admin/' + 'orders'}
                    className={cn(
                      'inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-muted justify-start',
                      tab == 'orders' && 'bg-muted',
                    )}
                  >
                    <svg
                      className="w-3 h-3 mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      ></path>
                    </svg>
                    <span>Orders</span>
                  </Link>
                  <Link
                    href={'/admin/' + 'transactions'}
                    className={cn(
                      'inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-muted justify-start',
                      tab == 'transactions' && 'bg-muted',
                    )}
                  >
                    <svg
                      className="w-3 h-3 mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      ></path>
                    </svg>
                    <span>Transactions</span>
                  </Link>
                  <Link
                    href={'/admin/' + 'services'}
                    className={cn(
                      'inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-muted justify-start',
                      tab == 'services' && 'bg-muted',
                    )}
                  >
                    <svg
                      className="w-3 h-3 mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      ></path>
                    </svg>
                    <span>Services</span>
                  </Link>
                  <Link
                    href={'/admin/' + 'papers'}
                    className={cn(
                      'inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-muted justify-start',
                      tab == 'papers' && 'bg-muted',
                    )}
                  >
                    <svg
                      className="w-3 h-3 mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      ></path>
                    </svg>
                    <span>Papers</span>
                  </Link>
                  <Link
                    href={'/admin/' + 'blogs'}
                    className={cn(
                      'inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-muted justify-start',
                      tab == 'blogs' && 'bg-muted',
                    )}
                  >
                    <svg
                      className="w-3 h-3 mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      ></path>
                    </svg>
                    <span>Blogs</span>
                  </Link>
                </nav>
              </aside>
              <div className="flex-1 lg:max-w-5xl">
                {/*  Users*/}
                <UsersAdmin current={tab == 'users'} users={users} />
                {/*  Order*/}
                <OrdersAdmin current={tab == 'orders'} orders={orders} />
                {/*  Transactions*/}
                <TransactionsAdmin
                  current={tab == 'transactions'}
                  transactions={transactions}
                />
                {/*  Services*/}
                <ServicesAdmin
                  current={tab == 'services'}
                  services={services}
                  serviceCategories={serviceCategories}
                  serviceSubCategories={serviceSubCategories}
                />
                {/*  Papers*/}
                <PapersAdmin current={tab == 'papers'} papers={papers} />
                {/*  Blogs*/}
                <BlogsAdmin current={tab == 'blogs'} blogs={blogs} />
              </div>
            </div>
          </Container>
        </main>
      </div>
    )
  } else {
    return <Error statusCode={404} />
  }
}

export default Admin
