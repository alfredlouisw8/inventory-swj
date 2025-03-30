import getConsolidators from '@/features/consolidators/actions/getConsolidators'
import AddConsolidatorDialog from '@/features/consolidators/components/add-consolidator-dialog'
import { consolidatorColumns } from '@/features/consolidators/components/columns'
import { DataTable } from '@/components/ui/data-table/data-table'
import { PER_PAGE } from '@/utils/const'
import { Consolidator } from '@prisma/client'
import { consolidatorfilterFields } from '@/features/consolidators/const'

export default async function ConsolidatorsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Consolidators</h1>
        <AddConsolidatorDialog />
      </div>
      <div
        className="flex flex-col rounded-lg shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <DataTable<Consolidator, string>
          columns={consolidatorColumns}
          data={[]}
          filterFields={consolidatorfilterFields}
          fetchFunction={getConsolidators}
        />
      </div>
    </>
  )
}
