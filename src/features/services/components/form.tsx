'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from '@/hooks/useAction'
import { toast } from '@/components/ui/use-toast'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { CalendarIcon, Check, ChevronsUpDown, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { ContainerSize, Good, Service, ServiceType } from '@prisma/client'
import { serviceTypeText } from '@/utils/functions'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { Calendar } from '../../../components/ui/calendar'
import NumberInput from '../../../components/ui/number-input'
import { ServiceSchema } from '@/features/services/actions/schema'
import { createService } from '@/features/services/actions/createService'
import { ServiceWithGoods } from '@/utils/types'
import { updateService } from '@/features/services/actions/updateService'
import { deleteService } from '@/features/services/actions/deleteService'
import { useRouter } from 'next/navigation'
import { formatInTimeZone } from 'date-fns-tz'
import { TIMEZONE } from '@/utils/const'
import FormTextField from '../../../components/ui/forms/form-text-field'
import FormSelect from '../../../components/ui/forms/form-select'
import FormDatePicker from '../../../components/ui/forms/form-date-picker'
import FormTextArea from '../../../components/ui/forms/form-text-area'
import getGoods from '@/features/goods/actions/getGoods'

type Props = {
  type: 'create' | 'update' | 'delete'
  consolidatorId: string
  serviceType: ServiceType
  serviceData?: ServiceWithGoods
  successMessage: string
}

export default function ServiceForm({
  type,
  serviceType,
  consolidatorId,
  serviceData,
  successMessage,
}: Props) {
  const closeDialogRef = useRef<HTMLButtonElement>(null)

  const formSchema = ServiceSchema

  const [goods, setGoods] = useState<Good[]>([])

  const fetchGoodsByConsolidatorId = useCallback(
    async (consolidatorId: string) => {
      try {
        const { data } = await getGoods<Good>({
          pageIndex: 0,
          pageSize: 100,
          filters: [],
          sorting: [],
          consolidatorId,
        })
        setGoods(data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    },
    []
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceId: serviceData?.id || '',
      serviceType,
      truckNumber: serviceData?.truckNumber || '',
      containerNumber: serviceData?.containerNumber || '',
      PEBNumber: serviceData?.PEBNumber || '',
      PEBDate: serviceData?.PEBDate || undefined,
      NPENumber: serviceData?.NPENumber || '',
      NPEDate: serviceData?.NPEDate || undefined,
      containerSize: serviceData?.containerSize || undefined,
      date: serviceData?.date || undefined,
      remarks: serviceData?.remarks || '',
      consolidatorId,
      goods:
        serviceData?.serviceGoods.map(({ goodId, quantity }) => ({
          goodId,
          quantity: quantity ?? 0,
        })) || [],
    },
  })

  useEffect(() => {
    if (consolidatorId) {
      fetchGoodsByConsolidatorId(consolidatorId)
    }
  }, [consolidatorId])

  const router = useRouter()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'goods',
  })

  const actions = {
    create: createService,
    update: updateService,
    delete: deleteService,
  }

  const { execute, fieldErrors } = useAction(actions[type], {
    onSuccess: () => {
      toast({
        title: successMessage,
      })
      closeDialogRef.current?.click()

      if (
        window.location.pathname.startsWith('/services') &&
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
          <p>Apakah Anda yakin ingin menghapus jasa ini?</p>
        ) : (
          <>
            <div className="flex items-center gap-5">
              <FormTextField
                form={form}
                label="Nomor Truck"
                name="truckNumber"
                placeholder="Nomor truck"
              />

              {serviceType === ServiceType.OUT && (
                <>
                  <FormTextField
                    form={form}
                    label="Nomor Container"
                    name="containerNumber"
                    placeholder="Nomor container"
                  />

                  <FormSelect
                    form={form}
                    label="Ukuran Container"
                    name="containerSize"
                    placeholder="Pilih ukuran container"
                    options={Object.values(ContainerSize)}
                  />
                </>
              )}

              <FormDatePicker
                form={form}
                name="date"
                label="Tanggal Pengerjaan"
                placeholder="Pilih tanggal"
              />
            </div>

            {serviceType === ServiceType.OUT && (
              <div className="flex items-center gap-5">
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
              </div>
            )}

            <FormTextArea
              form={form}
              name="remarks"
              label="Keterangan"
              placeholder="Keterangan"
            />

            {/* Goods Array Field with Combobox for goodId */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between w-full">
                <FormLabel>Barang</FormLabel>
                <Button
                  type="button"
                  onClick={() =>
                    append({
                      goodId: '',
                      quantity: 0,
                    })
                  }
                >
                  Tambah Barang
                </Button>
              </div>
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="flex space-x-2 items-center justify-between"
                >
                  <div className="flex space-x-2 items-center">
                    {/* Combobox for selecting goodId */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'min-w-[700px] justify-between',
                              !form.watch(`goods.${index}.goodId`) &&
                                'text-muted-foreground'
                            )}
                          >
                            {form.watch(`goods.${index}.goodId`)
                              ? goods.find(
                                  (good) =>
                                    good.id ===
                                    form.watch(`goods.${index}.goodId`)
                                )?.name
                              : 'Pilih barang'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="min-w-[700px] p-0">
                        <Command>
                          <CommandInput placeholder="Search good..." />
                          <CommandList>
                            <CommandEmpty>Barang tidak ditemukan</CommandEmpty>
                            <CommandGroup>
                              {goods.map((good) => (
                                <CommandItem
                                  value={good.name}
                                  key={good.id}
                                  onSelect={() => {
                                    form.setValue(
                                      `goods.${index}.goodId`,
                                      good.id,
                                      {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      }
                                    )
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      good.id ===
                                        form.watch(`goods.${index}.goodId`)
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {`${good.name} - ${good.shipper} - ${good.consignee}`}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Other fields for good */}
                    <FormControl>
                      <NumberInput
                        className="w-[100px]"
                        {...form.register(`goods.${index}.quantity`)}
                        control={form.control}
                      />
                    </FormControl>
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
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
