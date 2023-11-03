'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
const ServiceDialogue = ({
  submitForm,
  title,
  description,
  defaultTitle,
  defaultSlug,
  defaultExcerpt,
  defaultDescription,
}: {
  submitForm: () => void
  title: string
  description: string
  defaultTitle: string
  defaultSlug: string
  defaultExcerpt: string
  defaultDescription: string
}) => {
  return (
    <Dialog defaultOpen={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              defaultValue={defaultTitle}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slug" className="text-right">
              Slug
            </Label>
            <Input
              id="slug"
              defaultValue={defaultSlug}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="excerpt" className="text-right">
              Excerpt
            </Label>
            <Textarea
              id="description"
              defaultValue={defaultExcerpt}
              className="col-span-3"
              placeholder="Type your message here."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Body
            </Label>
            <Textarea
              id="description"
              defaultValue={defaultDescription}
              className="col-span-3"
              placeholder="Type your message here."
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              submitForm()
            }}
            type="submit"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ServiceDialogue
