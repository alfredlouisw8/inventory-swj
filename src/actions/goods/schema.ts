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
  currentQuantity: z.number(),
  remarks: z.string().optional(),
})
