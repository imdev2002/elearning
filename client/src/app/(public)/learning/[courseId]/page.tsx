import LearningContent from '@/app/(public)/learning/_components/learning-content'
import LearningSidebar from '@/app/(public)/learning/_components/learning-sidebar'
import { coursePublicApiRequests } from '@/services/course.service'
import React from 'react'

type Props = {
  params: {
    courseId: string
  }
}

const LearningPage = async ({ params }: Props) => {
  const { courseId } = params
  const { payload: courseData } = await coursePublicApiRequests.get(
    Number(courseId)
  )
  const { parts } = courseData
  return (
    <div className="flex">
      <LearningContent />
      <LearningSidebar data={parts} />
    </div>
  )
}

export default LearningPage
