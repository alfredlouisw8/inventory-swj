import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'
import { Textarea } from '../textarea'

interface FormTextAreaProps {
  form: any
  name: string
  label: string
  placeholder: string
}

export default function FormTextArea({
  form,
  label,
  name,
  placeholder,
}: FormTextAreaProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
