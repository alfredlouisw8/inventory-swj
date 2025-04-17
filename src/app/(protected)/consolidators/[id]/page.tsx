import getConsolidatorDetail from '@/features/consolidators/actions/getConsolidatorDetail'
import getGoods from '@/features/goods/actions/getGoods'
import { goodColumns } from '@/features/goods/components/columns'
import AddGoodDialog from '@/features/goods/components/add-good-dialog'
import AddServiceDialog from '@/features/services/components/add-service-dialog'
import BackButton from '@/components/back-button'
import {
  serviceInColumns,
  serviceOutColumns,
} from '@/features/services/components/columns'
import { Button } from '@/components/ui/button'
import { PencilIcon, Trash2 } from 'lucide-react'
import EditConsolidatorDialog from '@/features/consolidators/components/edit-consolidator-dialog'
import DeleteConsolidatorDialog from '@/features/consolidators/components/delete-consolidator-dialog'

import { Good, ServiceType } from '@prisma/client'
import { DataTable } from '@/components/ui/data-table/data-table'
import { ServiceWithGoods } from '@/utils/types'
import { goodsFilterFields } from '@/features/goods/const'
import {
  servicesInFilterFields,
  servicesOutFilterFields,
} from '@/features/services/const'
import { servicesFetchFunction } from '@/features/services/functions'

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

          {/* <div className="flex flex-col gap-3">
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
                data={[]}
                filterFields={servicesInFilterFields}
                fetchFunction={servicesFetchFunction}
                additionalArguments={{
                  consolidatorId,
                  serviceType: ServiceType.IN,
                }}
              />
            </div>
          </div> */}

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">Muat</p>

              <div className="flex items-center gap-2">
                <AddServiceDialog
                  consolidatorId={consolidatorId}
                  serviceType={ServiceType.OUT}
                />
              </div>
            </div>
            <div>
              <DataTable<ServiceWithGoods, string>
                columns={serviceOutColumns}
                data={[]}
                filterFields={servicesOutFilterFields}
                fetchFunction={servicesFetchFunction}
                additionalArguments={{
                  consolidatorId,
                  serviceType: ServiceType.OUT,
                }}
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
                data={[]}
                filterFields={goodsFilterFields}
                fetchFunction={getGoods}
                additionalArguments={{ consolidatorId }}
                defaultFilters={[
                  {
                    id: 'id',
                    value: '0',
                    field: 'currentQuantity',
                    operator: 'greaterThan',
                    type: 'numeric',
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
