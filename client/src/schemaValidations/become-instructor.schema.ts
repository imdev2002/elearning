import { z } from 'zod'

export const BecomeInstructorBody = z.object({
  real_firstName: z.string(),
  real_lastName: z.string(),
  frontIdCard: z.any(),
  backIdCard: z.any(),
  selfie: z.any(),
  category: z.string(),
  linkCV: z.string(),
})

export type BecomeInstructorBodyType = z.infer<typeof BecomeInstructorBody>
