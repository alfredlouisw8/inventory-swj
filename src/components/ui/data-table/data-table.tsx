'use client'

import {
  ColumnDef,
  FilterFn,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useCallback, useEffect, useState } from 'react'
import DataTableSearch from './data-table-search'
import { BasicDataTable } from './basic-data-table'
import { FilterFieldType, FilterType } from '@/utils/types'
import { PER_PAGE } from '@/utils/const'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterFields: FilterFieldType[]
  fetchFunction: (options: {
    pageIndex: number
    pageSize: number
    filters: FilterType[]
    sorting?: SortingState
  }) => Promise<{ data: TData[]; count: number }>
}
export function DataTable<TData, TValue>({
  columns,
  data,
  filterFields,
  fetchFunction,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowCount, setRowCount] = useState<number>(0)
  const [tableData, setTableData] = useState<TData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PER_PAGE,
  })
  const [filters, setFilters] = useState<FilterType[]>([])

  const fetchData = useCallback(
    async (
      pageIndex: number,
      pageSize: number,
      filters: FilterType[],
      sorting?: SortingState
    ) => {
      setIsLoading(true)
      try {
        const { data, count } = await fetchFunction({
          pageIndex,
          pageSize,
          filters,
          sorting,
        })
        setTableData(data)
        setRowCount(count)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchData(pageIndex, pageSize, filters, sorting)
  }, [fetchData, pageIndex, pageSize, filters, data, sorting])

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const globalFilterFn: FilterFn<any> = useCallback(
    (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      return filterValue.every((filter: FilterType) => {
        if (filter.field !== columnId) return true
        switch (filter.operator) {
          case 'contains':
            return String(value)
              .toLowerCase()
              .includes(filter.value.toLowerCase())
          case 'equals':
            return String(value).toLowerCase() === filter.value.toLowerCase()
          case 'startsWith':
            return String(value)
              .toLowerCase()
              .startsWith(filter.value.toLowerCase())
          case 'endsWith':
            return String(value)
              .toLowerCase()
              .endsWith(filter.value.toLowerCase())
          case 'before':
            return new Date(value as string) < new Date(filter.value)
          case 'after':
            return new Date(value as string) > new Date(filter.value)
          default:
            return true
        }
      })
    },
    []
  )

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: Math.ceil(rowCount / pageSize),
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
      globalFilter: filters,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilters,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    enableMultiSort: true,
  })

  const handleFiltersChange = (newFilters: FilterType[]) => {
    setFilters(newFilters)
    setPagination({ pageIndex: 0, pageSize })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-end space-x-2">
        <DataTableSearch
          onFiltersChange={handleFiltersChange}
          filterFields={filterFields}
        />
      </div>
      <BasicDataTable
        table={table}
        isLoading={isLoading}
        showPagination={true}
      />
    </div>
  )
}
