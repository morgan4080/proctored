import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import UsersTable from '@/components/users/usersTable'
import { User } from '@/lib/service_types'

const UsersAdmin = ({
  current,
  users,
}: {
  current: boolean
  users: User[]
}) => {
  return (
    <div className={cn('space-y-6 hidden', current && 'block')}>
      <div>
        <h3 className="text-lg text-slate-800 font-medium">All users</h3>
        <p className="text-sm text-muted-foreground">
          View users and assign permissions and add writers.
        </p>
      </div>
      <Separator />
      <UsersTable users={users} />
    </div>
  )
}

export default UsersAdmin
