'use client'

import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from '@/hooks/useAction'
import { toast } from '@/components/ui/use-toast'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createInvoice } from '@/actions/invoices/createInvoice'
import { Checkbox } from '../ui/checkbox'
import { DataTable } from '../ui/data-table'
import { Invoice, Service, ServiceType } from '@prisma/client'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { format } from 'date-fns'
import { serviceColumns } from '../../features/services/components/columns'
import { InvoiceSchema } from '@/actions/invoices/schema'
import { InvoiceWithServices, ServiceWithGoods } from '@/utils/types'
import { updateInvoice } from '@/actions/invoices/updateInvoice'
import { deleteInvoice } from '@/actions/invoices/deleteInvoice'
import { invoiceServicesColumns } from './columns'
import { useRouter } from 'next/navigation'
import { serviceTypeText } from '@/utils/functions'
import NumberInput from '../ui/number-input'
import { formatInTimeZone } from 'date-fns-tz'
import { TIMEZONE } from '@/utils/const'

type Props = {
  type: 'create' | 'update' | 'delete'
  consolidatorId: string
  successMessage: string
  invoiceData?: InvoiceWithServices
}

export default function InvoiceForm({
  type,
  consolidatorId,
  invoiceData,
  successMessage,
}: Props) {
  const closeDialogRef = useRef<HTMLButtonElement>(null)

  const formSchema = InvoiceSchema

  const serviceIds = invoiceData?.services.map((service) => service.id) || []

  // Use array of strings to track selected service IDs
  const [selectedServiceIds, setSelectedServiceIds] =
    React.useState<string[]>(serviceIds)

  const [unpaidServices, setUnpaidServices] = React.useState<Service[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceCode: invoiceData?.invoiceCode || '',
      invoiceDate: invoiceData?.invoiceDate || new Date(),
      paymentDate: invoiceData?.paymentDate || undefined,
      consolidatorId,
      remarks: invoiceData?.remarks || '',
      tax: invoiceData?.tax || false,
      serviceIds,
      invoiceId: invoiceData?.id || '',
      totalPrice: invoiceData?.totalPrice || 0,
    },
  })

  const action = {
    create: createInvoice,
    update: updateInvoice,
    delete: deleteInvoice,
  }

  const router = useRouter()

  const { execute, fieldErrors } = useAction(action[type], {
    onSuccess: () => {
      toast({
        title: successMessage,
      })
      closeDialogRef.current?.click()

      if (
        window.location.pathname.startsWith('/invoices') &&
        type === 'delete'
      ) {
        // Navigate to the consolidator detail page
        router.replace(`/consolidators/${consolidatorId}`)
      }
    },
    onError: (error) => {
      toast({
        title: error,
        variant: 'destructive',
      })
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    values.serviceIds = selectedServiceIds // Pass the selected service IDs to backend

    await execute(values)

    if (fieldErrors) {
      for (const [key, value] of Object.entries(fieldErrors)) {
        form.setError(key as keyof typeof fieldErrors, {
          type: 'manual',
          message: value.join(','),
        })
      }
      return
    }
  }

  const fetchUnpaidServicesByConsolidatorId = async (
    consolidatorId: string,
    serviceIds: string[]
  ) => {
    const response = await fetch(
      `/api/services/unpaid?consolidatorId=${consolidatorId}&serviceIds=${serviceIds.join(
        ','
      )}`
    )
    const data = await response.json()
    if (response.ok) {
      return data.data // Array of goods
    } else {
      throw new Error(data.error || 'Failed to fetch unpaid services')
    }
  }

  useEffect(() => {
    if (consolidatorId) {
      fetchUnpaidServicesByConsolidatorId(consolidatorId, serviceIds).then(
        (data) => {
          setUnpaidServices(data)
        }
      )
    }
  }, [consolidatorId])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {type === 'delete' ? (
          <p>Apakah Anda yakin ingin menghapus invoice ini?</p>
        ) : (
          <>
            <div className="flex items-center gap-5">
              <FormField
                control={form.control}
                name="invoiceCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Invoice ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Invoice ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tanggal Pembayaran</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              formatInTimeZone(
                                field.value,
                                TIMEZONE,
                                'dd-MM-yyyy'
                              )
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tax"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>PPN</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-5">
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Harga Jual Total</FormLabel>
                    <FormControl>
                      <NumberInput control={form.control} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invoiceDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tanggal invoice</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              formatInTimeZone(
                                field.value,
                                TIMEZONE,
                                'dd-MM-yyyy'
                              )
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Keterangan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pass state and setter to the DataTable */}
            <DataTable
              columns={invoiceServicesColumns}
              data={unpaidServices}
              rowSelection={selectedServiceIds}
              setRowSelection={setSelectedServiceIds}
              filterColumn={{
                label: 'kode jasa',
                name: 'serviceCode',
              }}
              selectFilter={{
                label: 'tipe jasa',
                name: 'serviceType',
                options: Object.keys(ServiceType).map((type) => ({
                  label: serviceTypeText(type),
                  value: type,
                })),
              }}
              showRowSelection
            />
          </>
        )}

        <DialogFooter>
          <Button loading={form.formState.isSubmitting} type="submit">
            Confirm
          </Button>
          <DialogClose asChild>
            <Button style={{ display: 'none' }} ref={closeDialogRef}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  )
}
