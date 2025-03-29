'use client'

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { Button } from '../ui/button'
import { ExportInvoiceData } from '@/utils/types'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { useState } from 'react'
import { DatePickerWithRange } from '../ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { TIMEZONE } from '@/utils/const'
import { FormControl, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

type Props = {
  consolidatorId: string
}

export default function ExportInvoiceXlsx({ consolidatorId }: Props) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [fromNumber, setFromNumber] = useState<string>('')
  const [toNumber, setToNumber] = useState<string>('')

  async function generateExcel(invoicesData: ExportInvoiceData) {
    try {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Invoices')

      // Define and style the header row
      const headerRow = worksheet.addRow([
        'Nama Consolidator',
        'Kode Jasa',
        'Tipe Jasa',
        'Keterangan Jasa',
        'Harga Beli',
        'Harga Beli Total',
        'Tanggal Pengerjaan',
        'Tanggal Invoice',
        'Harga Jual',
        'Harga Jual Sebelum Pajak',
        'PPN',
        'Harga Jual Total',
        'Profit',
        'Tanggal Pelunasan',
        'Keterangan',
      ])

      // Apply styles to the header row
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' }, // Yellow background
        }
        cell.font = { bold: true }
        cell.alignment = { vertical: 'middle', horizontal: 'center' } // Center text
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
      })

      // Set row height for the header (optional, you can remove this if you want it to be the same as other rows)
      headerRow.height = 20 // Set header row height

      let currentRow = 2 // Start from the second row (first row is header)

      invoicesData.forEach((consolidatorData) => {
        const { consolidatorName, invoices } = consolidatorData

        invoices.forEach((invoice) => {
          let numServices = invoice.services.length

          // Add the first row for each invoice
          worksheet.addRow([consolidatorName, invoice.invoiceCode])

          // add rows even if there are no services

          if (numServices === 0) {
            const row = worksheet.addRow([
              null, // Skip nama_consolidator (since it's merged)
              '-', // B3, B4 for services
              '-',
              '-',
              '-',
              invoice.buyPriceTotal, // E3:E4 merged for buyPriceTotal
              '-',
              invoice.invoiceDate,
              '-',
              invoice.sellPriceBeforeTax, // Sell price before tax (merged)
              invoice.tax, // PPN (merged)
              invoice.sellPriceTotal, // Sell price total (merged)
              invoice.totalProfit, // Profit (merged)
              '-',
              invoice.remarks, // Remarks (merged)
            ])

            // Apply styles to each row cell
            row.eachCell((cell) => {
              cell.alignment = { vertical: 'middle', horizontal: 'center' } // Center text
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
              }
            })

            // Set a minimum height for each row to prevent it from looking cramped
            worksheet.getRow(currentRow).height = 18 // Adjust this value as needed

            numServices = 1
          } else {
            // Add the service-specific rows (starting from currentRow + 1)
            invoice.services.forEach((service, index) => {
              const row = worksheet.addRow([
                null, // Skip nama_consolidator (since it's merged)
                service.serviceCode, // B3, B4 for services
                service.serviceType,
                service.remarks,
                service.buyPrice,
                invoice.buyPriceTotal, // E3:E4 merged for buyPriceTotal
                service.date,
                invoice.invoiceDate,
                service.sellPrice,
                invoice.sellPriceBeforeTax, // Sell price before tax (merged)
                invoice.tax, // PPN (merged)
                invoice.sellPriceTotal, // Sell price total (merged)
                invoice.totalProfit, // Profit (merged)
                service.date,
                invoice.remarks, // Remarks (merged)
              ])

              // Apply styles to each row cell
              row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' } // Center text
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' },
                }
              })

              // Set a minimum height for each row to prevent it from looking cramped
              worksheet.getRow(currentRow).height = 18 // Adjust this value as needed
            })
          }

          // Merge the necessary cells for consolidator and invoice **after** all services are added
          worksheet.mergeCells(currentRow, 1, currentRow + numServices, 1) // Merge nama_consolidator (A2:A4)
          worksheet.mergeCells(currentRow, 2, currentRow, 15) // Merge kode_invoice (B2:M2)

          // Apply styles to merged cells for `nama_consolidator` and `kode_invoice`
          const consolidatorCell = worksheet.getCell(`A${currentRow}`)
          const invoiceCell = worksheet.getCell(`B${currentRow}`)

          // Styling merged consolidator name and invoice code
          ;[consolidatorCell, invoiceCell].forEach((cell) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' } // Center text
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            }
          })

          // Merge invoice-level details across service rows
          worksheet.mergeCells(currentRow + 1, 6, currentRow + numServices, 6) // Merge harga_beli_total
          worksheet.mergeCells(currentRow + 1, 8, currentRow + numServices, 8) // Merge invoiceDate
          worksheet.mergeCells(currentRow + 1, 10, currentRow + numServices, 10) // Merge sellPriceBeforeTax
          worksheet.mergeCells(currentRow + 1, 11, currentRow + numServices, 11) // Merge tax
          worksheet.mergeCells(currentRow + 1, 12, currentRow + numServices, 12) // Merge sellPriceTotal
          worksheet.mergeCells(currentRow + 1, 13, currentRow + numServices, 13) // Merge profit
          worksheet.mergeCells(currentRow + 1, 14, currentRow + numServices, 14) // Merge paymentDate
          worksheet.mergeCells(currentRow + 1, 15, currentRow + numServices, 15) // Merge remarks (keterangan)

          // Add space after each invoice
          worksheet.addRow([])
          worksheet.mergeCells(
            currentRow + numServices + 1,
            1,
            currentRow + numServices + 1,
            15
          )

          // Update currentRow to reflect the next set of rows
          currentRow = currentRow + numServices + 2
        })
      })

      // Adjust column widths based on content length
      worksheet.columns.forEach((column, index) => {
        let maxLength = 0
        if (column) {
          //@ts-ignore
          column.eachCell({ includeEmpty: true }, (cell) => {
            const cellValue = cell.value ? cell.value.toString() : ''
            if (cellValue.length > maxLength) {
              maxLength = cellValue.length
            }
          })
          column.width = maxLength + 2 // Add some padding to fit content
        }
      })

      // Set a minimum row height for all rows to prevent them from looking cramped
      worksheet.eachRow((row) => {
        if (!row.height || row.height < 30) {
          row.height = 30 // Set a minimum height
        }
      })

      // Generate the Excel file and trigger download
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      saveAs(blob, `Invoices.xlsx`)
    } catch (error) {
      console.error('Error exporting invoices to Excel:', error)
      alert('Failed to export invoices.')
    }
  }

  async function exportInvoices(
    consolidatorId: string,
    type: 'date' | 'number'
  ) {
    try {
      // Fetch invoice data from the API
      let from, to

      if (type === 'date') {
        from = formatInTimeZone(
          dateRange?.from || new Date(),
          TIMEZONE,
          'yyyy-MM-dd'
        )
        to = formatInTimeZone(
          dateRange?.to || new Date(),
          TIMEZONE,
          'yyyy-MM-dd'
        )
      }

      if (type === 'number') {
        from = fromNumber
        to = toNumber
      }

      const response = await fetch(
        `/api/invoices/export?consolidatorId=${consolidatorId}&from=${from}&to=${to}&type=${type}`
      )

      if (!response.ok) throw new Error('Failed to fetch invoice data')

      let invoicesData: ExportInvoiceData

      const { data } = await response.json()
      if (!data.length) throw new Error('No data available for export')

      invoicesData = data

      await generateExcel(invoicesData)
    } catch (error) {
      console.error('Error exporting invoices to Excel:', error)
      alert('Failed to export invoices.')
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Export</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Invoice</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <DatePickerWithRange
              className="max-w-sm"
              label="tanggal"
              onChange={setDateRange}
            />
          </div>
          <div className="flex items-center gap-5">
            <div className="flex-1 flex flex-col gap-2">
              <Label>Start Invoice No</Label>
              <Input
                type="number"
                placeholder="Start Invoice No"
                onChange={(e) => setFromNumber(e.target.value)}
                value={fromNumber}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <Label>End Invoice No</Label>
              <Input
                type="number"
                placeholder="End Invoice No"
                onChange={(e) => setToNumber(e.target.value)}
                value={toNumber}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => exportInvoices(consolidatorId, 'date')}>
              Export By Date
            </Button>
            <Button onClick={() => exportInvoices(consolidatorId, 'number')}>
              Export By Invoice No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
