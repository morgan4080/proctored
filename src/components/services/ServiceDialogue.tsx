'use client'

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
import { slugify } from '@/lib/utils'

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
})
const ServiceDialogue = ({
  submitForm,
  title,
  description,
  defaultTitle,
  defaultSlug,
  defaultExcerpt,
  defaultDescription,
}: {
  submitForm: (values: z.infer<typeof formSchema>) => Promise<boolean>
  title: string
  description: string
  defaultTitle: string
  defaultSlug: string
  defaultExcerpt: string
  defaultDescription: string
}) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultTitle,
      slug: defaultSlug,
      excerpt: defaultExcerpt,
      description: defaultDescription,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
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
