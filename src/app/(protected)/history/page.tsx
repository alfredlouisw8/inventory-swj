import { DataTable } from '@/components/ui/data-table/data-table'
import { ServiceType } from '@prisma/client'
import getServices from '@/features/services/actions/getServices'
import { serviceOutHistoryColumns } from '@/features/services/components/columns'
import { servicesOutHistoryFilterFields } from '@/features/services/const'
import { ServiceWithGoodsHistory } from '@/utils/types'

export default async function HistoryPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">History</h1>
      </div>
      <div
        className="flex flex-col rounded-lg shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <DataTable<ServiceWithGoodsHistory, string>
          columns={serviceOutHistoryColumns}
          data={[]}
          filterFields={servicesOutHistoryFilterFields}
          fetchFunction={getServices}
          additionalArguments={{ serviceType: ServiceType.OUT }}
        />
      </div>
    </>
  )
}
