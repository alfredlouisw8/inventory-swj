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
import { Consolidator } from '@prisma/client'
import { ConsolidatorSchema } from '@/features/consolidators/actions/schema'
import { createConsolidator } from '@/features/consolidators/actions/createConsolidators'
import { updateConsolidator } from '@/features/consolidators/actions/updateConsolidator'
import { deleteConsolidator } from '@/features/consolidators/actions/deleteConsolidators'
import { useRouter } from 'next/navigation'
import FormTextField from '../../../components/ui/forms/form-text-field'
import FormTextArea from '../../../components/ui/forms/form-text-area'

type Props = {
  consolidatorData?: Consolidator
  successMessage: string
  type: 'create' | 'update' | 'delete'
}

export default function ConsolidatorForm({
  type,
  consolidatorData,
  successMessage,
}: Props) {
  const closeDialogRef = useRef<HTMLButtonElement>(null)

  const formSchema = ConsolidatorSchema

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: consolidatorData?.name || '',
      remarks: consolidatorData?.remarks || '',
      consolidatorId: consolidatorData?.id || '',
    },
  })

  const actions = {
    create: createConsolidator,
    update: updateConsolidator,
    delete: deleteConsolidator,
  }

  const router = useRouter()

  const { execute, fieldErrors } = useAction(actions[type], {
    onSuccess: () => {
      toast({
        title: successMessage,
      })
      closeDialogRef.current?.click()

      if (type === 'delete') {
        // Navigate to the consolidators page
        router.replace(`/consolidators`)
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
          <p>Apakah anda yakin ingin menghapus consolidator ini?</p>
        ) : (
          <>
            <FormTextField
              form={form}
              name="name"
              label="Nama consolidator"
              placeholder="Nama consolidator"
            />

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
