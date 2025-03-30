import BackButton from '@/components/back-button'
import { serviceWithGoodsColumns } from '@/components/serviceGoods/columns'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import getServiceDetail from '@/features/services/actions/getServiceDetail'
import DeleteServiceDialog from '@/features/services/components/delete-service-dialog'
import EditServiceDialog from '@/features/services/components/edit-service-dialog'
import { ContainerSize } from '@/features/services/types'
import { TIMEZONE } from '@/utils/const'
import { serviceTypeText } from '@/utils/functions'
import { ServiceType } from '@prisma/client'
import { formatInTimeZone } from 'date-fns-tz'
import { PencilIcon, Trash2 } from 'lucide-react'

export default async function ServiceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const serviceId = params.id

  const serviceDetail = await getServiceDetail(serviceId)

  if (!serviceDetail) {
    return <div>Jasa tidak ditemukan</div>
  }

  return (
    <>
      <BackButton />
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Detail Jasa</h1>
        <div className="flex items-center gap-2">
          <EditServiceDialog
            serviceData={serviceDetail}
            triggerComponent={
              <Button variant="outline" size="icon">
                <PencilIcon className=" h-4 w-4" />
              </Button>
            }
          />
          <DeleteServiceDialog
            serviceData={serviceDetail}
            triggerComponent={
              <Button variant="destructive" size="icon">
                <Trash2 className=" h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>
      <div className="flex rounded-lg shadow-sm ">
        <div className="flex flex-col gap-5 w-full">
          <div>
            <p>
              <b>Tipe Jasa</b>: {serviceTypeText(serviceDetail.serviceType)}
            </p>

            <p>
              <b>Tanggal Pengerjaan</b>:{' '}
              {serviceDetail.date
                ? formatInTimeZone(serviceDetail.date, TIMEZONE, 'dd-MM-yyyy')
                : '-'}
            </p>
            <p>
              <b>Nomor Truk</b>: {serviceDetail.truckNumber}
            </p>
            <p>
              <b>Keterangan</b>: {serviceDetail.remarks}
            </p>

            {serviceDetail.serviceType === ServiceType.OUT && (
              <>
                <p>
                  <b>Nomor Container</b>: {serviceDetail.containerNumber}
                </p>
                <p>
                  <b>Ukuran Container</b>:{' '}
                  {
                    ContainerSize[
                      serviceDetail.containerSize as keyof typeof ContainerSize
                    ]
                  }
                </p>
                <p>
                  <b>Nomor PEB</b>: {serviceDetail.PEBNumber}
                </p>
                <p>
                  <b>Tanggal PEB</b>:{' '}
                  {formatInTimeZone(
                    serviceDetail.PEBDate as Date,
                    TIMEZONE,
                    'dd-MM-yyyy'
                  )}
                </p>
                <p>
                  <b>Nomor NPE</b>: {serviceDetail.NPENumber}
                </p>
                <p>
                  <b>Tanggal NPE</b>:{' '}
                  {formatInTimeZone(
                    serviceDetail.NPEDate as Date,
                    TIMEZONE,
                    'dd-MM-yyyy'
                  )}
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">Barang</p>
            </div>
            <div>
              <DataTable
                columns={serviceWithGoodsColumns}
                data={serviceDetail.serviceGoods}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
