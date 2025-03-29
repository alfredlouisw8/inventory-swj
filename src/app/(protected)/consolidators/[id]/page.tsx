import getConsolidatorDetail from '@/actions/consolidators/getConsolidatorDetail'
import getServices from '@/actions/services/getServices'
import getGoods from '@/actions/goods/getGoods'
import { goodColumns } from '@/components/goods/columns'
import AddGoodDialog from '@/components/goods/add-good-dialog'
import AddServiceDialog from '@/components/services/add-service-dialog'
import BackButton from '@/components/back-button'
import { serviceInColumns } from '@/components/services/columns'
import { Button } from '@/components/ui/button'
import { PencilIcon, Trash2 } from 'lucide-react'
import EditConsolidatorDialog from '@/components/consolidators/edit-consolidator-dialog'
import DeleteConsolidatorDialog from '@/components/consolidators/delete-consolidator-dialog'
import { CSVLink, CSVDownload } from 'react-csv'
import ExportCSV from '@/components/export-csv'
import { exportServicesData } from '@/actions/services/exportServices'
import { exportInvoicesData } from '@/actions/invoices/exportInvoices'
import { Good, ServiceType } from '@prisma/client'
import { serviceTypeText } from '@/utils/functions'
import ExportInvoiceXlsx from '@/components/invoices/export-invoice'
import { DataTable } from '@/components/ui/data-table/data-table'
import { FilterFieldType, ServiceWithGoods } from '@/utils/types'

export default async function ConsolidatorDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const consolidatorId = params.id

  const consolidatorDetailData = await getConsolidatorDetail(consolidatorId)

  if (!consolidatorDetailData) {
    return <div>Consolidator tidak ditemukan</div>
  }

  const servicesData = consolidatorDetailData.services
  const goodsData = consolidatorDetailData.goods

  const goodsFilterFields: FilterFieldType[] = [
    {
      label: 'Nama',
      value: 'name',
      type: 'default',
    },
    {
      label: 'Shipper',
      value: 'shipper',
      type: 'default',
    },
    {
      label: 'Consignee',
      value: 'consignee',
      type: 'default',
    },
    {
      label: 'Tujuan',
      value: 'destination',
      type: 'default',
    },
  ]

  const servicesInFilterFields: FilterFieldType[] = [
    {
      label: 'Tanggal Pengerjaan',
      value: 'date',
      type: 'date',
    },
    {
      label: 'Nomor truck',
      value: 'truckNumber',
      type: 'default',
    },
  ]

  return (
    <>
      <BackButton />
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          Detail Consolidator
        </h1>
        <div className="flex items-center gap-2">
          <EditConsolidatorDialog
            consolidatorData={consolidatorDetailData}
            triggerComponent={
              <Button variant="outline" size="icon">
                <PencilIcon className=" h-4 w-4" />
              </Button>
            }
          />
          <DeleteConsolidatorDialog
            consolidatorData={consolidatorDetailData}
            triggerComponent={
              <Button variant="destructive" size="icon">
                <Trash2 className=" h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>
      <div className="flex rounded-lg shadow-sm ">
        <div className="flex flex-col gap-10 w-full">
          <div>
            <p>
              <b>Nama</b>: {consolidatorDetailData.name}
            </p>
            <p>
              <b>Keterangan</b>: {consolidatorDetailData.remarks}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">Bongkar</p>

              <div className="flex items-center gap-2">
                <AddServiceDialog
                  consolidatorId={consolidatorId}
                  serviceType={ServiceType.IN}
                />
              </div>
            </div>
            <div>
              <DataTable<ServiceWithGoods, string>
                columns={serviceInColumns}
                data={servicesData}
                filterFields={servicesInFilterFields}
                fetchFunction={getServices}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">Barang</p>

              <div className="flex items-center gap-2">
                <AddGoodDialog consolidatorId={consolidatorId} />
              </div>
            </div>
            <div>
              <DataTable<Good, string>
                columns={goodColumns}
                data={goodsData}
                filterFields={goodsFilterFields}
                fetchFunction={getGoods}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
