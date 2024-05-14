'use client'

import { Heading } from '@/components/heading'
import { clientTokens } from '@/lib/http'
import { generateMediaLink } from '@/lib/utils'
import { lessonPublicApiRequest } from '@/services/lesson.service'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

type Props = {
  data?: any
}

const LearningVideoLesson = ({ data }: Props) => {
  const { refresh } = useRouter()
  const [videoURL, setVideoURL] = React.useState('')
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
      const res = await lessonPublicApiRequest.finish(data.id)
      if (res.status === 200) {
        toast.success('Lesson finished', { hideProgressBar: true })
        refresh()
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
      <Heading title={data.lessonName} className="text-2xl" />
      <p>{data.descriptionMD}</p>
    </div>
  )
}

export default LearningVideoLesson
