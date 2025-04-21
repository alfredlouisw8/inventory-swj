'use client'

import { useRef } from 'react'
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
import { createGood } from '@/features/goods/actions/createGoods'
import NumberInput from '../../../components/ui/number-input'
import { GoodSchema } from '@/features/goods/actions/schema'
import { updateGood } from '@/features/goods/actions/updateGoods'
import { deleteGood } from '@/features/goods/actions/deleteGoods'
import { Good } from '@prisma/client'
import { useRouter } from 'next/navigation'
import FormNumberField from '../../../components/ui/forms/form-number-input'
import FormTextField from '../../../components/ui/forms/form-text-field'
import FormTextArea from '../../../components/ui/forms/form-text-area'
import FormDatePicker from '@/components/ui/forms/form-date-picker'

type Props = {
  type: 'create' | 'update' | 'delete'
  consolidatorId: string
  goodData?: Good
  successMessage: string
}

export default function GoodForm({
  type,
  consolidatorId,
  goodData,
  successMessage,
}: Props) {
  const closeDialogRef = useRef<HTMLButtonElement>(null)

  const formSchema = GoodSchema

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goodId: goodData?.id || '',
      name: goodData?.name || '',
      shipper: goodData?.shipper || '',
      consignee: goodData?.consignee || '',
      destination: goodData?.destination || '',
      packageType: goodData?.packageType || '',
      currentQuantity: goodData?.currentQuantity || 0,
      consolidatorId,
      remarks: goodData?.remarks || '',
      truckNumber: goodData?.truckNumber || '',
      date: goodData?.date || undefined,
      PEBDate: goodData?.PEBDate || undefined,
      PEBNumber: goodData?.PEBNumber || '',
      NPEDate: goodData?.NPEDate || undefined,
      NPENumber: goodData?.NPENumber || '',
    },
  })

  const action = {
    create: createGood,
    update: updateGood,
    delete: deleteGood,
  }

  const router = useRouter()

  const { execute, fieldErrors } = useAction(action[type], {
    onSuccess: () => {
      toast({
        title: successMessage,
      })
      closeDialogRef.current?.click()

      if (window.location.pathname.startsWith('/goods') && type === 'delete') {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {type === 'delete' ? (
          <p>Apakah anda yakin ingin menghapus barang ini?</p>
        ) : (
          <>
            <div className="flex items-center gap-5">
              <FormTextField
                form={form}
                name="name"
                label="Nama barang"
                placeholder="Nama barang"
              />

              <FormTextField
                form={form}
                name="shipper"
                label="Shipper"
                placeholder="Shipper"
              />

              <FormTextField
                form={form}
                name="consignee"
                label="Consignee"
                placeholder="Consignee"
              />
            </div>

            <div className="flex items-center gap-5">
              <FormTextField
                form={form}
                name="destination"
                label="Tujuan"
                placeholder="Tujuan"
              />

              <FormTextField
                form={form}
                name="packageType"
                label="Packaging"
                placeholder="Packaging"
              />

              <FormNumberField
                form={form}
                name="currentQuantity"
                label="Jumlah barang"
                placeholder="Jumlah barang"
              />
            </div>

            <div className="flex items-center gap-5">
              <FormTextField
                form={form}
                label="Nomor NPE"
                name="NPENumber"
                placeholder="Nomor NPE"
              />
              <FormDatePicker
                form={form}
                name="NPEDate"
                label="Tanggal NPE"
                placeholder="Pilih tanggal"
              />

              <FormTextField
                form={form}
                label="Nomor PEB"
                name="PEBNumber"
                placeholder="Nomor PEB"
              />
              <FormDatePicker
                form={form}
                name="PEBDate"
                label="Tanggal PEB"
                placeholder="Pilih tanggal"
              />
            </div>

            <div className="flex items-center gap-5">
              <FormTextField
                form={form}
                name="truckNumber"
                label="Nomor Truk"
                placeholder="Nomor Truk"
              />
              <FormDatePicker
                form={form}
                name="date"
                label="Tanggal"
                placeholder="Pilih tanggal"
              />
            </div>

            <FormTextArea
              form={form}
              name="remarks"
              label="Keterangan"
              placeholder="Keterangan"
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
