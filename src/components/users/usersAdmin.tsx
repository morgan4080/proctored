import { useState } from 'react'
import { cn, updateRecord } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import UsersTable from '@/components/users/usersTable'
import { User } from '@/lib/service_types'
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import ChangePermissionDialogue from '@/components/users/ChangePermissionDialogue'
import MakeWriterDialogue from '@/components/users/MakeWriterDialogue'
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
const Toaster = dynamic(() => import('@/components/ui/toaster'), { ssr: false })
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const UsersAdmin = ({
  current,
  users,
}: {
  current: boolean
  users: User[]
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [permissionsDialogue, setPermissionsDialogue] = useState(false)
  const [writerDialogue, setWriterDialogue] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  return (
    <div className={cn('space-y-6 hidden', current && 'block')}>
      <div>
        <h3 className="text-lg text-slate-800 font-medium">All users</h3>
        <p className="text-sm text-muted-foreground">
          View users and assign permissions and add writers.
        </p>
      </div>
      <Separator />
      <Dialog open={loading} defaultOpen={false}>
        <DialogPortal>
          <DialogOverlay className="flex items-center justify-center">
            <Loader2 className="mr-2 h-12 w-12 text-zinc-500 animate-spin" />
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
      <UsersTable
        users={users}
        setWriterDialogue={setWriterDialogue}
        setPermissionsDialogue={setPermissionsDialogue}
        setSelectedUser={setSelectedUser}
      />
      {selectedUser ? (
        <ChangePermissionDialogue
          open={permissionsDialogue}
          submitForm={(values) => {
            setLoading(true)
            const { userRole, ...user } = selectedUser
            updateRecord(
              {
                userRole: values.userRole,
                ...user,
              },
              '/api/users',
            )
              .then((response) => {
                toast({
                  description: 'The user was updated successfully.',
                })
              })
              .catch((error) => {
                console.log(error)
              })
              .finally(() => {
                setPermissionsDialogue(false)
                setLoading(false)
                setSelectedUser(null)
                return router.push('/admin/users')
              })
          }}
          userRole={selectedUser.userRole}
          setOpen={(op) => {
            setPermissionsDialogue(op)
          }}
        />
      ) : null}
      {selectedUser ? (
        <MakeWriterDialogue
          open={writerDialogue}
          submitForm={(values) => {
            setLoading(true)
            const { is_writer, ...user } = selectedUser
            updateRecord(
              {
                is_writer: values.isWriter,
                ...user,
              },
              '/api/users',
            )
              .then((response) => {
                toast({
                  description: 'The user was updated successfully.',
                })
              })
              .catch((error) => {
                console.log(error)
              })
              .finally(() => {
                setWriterDialogue(false)
                setLoading(false)
                setSelectedUser(null)
                return router.push('/admin/users')
              })
          }}
          isWriter={selectedUser.is_writer}
          setOpen={(op) => {
            setWriterDialogue(op)
          }}
        />
      ) : null}
      <Toaster />
    </div>
  )
}

export default UsersAdmin
