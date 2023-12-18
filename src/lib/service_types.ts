export type optionType = { option: string; value: string | number | boolean }

export type StoreDataType = {
  id: number
  level: string
  deadline: Record<string, number>
  format: string[]
  subjects0: string[]
  subjects: string[]
}

export type ServiceCategories = {
  _id: string
  title: string
  slug: string
  description: string
  subcategories: string[]
}

export interface ProductConfiguration {
  name: string
  price: number
}

export type Product = {
  name: string
  configurations: ProductConfiguration[]
}

export type ServiceCategoriesWithSubCategories = {
  _id: string
  title: string
  slug: string
  description: string
  subcategories: ServiceSubCategories[]
  products: Product[]
}

export type ServiceSubCategories = {
  _id: string
  title: string
  slug: string
  description: string
}

export interface OrderResponse {
  data: Order
  message: string
  status: number
}

export interface Duration {
  from: string
  to: string
}

export type Writer = {
  photo: File
  writer_name: string
  rating: number
  jobs_completed: number
  latest_job: Job | null
}
export type Job = {
  id: string
  orderId: string
  writerId: string
  amount_quoted: number
  payment_status: 'Paid' | 'Unpaid'
  job_status: 'Pending' | 'Declined' | 'Accepted' | 'Completed'
  rating: number
  completion_date: Date
  submission_documents: FileList[]
  date_assigned: Date
}

export type User = {
  _id: string
  email: string
  name: string
  userRole: 'user' | 'admin' | 'superuser'
  is_writer: boolean
  orders: number
  writer_profile: Writer | null
}

export interface Order {
  _id: string
  pages: number
  slides: number
  charts: number
  sources: number
  spacing: string
  digital_copies: boolean
  initial_draft: boolean
  one_page_summary: boolean
  plagiarism_report: boolean
  topic: string
  duration: Duration
  service: string
  academic_level: string
  subject_discipline: string
  paper_format: string
  attachments: FileList
  details: string
  userId: string
  writerId: string
  transactionId: string
  serviceCategoryId: string
  totalPrice: string
}

export interface Transaction {
  _id: string
  userId: string
  orderId: string
  amount: number
  status: 'processing' | 'failed' | 'success'
  transactionCode: string
  currency: string
  date: string
  breakdown: Record<any, any>
}
export interface Paper {
  _id: string
  title: string
  slug: string
  excerpt: string
  description: string
  updated: string
}
export interface Blog {
  _id: string
  title: string
  slug: string
  excerpt: string
  description: string
  updated: string
}

export interface OrderWithOwnerAndTransactionAndWriter extends Order {
  owner: User
  serviceCategory: ServiceCategoriesWithSubCategories
  transaction: Transaction | null
  writer: Writer | null
}
export interface TransactionWithOwnerAndOrder extends Transaction {
  owner: User
  order: Order
}

export interface CategoryWithSubCategoryAndService {
  _id: string
  title: string
  slug: string
  description: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  _id: string
  title: string
  slug: string
  description: string
  services: Service[]
}

export interface Service {
  _id: string
  title: string
  slug: string
  excerpt: string
  description: string
  category: string
  subcategory: string
  updated: string
}

export type WriterType = {
  name: string
  profile_image: string
  orders_complete: number
  rating: number
  reviewCount: number
  featured_work: {
    title: string
    paper_type: string
    subject: string
    style: string
    sources: number
    image: string
  }[]
}

export type FaqType = { name: string; description: string }

export type MenuType = {
  name: string
  categories: MenuCategory[]
  link: string
}

export type MenuCategory = {
  _id: string
  title: string
  slug: string
  description: string
  subcategories: {
    _id: string
    title: string
    slug: string
    description: string
    items: { _id: string; title: string; excerpt: string; slug: string }[]
  }[]
}
