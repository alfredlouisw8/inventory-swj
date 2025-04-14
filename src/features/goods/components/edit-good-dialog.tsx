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
import { Good } from '@prisma/client'

type Props = {
  goodData: Good
  triggerComponent: React.ReactNode
}

export default function EditGoodDialog({ goodData, triggerComponent }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[calc(100vh-160px)] overflow-auto">
        <DialogHeader>
          <DialogTitle>Ubah Barang</DialogTitle>
        </DialogHeader>
        <GoodForm
          type="update"
          consolidatorId={goodData.consolidatorId}
          goodData={goodData}
          successMessage="Barang berhasil diubah"
        />
      </DialogContent>
    </Dialog>
  )
}
