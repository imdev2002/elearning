import LearningContent from '@/app/(public)/learning/_components/learning-content'
import LearningControl from '@/app/(public)/learning/_components/learning-control'
import LearningSidebar from '@/app/(public)/learning/_components/learning-sidebar'
import { coursePublicApiRequests } from '@/services/course.service'
import { lessonPublicApiRequest } from '@/services/lesson.service'
import { cookies } from 'next/headers'
import React from 'react'

type Props = {
  params: {
    courseId: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

const LearningPage = async ({ params, searchParams }: Props) => {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const { courseId } = params
  const { lesson } = searchParams

  const { payload: courseData } = await coursePublicApiRequests.get(
    Number(courseId)
  )
  const { parts } = courseData

  const { payload: lessonData } = await lessonPublicApiRequest.get(
    Number(lesson),
    accessToken
  )
  return (
    <>
      <div className="flex gap-x-4">
        <LearningContent data={lessonData} />
        <LearningSidebar data={parts} />
      </div>
      <LearningControl />
    </>
  )
}

export default LearningPage
