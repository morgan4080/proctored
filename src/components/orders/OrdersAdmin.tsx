import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { OrderWithOwnerAndTransactionAndWriter } from '@/lib/service_types'
import OrdersTable from '@/components/orders/OrdersTable'

const OrdersAdmin = ({
  current,
  orders,
}: {
  current: boolean
  orders: OrderWithOwnerAndTransactionAndWriter[]
}) => {
  return (
    <div className={cn('space-y-6 hidden', current && 'block')}>
      <div>
        <h3 className="text-lg text-slate-800 font-medium">All Orders</h3>
        <p className="text-sm text-muted-foreground">View all orders.</p>
      </div>
      <Separator />
      <OrdersTable orders={orders} />
    </div>
  )
}

export default OrdersAdmin
