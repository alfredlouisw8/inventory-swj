import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ServiceForm from './form'
import { Service, ServiceType } from '@prisma/client'
import getGoods from '@/actions/goods/getGoods'
import { ServiceWithGoods } from '@/utils/types'

type Props = {
  triggerComponent: React.ReactNode
  serviceData: ServiceWithGoods
}

export default function EditServiceDialog({
  triggerComponent,
  serviceData,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[calc(100vh-160px)] overflow-auto">
        <DialogHeader>
          <DialogTitle>Ubah Jasa</DialogTitle>
        </DialogHeader>
        <ServiceForm
          serviceType={serviceData.serviceType}
          type="update"
          serviceData={serviceData}
          successMessage="Jasa berhasil diubah"
          consolidatorId={serviceData.consolidatorId}
        />
      </DialogContent>
    </Dialog>
  )
}
