'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  differenceInDays,
  differenceInHours,
  addDays,
  addHours,
} from 'date-fns'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Order, StoreDataType } from '@/lib/service_types'

function formatRange(range: { from: Date; to: Date }, locale: string) {
  const { from, to } = range
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
  }).formatRange(from, to)
}

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

const detailsFormSchema = z.object({
  topic: z
    .string({
      required_error: 'Please add a topic.',
    })
    .min(5, {
      message: 'topic must be at least 5 characters.',
    }),
  duration: z.object({
    from: z.date({
      required_error: 'A date of birth is required.',
    }),
    to: z.date({
      required_error: 'A date of birth is required.',
    }),
  }),
  service: z.string({
    required_error: 'Please select a service.',
  }),
  academic_level: z.string({
    required_error: 'Please select academic level.',
  }),
  subject_discipline: z.string({
    required_error: 'Please select subject discipline.',
  }),
  paper_format: z.string({
    required_error: 'Please select paper format.',
  }),
  attachments: z.custom<FileList>().superRefine((files, ctx) => {
    const required = false
    if (files.length === 0 && required) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Files must be provided',
      })
      return false
    }

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
  paper_details: z
    .string({
      required_error: 'Please add paper details.',
    })
    .min(20, {
      message: 'Paper details must be at least 20 characters.',
    }),
})

type OrderDetailsFormValues = z.infer<typeof detailsFormSchema>

// This can come from your database or API.
const defaultValues: Partial<OrderDetailsFormValues> = {
  // name: "Your name",
  topic: '',
  duration: { from: new Date(), to: addDays(new Date(), 14) },
  attachments: [] as FileList | any,
}

export type ReportingValues = {
  topic?: string | undefined
  duration?: { from?: Date | undefined; to?: Date | undefined } | undefined
  service?: string | undefined
  academic_level?: string | undefined
  subject_discipline?: string | undefined
  paper_format?: string | undefined
  attachments?: FileList | undefined
  paper_details?: string | undefined
}

const OrderDetailsForm = ({
  storedata,
  order,
  proceedWithData,
  reportValues,
}: {
  storedata: StoreDataType[]
  order: Order | null
  proceedWithData: (data: OrderDetailsFormValues) => void
  reportValues: (data: ReportingValues) => void
}) => {
  const [services, setServices] = useState<string[]>([])

  useEffect(() => {
    if (storedata) {
      const filtered = storedata.find((el) => el.id === 1)
      if (filtered) {
        setServices(filtered.subjects)
      }
    }
  }, [storedata])

  const defValues =
    order == null
      ? defaultValues
      : {
          topic: order.topic,
          duration: {
            from: new Date(order.duration.from),
            to: new Date(order.duration.to),
          },
          service: order.service,
          academic_level: order.academic_level,
          subject_discipline: order.subject_discipline,
          paper_format: order.paper_format,
          paper_details: order.paper_details,
          attachments: [] as FileList | any,
        }

  const form = useForm<OrderDetailsFormValues>({
    resolver: zodResolver(detailsFormSchema),
    defaultValues: defValues,
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      ;(async () => {
        if (value.topic == '') {
          value.topic = undefined
        }
        reportValues(value)
      })()
    })
    return () => subscription.unsubscribe()
  })

  function onSubmit(data: OrderDetailsFormValues) {
    proceedWithData(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 space-y-4 md:gap-4 md:space-y-0  md:grid-cols-2">
          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-zinc-800">Type of service</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? services.find((service) => service === field.value)
                          : 'Select service'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <ScrollArea className="h-72">
                      <Command>
                        <CommandInput placeholder="Search service..." />
                        <CommandEmpty>No service found.</CommandEmpty>
                        <CommandGroup>
                          {services.map((service, i) => (
                            <CommandItem
                              value={service}
                              key={i}
                              onSelect={() => {
                                form.setValue('service', service)
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  service === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {service}
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
            name="academic_level"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-zinc-800">Academic level</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? storedata.find((item) => item.level === field.value)
                              ?.level
                          : 'Select academic level'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <ScrollArea className="h-52">
                      <Command>
                        <CommandInput placeholder="Search academic level..." />
                        <CommandEmpty>No level found.</CommandEmpty>
                        <CommandGroup>
                          {storedata.map((item, i) => (
                            <CommandItem
                              value={item.level}
                              key={i}
                              onSelect={() => {
                                form.setValue('academic_level', item.level)
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  item.level === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {item.level}
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
            name="subject_discipline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-zinc-800">
                  Subject, Discipline
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? storedata.length > 0
                            ? storedata[0].subjects0.find(
                                (item) => item === field.value,
                              )
                            : 'Select service'
                          : 'Select service'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <ScrollArea className="h-72">
                      <Command>
                        <CommandInput placeholder="Search service..." />
                        <CommandEmpty>No service found.</CommandEmpty>
                        <CommandGroup>
                          {storedata.length > 0 &&
                            storedata[0].subjects0.map((item, i) => (
                              <CommandItem
                                value={item}
                                key={i}
                                onSelect={() => {
                                  form.setValue('subject_discipline', item)
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    item === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {item}
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
            name="paper_format"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-zinc-800">Paper Format</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? storedata.length > 0
                            ? storedata[0].format.find(
                                (item) => item === field.value,
                              )
                            : 'Select paper format'
                          : 'Select paper format'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <ScrollArea className="h-52">
                      <Command>
                        <CommandInput placeholder="Search paper format..." />
                        <CommandEmpty>No format found.</CommandEmpty>
                        <CommandGroup>
                          {storedata.length > 0 &&
                            storedata[0].format.map((item, i) => (
                              <CommandItem
                                value={item}
                                key={i}
                                onSelect={() => {
                                  form.setValue('paper_format', item)
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    item === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {item}
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
            name="duration"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-zinc-800">
                  Deadline (
                  {field.value
                    ? differenceInDays(field.value.to, field.value.from) > 0
                      ? differenceInDays(field.value.to, field.value.from) +
                        ' days'
                      : differenceInHours(field.value.to, field.value.from) +
                        ' hours'
                    : null}
                  )
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          formatRange(field.value, 'en-GB')
                        ) : (
                          <span>Pick a deadline</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <Select
                      onValueChange={(value) => {
                        form.setValue('duration', {
                          from: new Date(),
                          to: addHours(new Date(), parseInt(value)),
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Hours" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="2">2 Hours</SelectItem>
                        <SelectItem value="4">4 Hours</SelectItem>
                        <SelectItem value="6">6 Hours</SelectItem>
                        <SelectItem value="8">8 Hours</SelectItem>
                        <SelectItem value="10">10 Hours</SelectItem>
                        <SelectItem value="12">12 Hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <Calendar
                      mode="range"
                      defaultMonth={new Date()}
                      numberOfMonths={2}
                      selected={{
                        from: field.value.from,
                        to: field.value.to,
                      }}
                      onSelect={(r) => {
                        return field.onChange(r)
                      }}
                      disabled={(date) => new Date() > date}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attachments"
            render={({ field: { onChange, value } }) => {
              return (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-zinc-800">Attachments</FormLabel>
                  <FormControl>
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
        </div>
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-zinc-800">Topic</FormLabel>
              <FormControl>
                <Input placeholder="Topic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paper_details"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-zinc-800">Paper details</FormLabel>
              <FormControl>
                <Textarea placeholder="details...." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <span className="flex pt-6">
          <Button type="submit" className="ml-auto">
            Proceed to options
          </Button>
        </span>
      </form>
    </Form>
  )
}

export default OrderDetailsForm
