import { Service, ServiceGood } from '@prisma/client'
import { operatorOptions } from './const'

// Extend the Service type to include serviceGoods
export type ServiceWithGoods = Service & {
  serviceGoods: ServiceGood[]
}

export type ExportInvoiceData = {
  consolidatorName: string
  invoices: {
    invoiceCode: string
    tax: string
    paymentDate: string
    invoiceDate: string
    buyPriceTotal: number
    sellPriceBeforeTax: number
    sellPriceTotal: number
    totalProfit: number
    remarks: string
    services: {
      serviceType: string
      serviceCode: string
      buyPrice: number
      sellPrice: number
      date: string
      remarks: string
    }[]
  }[]
}[]

export type FilterType = {
  id: string
  field: string
  operator: string
  value: string
  type: keyof typeof operatorOptions
}

export type FilterFieldType = {
  value: string
  label: string
  type: keyof typeof operatorOptions
}
