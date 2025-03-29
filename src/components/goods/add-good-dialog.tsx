import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import GoodForm from './form'

type Props = {
  consolidatorId: string
}

export default function AddGoodDialog({ consolidatorId }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Tambah</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Barang</DialogTitle>
        </DialogHeader>
        <GoodForm
          type="create"
          consolidatorId={consolidatorId}
          successMessage="Barang berhasil ditambahkan"
        />
      </DialogContent>
    </Dialog>
  )
}
