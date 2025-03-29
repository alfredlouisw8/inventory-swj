import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'
import NumberInput from '../number-input'

interface FormNumberFieldProps {
  form: any
  label: string
  name: string
  placeholder: string
}

export default function FormNumberField({
  form,
  label,
  name,
}: FormNumberFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <NumberInput control={form.control} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
