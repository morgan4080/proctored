import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Order } from '@/lib/service_types'

type StoreDataType = {
  id: number
  level: string
  deadline: Record<string, number>
  format: string[]
  subjects0: string[]
  subjects: string[]
}
const optionsFormSchema = z.object({
  pages: z.preprocess(
    (args) => (args === '' ? undefined : args),
    z.coerce
      .number({ invalid_type_error: 'Pages must be a number' })
      .positive('Pages must be positive'),
  ),
  slides: z.preprocess(
    (args) => (args === '' ? 0 : args),
    z.coerce.number({ invalid_type_error: 'Slides must be a number' }).min(0),
  ),
  charts: z.preprocess(
    (args) => (args === '' ? 0 : args),
    z.coerce.number({ invalid_type_error: 'Charts must be a number' }).min(0),
  ),
  sources: z.preprocess(
    (args) => (args === '' ? 0 : args),
    z.coerce.number({ invalid_type_error: 'Sources must be a number' }).min(0),
  ),
  spacing: z.string({
    required_error: 'Please add the spacing.',
  }),
  digital_copies: z.boolean({
    required_error: 'Please add digital copies.',
  }),
  initial_draft: z.boolean({
    required_error: 'Please add initial draft.',
  }),
  one_page_summary: z.boolean({
    required_error: 'Please add one-page summary.',
  }),
  plagiarism_report: z.boolean({
    required_error: 'Please add plagiarism report.',
  }),
})
type OrderOptionsFormValues = z.infer<typeof optionsFormSchema>
const defaultValues: Partial<OrderOptionsFormValues> = {
  // name: "Your name",
  pages: 1,
  slides: 0,
  charts: 0,
  sources: 0,
  spacing: 'double',
  digital_copies: false,
  initial_draft: false,
  one_page_summary: false,
  plagiarism_report: false,
}
const OrderOptionsForm = ({
  storedata,
  order,
  proceedWithData,
  reportValues,
  orderId,
}: {
  storedata: StoreDataType[]
  order: Order | null
  proceedWithData: (data: OrderOptionsFormValues) => void
  reportValues: (data: {
    pages?: number | undefined
    slides?: number | undefined
    charts?: number | undefined
    sources?: number | undefined
    spacing?: string | undefined
    digital_copies?: boolean | undefined
    initial_draft?: boolean | undefined
    one_page_summary?: boolean | undefined
    plagiarism_report?: boolean | undefined
  }) => void
  orderId: string | null
}) => {
  const defValues =
    order == null
      ? defaultValues
      : {
          pages: order.pages,
          slides: order.slides,
          charts: order.charts,
          sources: order.sources,
          spacing: order.spacing,
          digital_copies: order.digital_copies,
          initial_draft: order.initial_draft,
          one_page_summary: order.one_page_summary,
          plagiarism_report: order.plagiarism_report,
        }
  const form = useForm<OrderOptionsFormValues>({
    resolver: zodResolver(optionsFormSchema),
    defaultValues: defValues,
  })
  const onSubmit = (data: OrderOptionsFormValues) => {
    proceedWithData(data)
  }

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      ;(async () => {
        value = {
          ...value,
          pages:
            value.pages == 0
              ? undefined
              : value.pages !== undefined
              ? parseFloat(`${value.pages}`)
              : value.pages,
          slides:
            value.slides == 0
              ? undefined
              : value.slides !== undefined
              ? parseFloat(`${value.slides}`)
              : value.slides,
          charts:
            value.charts == 0
              ? undefined
              : value.charts !== undefined
              ? parseFloat(`${value.charts}`)
              : value.charts,
          sources:
            value.sources == 0
              ? undefined
              : value.sources !== undefined
              ? parseFloat(`${value.sources}`)
              : value.sources,
          digital_copies:
            value.digital_copies == false ? undefined : value.digital_copies,
          initial_draft:
            value.initial_draft == false ? undefined : value.initial_draft,
          one_page_summary:
            value.one_page_summary == false
              ? undefined
              : value.one_page_summary,
          plagiarism_report:
            value.plagiarism_report == false
              ? undefined
              : value.plagiarism_report,
        }
        reportValues(value)
      })()
    })
    return () => subscription.unsubscribe()
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="md:grid md:grid-cols-2 md:gap-4">
          <FormField
            control={form.control}
            name="pages"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-800">
                  No. of Pages (275 Words)
                </FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slides"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-800">No. of Slides</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="md:grid md:grid-cols-2 md:gap-4">
          <FormField
            control={form.control}
            name="sources"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-800">No. of Sources</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="charts"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-800">No. of Charts</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="md:grid md:grid-cols-2 md:gap-4">
          <FormField
            control={form.control}
            name="spacing"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-800">
                  Spacing (275 Words)
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select spacing" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single">Single spacing</SelectItem>
                    <SelectItem value="double">Double spacing</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-6 pt-6 sm:pt-0">
            <FormField
              control={form.control}
              name="digital_copies"
              render={({ field }) => {
                return (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-zinc-800">
                      Extra options
                    </FormLabel>
                    <div className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Digital copies of sources used ($9.99)
                      </FormLabel>
                    </div>
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="initial_draft"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Initial Draft (+10%)
                    </FormLabel>
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="one_page_summary"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      One-page summary ($17.99)
                    </FormLabel>
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="plagiarism_report"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Plagiarism report ($7.99)
                    </FormLabel>
                  </FormItem>
                )
              }}
            />
          </div>
        </div>
        <span className="flex pt-6">
          <Button
            type="submit"
            className="ml-auto inline-flex items-center rounded-md bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-black hover:text-white"
          >
            <svg
              className="-ml-0.5 mr-1.5 h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
              ></path>
            </svg>
            {orderId == null ? 'Save' : 'Update'} Order
          </Button>
        </span>
      </form>
    </Form>
  )
}

export default OrderOptionsForm
