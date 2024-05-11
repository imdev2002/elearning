'use client'

import { Lesson } from '@/app/globals'
import CommentSection from '@/components/comment'
import http, { clientTokens } from '@/lib/http'
import { generateMediaLink } from '@/lib/utils'
import { lessonPublicApiRequest } from '@/services/lesson.service'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

type Props = {
  data: Lesson
}

const LearningContent = () => {
  const searchParams = useSearchParams()
  const lessonId = searchParams.get('lesson')
  const [lesson, setLesson] = React.useState<Lesson>()
  const [videoURL, setVideoURL] = React.useState('')
  useEffect(() => {
    ;(async function fetchLesson() {
      try {
        const res = await lessonPublicApiRequest.get(Number(lessonId))
        if (res.status === 200) {
          setLesson(res.payload)
          const url = generateMediaLink(res.payload.filename ?? '')
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
  }, [lessonId])
  if (!lesson) return null
  return (
    <div className="w-3/5">
      <div>
        <video
          className="VideoInput_video"
          width="100%"
          height={400}
          controls
          src={videoURL}
        />
        <h3>{lesson.lessonName}</h3>
      </div>
      <CommentSection postId={lesson.id} data={lesson.comments} />
    </div>
  )
}

export default LearningContent
