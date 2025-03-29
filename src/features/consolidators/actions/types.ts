import { z } from 'zod'
import { Consolidator } from '@prisma/client'

import { ActionState } from '@/lib/create-safe-action'
import { ConsolidatorSchema } from './schema'

export type InputType = z.infer<typeof ConsolidatorSchema>
export type ReturnType = ActionState<InputType, Consolidator>
