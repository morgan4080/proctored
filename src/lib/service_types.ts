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
