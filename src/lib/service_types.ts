export type Service = {
  _id: string
  title: string
  slug: string
  excerpt: string
  description: string
}

export interface OrderResponse {
  data: Order
  message: string
  status: number
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
  attachments: any[]
  paper_details: string
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
  latest_job: string
}
export type Job = {
  id: string
  order_id: string
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
  userRole: string
  is_writer: boolean
  orders: number
  writer_profile: Writer | null
  jobs: Job[]
}
