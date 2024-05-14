import { LessonType } from '@/app/globals'
import { title } from 'process'
import z from 'zod'

export const LessonVideoBody = z.object({
  video: z.any(),
  thumbnail: z.any(),
  lessonName: z.string(),
  trialAllowed: z.any(),
  descriptionMD: z.string(),
})

export type LessonVideoBodyType = z.infer<typeof LessonVideoBody>

export const LessonTextBody = z.object({
  lessonName: z.string(),
  trialAllowed: z.any(),
  title: z.string(),
  content: z.string(),
  descriptionMD: z.string(),
})

export type LessonTextBodyType = z.infer<typeof LessonTextBody>
