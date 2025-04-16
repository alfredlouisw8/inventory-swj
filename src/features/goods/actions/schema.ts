import { z } from 'zod'

export const GoodSchema = z.object({
  name: z.string().min(1, {
    message: 'Harus diisi',
  }),
  consolidatorId: z.string(),
  goodId: z.string(),
  shipper: z.string(),
  consignee: z.string(),
  destination: z.string(),
  packageType: z.string(),
  NPENumber: z.string().optional(),
  NPEDate: z.date().optional(),
  PEBNumber: z.string().optional(),
  PEBDate: z.date().optional(),
  currentQuantity: z.number(),
  truckNumber: z.string().optional(), // service in
  date: z.date().optional(), // service in
  remarks: z.string().optional(),
})
