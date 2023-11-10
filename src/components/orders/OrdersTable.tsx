import React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Order, OrderWithOwnerAndTransaction, User } from '@/lib/service_types'
import Link from 'next/link'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'

const OrdersTable = ({
  orders,
}: {
  orders: OrderWithOwnerAndTransaction[]
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { data: session } = useSession()
  const assignWriter = () => {}

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: '_id',
      id: '_id',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'created',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-xs"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="text-xs">
            {format(new Date(order.duration.from), 'MMMM dd, yyyy h:mm:ss aa')}
          </div>
        )
      },
    },
    {
      accessorKey: 'topic',
      header: () => <div className="text-xs">Topic</div>,
      cell: ({ row }) => <div className="text-xs">{row.getValue('topic')}</div>,
    },
    {
      accessorKey: 'academic_level',
      header: () => <div className="text-xs">Level</div>,
      cell: ({ row }) => (
        <div className="text-xs">{row.getValue('academic_level')}</div>
      ),
    },
    {
      id: 'deadline',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-xs"
          >
            Deadline
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="text-xs">
            {format(new Date(order.duration.to), 'MMMM dd, yyyy h:mm:ss aa')}
          </div>
        )
      },
    },
    {
      accessorKey: 'owner',
      header: () => <div className="text-xs">Owner</div>,
      cell: ({ row }) => {
        const order = row.original
        return (
          <Link
            href={
              session &&
              session.user &&
              (session.user.userRole == 'admin' ||
                session.user.userRole == 'superuser')
                ? '/user/' + order.userId + '/orders'
                : '/me/orders'
            }
            className="underline text-xs"
          >
            {(row.getValue('owner') as User).name}
          </Link>
        )
      },
    },
    {
      accessorKey: 'transaction',
      header: () => <div className="text-xs">Payment Status</div>,
      cell: ({ row }) => (
        <div className="text-xs">
          {JSON.stringify(row.getValue('transaction'))}
        </div>
      ),
    },
    {
      id: 'transaction',
      header: () => <div className="text-xs">Order Status</div>,
      cell: ({ row }) => (
        <div className="text-xs">
          {JSON.stringify(row.getValue('transaction'))}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="text-xs">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(order._id)}
                  className="cursor-pointer"
                >
                  Copy Order ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Link href={'/order/' + order._id} className="w-full">
                    View order
                  </Link>
                </DropdownMenuItem>
                {session &&
                session.user &&
                (session.user.userRole == 'admin' ||
                  session.user.userRole == 'superuser') ? (
                  <DropdownMenuItem
                    onClick={() => {
                      assignWriter()
                    }}
                    className="cursor-pointer"
                  >
                    Assign writer
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter orders by topic..."
          value={(table.getColumn('topic')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('topic')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2 sm:ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OrdersTable
