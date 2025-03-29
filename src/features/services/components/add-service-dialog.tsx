import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ServiceForm from './form'
import { ServiceType } from '@prisma/client'

type Props = {
  consolidatorId: string
  serviceType: ServiceType
}

export default function AddServiceDialog({
  consolidatorId,
  serviceType,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Tambah</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[calc(100vh-160px)] overflow-auto">
        <DialogHeader>
          <DialogTitle>Tambah Jasa</DialogTitle>
        </DialogHeader>
        <ServiceForm
          type="create"
          serviceType={serviceType}
          consolidatorId={consolidatorId}
          successMessage="Jasa berhasil ditambahkan"
        />
      </DialogContent>
    </Dialog>
  )
}
