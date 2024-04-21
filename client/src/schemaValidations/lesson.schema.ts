import z from 'zod'

export const LessonBody = z.object({
  video: z.string(),
  thumbnail: z.string(),
  lessonName: z.string(),
  lessonNumber: z.coerce.number(),
  trialAllowdown: z.boolean(),
  descriptionMD: z.string(),
  courseId: z.coerce.number(),
  partNumber: z.coerce.number(),
})

export type LessonBodyType = z.infer<typeof LessonBody>
