import * as React from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatMoney } from '@/lib/utils'
import { useRef } from 'react'
import { LucidePrinter } from 'lucide-react'

function OrderSummary({
  options,
  totalAmount,
  orderId,
  setCheckout,
}: {
  options: { option: string; value: string | boolean | number }[]
  totalAmount: string
  orderId: string | null
  setCheckout: () => void
}) {
  const ifmcontentstoprint = useRef(null)
  const orderSum = useRef(null)
  const printOrder = () => {
    let content: string | null = null
    let pri = null
    if (orderSum.current) {
      content = (orderSum.current as HTMLElement).innerHTML
    }
    if (ifmcontentstoprint.current) {
      pri = (ifmcontentstoprint.current as HTMLIFrameElement).contentWindow
    }

    if (content && pri) {
      pri.document.open()
      pri.document.write(content)
      pri.document.close()
      pri.focus()
      pri.print()
    }
  }
  return (
    <div className="lg:w-3/12 relative">
      <Card className="mb-6 bg-zinc-100 md:sticky md:bottom-0">
        <CardHeader>
          <CardTitle>${formatMoney(totalAmount)}</CardTitle>
          {orderId === null ? (
            <CardDescription>Complete the form to checkout.</CardDescription>
          ) : (
            <CardDescription>Click below to checkout order.</CardDescription>
          )}
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            disabled={orderId === null}
            onClick={() => {
              setCheckout()
            }}
            type="button"
            className=" flex items-center space-x-4 rounded-md border p-4"
          >
            Checkout
          </Button>
        </CardContent>
      </Card>
      <ScrollArea className="md:h-[350px] relative">
        <div className="rounded-md border relative">
          <button
            onClick={() => {
              printOrder()
            }}
            className="p-1 absolute right-1 top-1"
          >
            <LucidePrinter className="w-3 h-3" />
          </button>
          <div className="p-4" ref={orderSum}>
            <h4 className="mb-4 text-sm font-bold text-zinc-800 leading-none">
              Order Summary
              <p className="hidden">${formatMoney(totalAmount)}</p>
            </h4>
            {options.map(({ option, value }, index) => (
              <div key={index}>
                <div className="flex text-xs">
                  <h4 className="capitalize flex-1 font-semibold text-black">
                    {option.replace(/_/g, ' ')}:{' '}
                  </h4>
                  <p className="text-right">{value}</p>
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      <iframe
        ref={ifmcontentstoprint}
        style={{ height: 0, width: 0, position: 'absolute' }}
      ></iframe>
    </div>
  )
}

export default OrderSummary
