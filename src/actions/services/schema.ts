import { ContainerSize } from '@prisma/client'
import { z } from 'zod'

export const ServiceSchema = z.object({
  serviceId: z.string(),
  serviceType: z.string(),
  date: z.date(),
  remarks: z.string().optional(),
  truckNumber: z.string(),
  containerNumber: z.string().optional(),
  PEBNumber: z.string().optional(),
  PEBDate: z.date().optional(),
  NPENumber: z.string().optional(),
  NPEDate: z.date().optional(),
  containerSize: z.nativeEnum(ContainerSize).optional(),
  consolidatorId: z.string(),
  goods: z.array(
    z.object({
      goodId: z.string(),
      quantity: z.number(),
    })
  ),
})
