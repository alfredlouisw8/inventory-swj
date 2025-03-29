import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ServiceForm from './form'
import { ServiceWithGoods } from '@/utils/types'

type Props = {
  triggerComponent: React.ReactNode
  serviceData: ServiceWithGoods
}

export default function DeleteServiceDialog({
  triggerComponent,
  serviceData,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Jasa</DialogTitle>
        </DialogHeader>
        <ServiceForm
          serviceType={serviceData.serviceType}
          type="delete"
          consolidatorId={serviceData.consolidatorId}
          serviceData={serviceData}
          successMessage="Jasa berhasil dihapus"
        />
      </DialogContent>
    </Dialog>
  )
}
