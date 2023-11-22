import { Order, Product as StoreProduct } from '@/lib/service_types'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { format, parse, set } from 'date-fns'

const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/mp4',
  'application/pdf',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]

const proctoredFormSchema = z.object({
  exam: z
    .string({
      required_error: 'Select the type.',
    })
    .min(1, {
      message: 'Select the type.',
    }),
  subject: z
    .custom<{
      name: string
      price: number
    }>()
    .superRefine((data, ctx) => {
      if (!data || Object.keys(data).length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide the required data',
        })
        return false
      }
      return true
    }),
  date: z.date({
    required_error: 'Date is required.',
  }),
  topic: z.string().optional(),
  details: z.string().optional(),
  attachments: z.custom<FileList>().superRefine((files, ctx) => {
    let checker = Array.from(files).map((file) => {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'File must be a valid document type: ' +
            file.type +
            ' not allowed.',
        })
        return false
      }

      if (file.size > 1024 * 1024 * 15) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'File must be less than 15MB',
        })
        return false
      }
      return true
    })

    return !checker.includes(false)
  }),
})

type ProctorReportValues = {
  [k: string]:
    | string
    | Date
    | FileList
    | { name?: string | undefined; price?: number | undefined }
}

const defaultValues: Partial<ProctoredFormValues> = {
  topic: '',
  exam: undefined,
  subject: undefined,
  details: '',
  date: undefined,
  attachments: [] as FileList | any,
}

type ProctoredFormValues = z.infer<typeof proctoredFormSchema>
const SpecialisedExamOrder = ({
  products,
  order,
  proceedWithData,
  reportValues,
}: {
  products: StoreProduct[]
  order: Order | null
  proceedWithData: (data: ProctoredFormValues) => void
  reportValues: (data: ProctorReportValues) => void
}) => {
  const defValues =
    order == null
      ? defaultValues
      : {
          topic: order.topic,
          exam: order.academic_level,
          subject: products
            .find((prod) => prod.name == order.academic_level)
            ?.configurations.find(
              (conf) => conf.name == order.subject_discipline,
            ),
          details: order.details,
          date: new Date(order.duration.from),
          attachments: [] as FileList | any,
        }

  const form = useForm<ProctoredFormValues>({
    resolver: zodResolver(proctoredFormSchema),
    defaultValues: defValues,
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      ;(async () => {
        reportValues(
          Object.fromEntries(
            Object.entries(value).filter(
              ([_, value]) => value !== undefined && value !== '',
            ),
          ),
        )
      })()
    })
    return () => subscription.unsubscribe()
  })

  function onSubmit(data: ProctoredFormValues) {
    proceedWithData(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 space-y-4 md:gap-4 md:space-y-0  md:grid-cols-2">
          <FormField
            control={form.control}
            name="exam"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-zinc-800">Type *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between text-slate-800',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? field.value : 'Select type'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[310px] p-0">
                    <ScrollArea className="h-72">
                      <Command>
                        <CommandInput placeholder="Search service..." />
                        <CommandEmpty>No type found.</CommandEmpty>
                        <CommandGroup>
                          {products.map((product, i) => (
                            <CommandItem
                              value={product.name}
                              key={i}
                              onSelect={() => {
                                form.reset()
                                form.setValue('exam', product.name)
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  product.name === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {product.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-zinc-800">
                  Subject/Discipline *
                </FormLabel>
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between text-slate-800',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? field.value.name : 'Select subcategory'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[310px] p-0" align="start">
                    <ScrollArea className="h-48">
                      <Command>
                        <CommandInput placeholder="Search service subcategory..." />
                        <CommandEmpty>No type selected.</CommandEmpty>
                        <CommandGroup>
                          {products
                            .find(
                              (product) => product.name == form.watch('exam'),
                            )
                            ?.configurations.map((config) => (
                              <CommandItem
                                value={config.name}
                                key={config.name}
                                onSelect={() => {
                                  form.setValue('subject', config)
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    config.name == field.value?.name
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {config.name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </Command>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 space-y-4 md:gap-4 md:space-y-0  md:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-zinc-800">
                  Start Date & Time*
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal text-slate-800',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'dd/MM/yyyy HH:mm:ss')
                        ) : (
                          <span>Pick a date and time</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      footer={
                        <Input
                          className="mt-2"
                          type="time"
                          disabled={form.watch('date') == undefined}
                          defaultValue={
                            order
                              ? `${
                                  new Date(order.duration.from).getHours() < 10
                                    ? '0'
                                    : ''
                                }${new Date(order.duration.from).getHours()}:${
                                  new Date(order.duration.from).getMinutes() <
                                  10
                                    ? '0'
                                    : ''
                                }${new Date(
                                  order.duration.from,
                                ).getMinutes()}:${
                                  new Date(order.duration.from).getSeconds() <
                                  10
                                    ? '0'
                                    : ''
                                }${new Date(order.duration.from).getSeconds()}`
                              : ''
                          }
                          onChange={(event) => {
                            // Parse the time string into a Date object
                            const time = parse(
                              `${event.target.value}:00`,
                              'HH:mm:ss',
                              new Date(),
                            )

                            // Set the time (hours, minutes, and seconds) to the current date
                            const newDateWithTime = set(form.watch('date'), {
                              hours: time.getHours(),
                              minutes: time.getMinutes(),
                              seconds: time.getSeconds(),
                            })

                            form.setValue('date', new Date(newDateWithTime))
                          }}
                        />
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-zinc-800">Topic</FormLabel>
                <FormControl className="text-slate-800">
                  <Input placeholder="Topic" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="attachments"
          render={({ field: { onChange, value } }) => {
            return (
              <FormItem className="flex flex-col">
                <FormLabel className="text-zinc-800">Attachments</FormLabel>
                <FormControl className="text-slate-800">
                  <Input
                    type="file"
                    accept={'image/*,.doc,.docx,.pdf'}
                    multiple={true}
                    onChange={(event) => {
                      // Triggered when user uploaded a new file
                      // FileList is immutable, so we need to create a new one
                      const dataTransfer = new DataTransfer()

                      // Add old attachments
                      if (value) {
                        Array.from(value).forEach((attachment) =>
                          dataTransfer.items.add(attachment),
                        )
                      }

                      // Add newly uploaded attachments
                      Array.from(event.target.files!).forEach((attachment) =>
                        dataTransfer.items.add(attachment),
                      )

                      // Validate and update uploaded file
                      const newFiles = dataTransfer.files
                      onChange(newFiles)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-zinc-800">Extra details</FormLabel>
              <FormControl className="text-slate-800">
                <Textarea placeholder="details...." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <span className="flex pt-6">
          <Button type="submit" className="ml-auto">
            Submit Order
          </Button>
        </span>
      </form>
    </Form>
  )
}

export default SpecialisedExamOrder
