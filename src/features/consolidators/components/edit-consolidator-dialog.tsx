import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ConsolidatorForm from './form'
import { Consolidator } from '@prisma/client'

type Props = {
  triggerComponent: React.ReactNode
  consolidatorData: Consolidator
}

export default function EditConsolidatorDialog({
  triggerComponent,
  consolidatorData,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ubah Consolidator</DialogTitle>
        </DialogHeader>
        <ConsolidatorForm
          type="update"
          consolidatorData={consolidatorData}
          successMessage="Consolidator berhasil diubah"
        />
      </DialogContent>
    </Dialog>
  )
}
