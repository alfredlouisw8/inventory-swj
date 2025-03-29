import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import InvoiceForm from './form'

type Props = {
  consolidatorId: string
}

export default function AddInvoiceDialog({ consolidatorId }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Tambah</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[calc(100vh-160px)] overflow-auto">
        <DialogHeader>
          <DialogTitle>Tambah Invoice</DialogTitle>
        </DialogHeader>
        <InvoiceForm
          type="create"
          consolidatorId={consolidatorId}
          successMessage="Invoice berhasil ditambahkan"
        />
      </DialogContent>
    </Dialog>
  )
}
