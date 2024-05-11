import z from 'zod'

export const LessonBody = z.object({
  video: z.any(),
  thumbnail: z.any(),
  lessonName: z.string(),
  lessonNumber: z.coerce.number(),
  trialAllowdown: z.boolean(),
  descriptionMD: z.string(),
  courseId: z.coerce.number(),
  partNumber: z.coerce.number(),
})

export type LessonBodyType = z.infer<typeof LessonBody>
