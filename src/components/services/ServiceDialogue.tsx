import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form } from '@/components/ui/form'
import { FormField } from '@/components/ui/form'
import { FormItem } from '@/components/ui/form'
import { FormLabel } from '@/components/ui/form'
import { FormControl } from '@/components/ui/form'
import { FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useEffect } from 'react'
import { cn, slugify } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  ServiceCategories,
  ServiceCategoriesWithSubCategories,
} from '@/lib/service_types'

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters and unique.',
  }),
  slug: z.string().min(5, {
    message: 'Slug must be at least 5 characters and unique.',
  }),
  excerpt: z.string().min(20, {
    message: 'Excerpt must be at least 20 characters.',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
  category: z.string({
    required_error: 'Please select a category.',
  }),
  subcategory: z.string({
    required_error: 'Please select a subcategory.',
  }),
})
const ServiceDialogue = ({
  submitForm,
  title,
  description,
  defaultTitle,
  defaultSlug,
  defaultExcerpt,
  defaultDescription,
  defaultCategory,
  defaultSubCategory,
  serviceCategories,
  context,
}: {
  submitForm: (values: z.infer<typeof formSchema>) => Promise<boolean>
  title: string
  description: string
  defaultTitle: string
  defaultSlug: string
  defaultExcerpt: string
  defaultDescription: string
  defaultCategory: string
  defaultSubCategory: string
  serviceCategories: ServiceCategoriesWithSubCategories[]
  context: string
}) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultTitle,
      slug: defaultSlug,
      excerpt: defaultExcerpt,
      description: defaultDescription,
      category: defaultCategory,
      subcategory: defaultSubCategory,
    },
  })

  const { watch, setValue } = form

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      ;(async () => {
        switch (name) {
          case 'title':
            if (value.title) {
              setValue('slug', slugify(value.title))
            } else {
              setValue('slug', '')
            }
            break
          case 'slug':
            console.log(name, value.slug)
            break
        }
      })()
    })
    return () => subscription.unsubscribe()
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    submitForm(values)
      .then((response) => {
        // handle success
        console.log('SUCCESS', response)
      })
      .catch((error) => {
        // handle error
        console.log('ERROR', error)
      })
  }

  return (
    <Dialog defaultOpen={true}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 z-50"
          >
            <div className="grid grid-cols-1 space-y-4 md:gap-4 md:space-y-0  md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Acardemic Writing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="acardemic-writing"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 space-y-4 md:gap-4 md:space-y-0  md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <Popover modal={true}>
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
                              ? serviceCategories.find(
                                  (sc) => sc._id === field.value,
                                )?.title
                              : 'Select category'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <ScrollArea className="h-48">
                          <Command>
                            <CommandInput placeholder="Search service category..." />
                            <CommandEmpty>
                              No service category found.
                            </CommandEmpty>
                            <CommandGroup>
                              {serviceCategories.map((sc) => (
                                <CommandItem
                                  value={sc._id}
                                  key={sc._id}
                                  onSelect={() => {
                                    form.setValue('category', sc._id)
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      sc._id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {sc.title}
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
                name="subcategory"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Subcategory</FormLabel>
                    <Popover modal={true}>
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
                              ? serviceCategories
                                  .find(
                                    (sc) => sc._id == form.watch('category'),
                                  )
                                  ?.subcategories.find(
                                    (sc) => sc._id === field.value,
                                  )?.title
                              : 'Select subcategory'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <ScrollArea className="h-48">
                          <Command>
                            <CommandInput placeholder="Search service subcategory..." />
                            <CommandEmpty>
                              No service subcategory found.
                            </CommandEmpty>
                            <CommandGroup>
                              {serviceCategories
                                .find((sc) => sc._id == form.watch('category'))
                                ?.subcategories.map((ssc) => (
                                  <CommandItem
                                    value={ssc._id}
                                    key={ssc._id}
                                    onSelect={() => {
                                      form.setValue('subcategory', ssc._id)
                                    }}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        ssc._id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                    {ssc.title}
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
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="acardemic writing ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="acardemic writing ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ServiceDialogue
