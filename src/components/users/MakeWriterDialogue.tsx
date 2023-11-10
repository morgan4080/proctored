'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import React from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { RadioGroup } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'

const formSchema = z.object({
  isWriter: z.boolean(),
})

const MakeWriterDialogue = ({
  open,
  submitForm,
  isWriter,
  setOpen,
}: {
  open: boolean
  submitForm: (values: z.infer<typeof formSchema>) => void
  setOpen: (open: boolean) => void
  isWriter: boolean
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isWriter,
    },
  })
  return (
    <Dialog
      open={open}
      defaultOpen={false}
      onOpenChange={(op) => {
        setOpen(op)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make Writer</DialogTitle>
          <DialogDescription>Set user as writer</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitForm)}
            className="space-y-3 mt-3"
          >
            <FormField
              control={form.control}
              name="isWriter"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Add Writer</FormLabel>
                    <FormDescription>
                      The user will be able to receive and submit jobs for
                      approval.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <DialogFooter className="pt-6">
              <Button type="submit" className="w-full">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default MakeWriterDialogue
