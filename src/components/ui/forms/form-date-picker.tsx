import { cn } from '@/lib/utils'
import { Button } from '../button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { formatInTimeZone } from 'date-fns-tz'
import { TIMEZONE } from '@/utils/const'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../calendar'

interface FormDatePickerProps {
  form: any
  name: string
  label: string
  placeholder: string
}

export default function FormDatePicker({
  form,
  name,
  label,
  placeholder,
}: FormDatePickerProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
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
                    formatInTimeZone(field.value, TIMEZONE, 'dd-MM-yyyy')
                  ) : (
                    <span>{placeholder}</span>
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
  )
}
