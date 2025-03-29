import getConsolidators from '@/actions/consolidators/getConsolidators'
import AddConsolidatorDialog from '@/components/consolidators/add-consolidator-dialog'
import { consolidatorColumns } from '@/components/consolidators/columns'
import { DataTable } from '@/components/ui/data-table/data-table'
import { PER_PAGE } from '@/utils/const'
import { FilterFieldType } from '@/utils/types'
import { Consolidator } from '@prisma/client'

export default async function ConsolidatorsPage() {
  const { data } = await getConsolidators<Consolidator>({
    pageIndex: 0,
    pageSize: PER_PAGE,
    filters: [],
    sorting: [],
  })

  const filterFields: FilterFieldType[] = [
    {
      label: 'Nama',
      value: 'name',
      type: 'default',
    },
  ]

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
          data={data}
          filterFields={filterFields}
          fetchFunction={getConsolidators}
        />
      </div>
    </>
  )
}
