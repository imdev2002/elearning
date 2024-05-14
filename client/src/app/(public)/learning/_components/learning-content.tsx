'use client'

import LearningDocumentLesson from '@/app/(public)/learning/_components/learning-document-lesson'
import LearningVideoLesson from '@/app/(public)/learning/_components/learning-video-lesson'
import { Lesson } from '@/app/globals'
import CommentSection from '@/components/comment'
import { Heading } from '@/components/heading'
import http, { clientTokens } from '@/lib/http'
import { generateMediaLink } from '@/lib/utils'
import { lessonPublicApiRequest } from '@/services/lesson.service'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

type Props = {
  data: Lesson
}

const LearningContent = ({ data }: Props) => {
  return (
    <div className="w-3/5 mt-4">
      {data.lessonType === 'TEXT' ? (
        <LearningDocumentLesson data={data} />
      ) : (
        <LearningVideoLesson data={data} />
      )}
      <div className="space-y-4 mt-8">
        <Heading title="Comments" />
        <CommentSection postId={data.id} data={data.comments} />
      </div>
    </div>
  )
}

export default LearningContent
