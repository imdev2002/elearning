import z from 'zod'

export const CourseBody = z.object({
  thumbnail: z.string(),
  courseName: z.string(),
  knowledgeGained: z.string(),
  isPublic: z.boolean(),
  descriptionMD: z.string(),
  priceAmount: z.string(),
  category: z.string(),
})

export type CourseBodyType = z.infer<typeof CourseBody>

export const CoureRes = z.object({
  id: z.number(),
  timestamp: z.string(),
  totalLesson: z.number(),
  totalPart: z.number(),
  courseName: z.string(),
  totalDuration: z.number(),
  knowledgeGained: z.array(z.unknown()),
  isPublic: z.boolean(),
  status: z.string(),
  thumbnail: z.string(),
  category: z.string(),
  priceAmount: z.number(),
  currency: z.string(),
  priceId: z.string(),
  productId: z.string(),
  descriptionMD: z.string(),
  userId: z.number(),
  coursedPaid: z.array(z.unknown()),
  comments: z.array(z.unknown()),
  hearts: z.array(z.unknown()),
  emojis: z.array(z.unknown()),
  certificates: z.array(z.unknown()),
  parts: z.array(z.unknown()),
  lessons: z.array(z.unknown()),
})

export type CourseResType = z.infer<typeof CoureRes>

export const CoursePartsBody = z.object({
  partNumber: z.coerce.number(),
  partName: z.string(),
})

export type CoursePartsBodyType = z.infer<typeof CoursePartsBody>
