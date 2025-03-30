import { DataTable } from '@/components/ui/data-table/data-table'
import { PER_PAGE } from '@/utils/const'
import { Good } from '@prisma/client'
import getGoods from '@/features/goods/actions/getGoods'
import { goodColumns } from '@/features/goods/components/columns'
import { goodsFilterFields } from '@/features/goods/const'

export default async function InventoryPage() {
  const { data } = await getGoods<Good>({
    pageIndex: 0,
    pageSize: PER_PAGE,
    filters: [],
    sorting: [],
  })

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Gudang</h1>
      </div>
      <div
        className="flex flex-col rounded-lg shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <DataTable<Good, string>
          columns={goodColumns}
          data={data}
          filterFields={goodsFilterFields}
          fetchFunction={getGoods}
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
    </>
  )
}
