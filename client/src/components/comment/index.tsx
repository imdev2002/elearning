'use client'

import { Comment as CommentType } from '@/app/globals'
import ActionComment from '@/components/comment/action-comment'
import Comment from '@/components/comment/comment'
import { displayFullname, generateMediaLink } from '@/lib/utils'
import { Avatar, Button } from '@nextui-org/react'
import { formatDistanceToNow } from 'date-fns'
import { MessagesSquare } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

type Props = {
  data: CommentType[]
  postId: number
}

const CommentSection = ({ data, postId }: Props) => {
  const searchParams = useSearchParams()
  const lessonId = searchParams.get('lesson')
  const type = lessonId ? 'lesson' : 'course'
  console.log('CommentSection  lessonId:', lessonId)
  const dataSorted = [...data].sort(
    (a: CommentType, b: CommentType) =>
      new Date(b.timestamp as string).getTime() -
      new Date(a.timestamp as string).getTime()
  )
  const parentComments = dataSorted.filter((comment) => comment.level === 0)
  return (
    <div>
      <ActionComment postId={postId} level={0} type={type} />

      {parentComments.map((comment) => (
        <Comment key={comment.id} comment={comment} data={data} type={type} />
      ))}
    </div>
  )
}

export default CommentSection
