import { z } from 'zod'

export const ConsolidatorSchema = z.object({
  name: z.string().min(1, {
    message: 'Harus diisi',
  }),
  remarks: z.string(),
  consolidatorId: z.string(),
})
