import {
  calculateProfit,
  getSellPriceBeforeTax,
  getSellPriceTotal,
  serviceTypeText,
} from '@/utils/functions'
import { format } from 'date-fns'
import prisma from '@/lib/prisma'
import { ExportInvoiceData } from '@/utils/types'
import { formatInTimeZone } from 'date-fns-tz'
import { TIMEZONE } from '@/utils/const'

export async function exportInvoicesData(
  consolidatorId: string | null,
  fromValue: string,
  toValue: string,
  type: string
): Promise<ExportInvoiceData> {
  try {
    // Fetch consolidator and services with related invoices in one query
    let consolidatorInvoices = []
    let consolidator

    if (consolidatorId) {
      if (type === 'date') {
        consolidator = await prisma.consolidator.findUnique({
          where: { id: consolidatorId },
          include: {
            invoices: {
              where: {
                invoiceDate: {
                  gte: new Date(fromValue), // `fromValue` is the start date (e.g., new Date('2023-01-01'))
                  lte: new Date(toValue), // `toValue` is the end date (e.g., new Date('2023-12-31'))
                },
              },
              include: {
                services: true,
              },
            },
          },
        })

        if (!consolidator) {
          throw new Error('Consolidator not found')
        }
      }

      if (type === 'number') {
        consolidator = await prisma.consolidator.findUnique({
          where: { id: consolidatorId },
          include: {
            invoices: {
              include: {
                services: true,
              },
            },
          },
        })

        if (!consolidator) {
          throw new Error('Consolidator not found')
        }

        // Filter invoices based on the number in the invoiceCode
        const filteredInvoices = consolidator.invoices.filter((invoice) => {
          const firstNumber = parseInt(invoice.invoiceCode.split('/')[0], 10) // Extract the first number
          return (
            firstNumber >= parseInt(fromValue) &&
            firstNumber <= parseInt(toValue)
          ) // Check if it falls within the range
        })

        // Replace the original invoices with the filtered ones
        consolidator.invoices = filteredInvoices
      }

      consolidatorInvoices.push(consolidator)
    } else {
      if (type === 'date') {
        consolidator = await prisma.consolidator.findMany({
          where: {
            invoices: {
              some: {
                invoiceDate: {
                  gte: new Date(fromValue),
                  lte: new Date(toValue),
                },
              },
            },
          },
          include: {
            invoices: {
              where: {
                invoiceDate: {
                  gte: new Date(fromValue), // `fromValue` is the start date (e.g., new Date('2023-01-01'))
                  lte: new Date(toValue), // `toValue` is the end date (e.g., new Date('2023-12-31'))
                },
              },
              include: {
                services: true,
              },
            },
          },
        })
      }

      if (type === 'number') {
        consolidator = await prisma.consolidator.findMany({
          include: {
            invoices: {
              include: {
                services: true,
              },
            },
          },
        })

        // Extract and filter based on the first number in `invoiceCode`
        consolidator = consolidator.map((cust) => {
          const filteredInvoices = cust.invoices.filter((invoice) => {
            const firstNumber = parseInt(invoice.invoiceCode.split('/')[0], 10) // Extract the first number
            return (
              firstNumber >= parseInt(fromValue) &&
              firstNumber <= parseInt(toValue)
            ) // Compare with range
          })

          return { ...cust, invoices: filteredInvoices }
        })
      }

      if (!consolidator) {
        throw new Error('Consolidator not found')
      }

      consolidatorInvoices = [...consolidator]
    }

    const data = consolidatorInvoices.map((consolidator) => ({
      consolidatorName: consolidator!.name,
      invoices: consolidator!.invoices.map((invoice) => {
        const buyPriceTotal = invoice.services.reduce(
          (acc, service) => acc + (service.buyPrice || 0),
          0
        )

        const sellPriceBeforeTax = getSellPriceBeforeTax(
          invoice.totalPrice || 0,
          invoice.services.map((s) => s.sellPrice || 0)
        )

        const sellPriceTotal = getSellPriceTotal(
          sellPriceBeforeTax,
          invoice.tax || false
        )

        const totalProfit = calculateProfit(
          buyPriceTotal,
          sellPriceBeforeTax,
          invoice.tax || false
        )

        return {
          invoiceCode: invoice.invoiceCode,
          tax: invoice.tax ? 'Ya' : 'Tidak',
          paymentDate: invoice.paymentDate
            ? formatInTimeZone(invoice.paymentDate, TIMEZONE, 'dd-MM-yyyy')
            : '-',
          invoiceDate: formatInTimeZone(
            invoice.invoiceDate,
            TIMEZONE,
            'dd-MM-yyyy'
          ),
          buyPriceTotal,
          sellPriceBeforeTax,
          sellPriceTotal,
          totalProfit,
          remarks: invoice.remarks || '',
          services: invoice.services.map((service) => ({
            serviceType: serviceTypeText(service.serviceType),
            serviceCode: service.serviceCode,
            buyPrice: service.buyPrice || 0,
            sellPrice: service.sellPrice || 0,
            date: formatInTimeZone(service.date, TIMEZONE, 'dd-MM-yyyy'),
            remarks: service.remarks || '',
          })),
        }
      }),
    }))

    return data

    // return data
  } catch (error) {
    console.error('Error exporting invoice data:', error)
    throw error // Optionally throw to notify caller
  }
}
