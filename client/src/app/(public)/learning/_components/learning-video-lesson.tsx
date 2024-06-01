'use client'

import BookmarkLesson from '@/app/(public)/learning/_components/bookmark-lesson'
import { Heading } from '@/components/heading'
import { useCourse } from '@/contexts/course'
import { clientTokens } from '@/lib/http'
import { generateMediaLink } from '@/lib/utils'
import { lessonPublicApiRequest } from '@/services/lesson.service'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

type Props = {
  data?: any
}

const LearningVideoLesson = ({ data }: Props) => {
  const { setCourseRefresh, progress } = useCourse()
  const { refresh } = useRouter()
  const { courseId } = useParams()
  const [videoURL, setVideoURL] = React.useState('')
  const courseProgress = progress?.find(
    (course: any) => course.courseId === Number(courseId)
  )

  useEffect(() => {
    ;(async function fetchLesson() {
      try {
        if (data.lessonName) {
          const url = generateMediaLink(data.filename ?? '')
          const videoRes = await fetch(url, {
            headers: {
              Authorization: `Bearer ${clientTokens.value.accessToken}`,
            },
          })
          if (videoRes.status === 200) {
            const blob = await videoRes.blob()
            const videoURL = URL.createObjectURL(blob)
            setVideoURL(videoURL)
          }
        }
      } catch (error) {}
    })()
  }, [JSON.stringify(data)])
  const finishedLesson = async () => {
    try {
      if (courseProgress?.lessons.some((l: any) => l.lessonId === data.id))
        return
      const res = await lessonPublicApiRequest.finish(data.id)
      if (res.status === 200) {
        toast.success('Lesson finished', { hideProgressBar: true })
        setCourseRefresh((prev: boolean) => !prev)
      }
    } catch (error) {}
  }
  return (
    <div>
      <video
        className="VideoInput_video rounded-md"
        width="100%"
        height={400}
        controls
        src={videoURL}
        onEnded={finishedLesson}
      />
      <div className="flex gap-2 items-center">
        <Heading title={data.lessonName} className="text-2xl" />
        <BookmarkLesson />
      </div>
      <p>{data.descriptionMD}</p>
    </div>
  )
}

export default LearningVideoLesson
