import { DataTable } from '@/components/ui/data-table/data-table'
import { Log } from '@prisma/client'
import { logColumns } from '@/features/logs/columns'
import { logsFilterFields } from '@/features/logs/const'
import getLogs from '@/features/logs/actions/getLogs'

export default async function LogsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Logs</h1>
      </div>
      <div
        className="flex flex-col rounded-lg shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <DataTable<Log, string>
          columns={logColumns}
          data={[]}
          filterFields={logsFilterFields}
          fetchFunction={getLogs}
        />
      </div>
    </>
  )
}
