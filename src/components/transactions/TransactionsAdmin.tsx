import React from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Transaction, TransactionWithOwnerAndOrder } from '@/lib/service_types'
import TransactionsTable from '@/components/transactions/TransactionsTable'

const TransactionsAdmin = ({
  current,
  transactions,
}: {
  current: boolean
  transactions: TransactionWithOwnerAndOrder[]
}) => {
  return (
    <div className={cn('space-y-6 hidden', current && 'block')}>
      <div>
        <h3 className="text-lg text-slate-800 font-medium">All Transactions</h3>
        <p className="text-sm text-muted-foreground">View all transactions.</p>
      </div>
      <Separator />
      <TransactionsTable transactions={transactions} />
    </div>
  )
}

export default TransactionsAdmin
