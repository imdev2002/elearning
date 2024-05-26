import z from 'zod'

export const CourseBody = z.object({
  thumbnail: z.any(),
  courseName: z.string(),
  knowledgeGained: z.array(z.string()),
  isPublic: z.any(),
  descriptionMD: z.string(),
  priceAmount: z.string(),
  category: z.string(),
})

export type CourseBodyType = z.infer<typeof CourseBody>

// export const CourseRes = z.object({
//   id: z.number(),
//   timestamp: z.string(),
//   totalLesson: z.number(),
//   totalPart: z.number(),
//   courseName: z.string(),
//   totalDuration: z.number(),
//   knowledgeGained: z.array(z.string()),
//   isPublic: z.boolean(),
//   status: z.string(),
//   thumbnail: z.string(),
//   category: z.string(),
//   priceAmount: z.number(),
//   currency: z.string(),
//   priceId: z.string(),
//   productId: z.string(),
//   descriptionMD: z.string(),
//   userId: z.number(),
//   coursedPaid: z.array(z.any()),
//   comments: z.array(z.any()),
//   hearts: z.array(z.any()),
//   emojis: z.array(z.any()),
//   certificates: z.array(z.any()),
//   parts: z.array(z.any()),
//   lessons: z.array(z.any()),
// })
export const CourseRes = z.object({
  courses: z.array(
    z.object({
      id: z.number(),
      timestamp: z.string(),
      totalLesson: z.number(),
      totalPart: z.number(),
      courseName: z.string(),
      totalDuration: z.number(),
      knowledgeGained: z.array(z.string()),
      isPublic: z.boolean(),
      status: z.string(),
      avgRating: z.null(),
      thumbnail: z.string(),
      category: z.string(),
      priceAmount: z.number(),
      currency: z.string(),
      priceId: z.string(),
      productId: z.string(),
      descriptionMD: z.string(),
      userId: z.number(),
      rating: z.array(z.unknown()),
      user: z.object({
        id: z.number(),
        firstName: z.string(),
        lastName: z.null(),
        email: z.string(),
        avatar: z.string(),
      }),
      coursesPaid: z.array(z.unknown()),
      comments: z.array(z.unknown()),
      hearts: z.array(z.unknown()),
      emojis: z.array(z.unknown()),
      certificates: z.array(z.unknown()),
      parts: z.array(
        z.object({
          id: z.number(),
          timestamp: z.string(),
          partNumber: z.number(),
          partName: z.string(),
          description: z.string(),
          courseId: z.number(),
          lessons: z.array(
            z.object({
              id: z.number(),
              timestamp: z.string(),
              lessonName: z.string(),
              lessonNumber: z.number(),
              lessonType: z.string(),
              trialAllowed: z.boolean(),
              descriptionMD: z.string(),
              status: z.string(),
              title: z.null(),
              content: z.null(),
              localPath: z.string(),
              thumbnailPath: z.string(),
              filename: z.string(),
              courseId: z.number(),
              userId: z.number(),
              partId: z.number(),
              comments: z.array(z.unknown()),
              hearts: z.array(z.unknown()),
              emojis: z.array(z.unknown()),
            })
          ),
        })
      ),
    })
  ),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
})

export type CourseResType = z.infer<typeof CourseRes>

export type GetCoursesPublicParamsType = {
  limit?: number
  offset?: number
  search?: string
  category?: string
  orderBy?: string
  direction?: string
  isBestSeller?: boolean
  myOwn?: boolean
  byAuthor?: number
}

export const CoursePartsBody = z.object({
  partNumber: z.string(),
  partName: z.string(),
})

export type CoursePartsBodyType = z.infer<typeof CoursePartsBody>
