'use client'

import { Heading } from '@/components/heading'
import React from 'react'

type Props = {
  data: any
}

const LearningDocumentLesson = ({ data }: Props) => {
  return (
    <div className="space-y-4">
      <Heading title={data.lessonName} className="text-4xl" />
      <div
        className="entry-content"
        // Prevent XSS Attack recommen from React Docs
        dangerouslySetInnerHTML={{
          __html: data.content || '',
        }}
      ></div>
    </div>
  )
}

export default LearningDocumentLesson
