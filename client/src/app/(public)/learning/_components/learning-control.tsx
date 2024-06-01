'use client'

import { useCourse } from '@/contexts/course'
import { userApiRequest } from '@/services/user.service'
import { Button } from '@nextui-org/react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

type Props = {
  data?: any
}

const LearningControl = ({ data }: Props) => {
  const { progress } = useCourse()
  const { replace } = useRouter()
  const { courseId } = useParams()
  const searchParams = useSearchParams()
  const lessonId = searchParams.get('lesson')

  // const searchParams = useSearchParams()
  // const lessonId = searchParams.get('lesson')
  // const [canPrev, setCanPrev] = React.useState(false)
  // const [canNext, setCanNext] = React.useState(false)
  // const indexLesson = lessonId
  //   ? data.lessons.findIndex(
  //       (item: any) => item.lesson.id === parseInt(lessonId)
  //     )
  //   : -1
  // useEffect(() => {
  //   ;(async function fetchProgress() {
  //     try {
  //       const res = await userApiRequest.getCourseProgress()
  //       if (res.status === 200 && lessonId) {
  //         const course = (res.payload as any[]).find(
  //           (course: any) => course.id === data.id
  //         )
  //         const lisLessonFinished = course.lessons.map(
  //           (item: any) => item.lesson.lessonNumber
  //         )
  //         const isFinished = lisLessonFinished.includes(parseInt(lessonId))
  //         setCanNext(isFinished)
  //         setCanPrev(isFinished)
  //       }
  //     } catch (error) {}
  //   })()
  // }, [lessonId])

  // const handleNextLesson = () => {
  //   if (canNext) {
  //     const nextLesson = data.lessons[indexLesson + 1]
  //     push(`/learning/${data.id}?lesson=${nextLesson.lesson.id}`)
  //   }
  // }
  return (
    <div className="justify-between h-full sticky bottom-0 bg-primary hidden">
      <Button className="w-2/4 rounded-none border-r" color="primary">
        Prev
      </Button>
      <Button
        className="flex-1 rounded-none border-l"
        color="primary"
        // onClick={handleNextLesson}
      >
        Next
      </Button>
    </div>
  )
}

export default LearningControl
