'use client'

import { coursePublicApiRequests } from '@/services/course.service'
import { lessonPublicApiRequest } from '@/services/lesson.service'
import { Button, Textarea } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify'

type Props = {
  postId: number
  level: number
  parentId?: number | null
  defaultValue?: string
  onCancel?: () => void
  action?: 'create' | 'edit'
  type?: 'course' | 'lesson'
}

const ActionComment = ({
  postId,
  level,
  parentId = null,
  defaultValue,
  onCancel,
  action = 'create',
  type = 'course',
}: Props) => {
  const { refresh } = useRouter()
  const [comment, setComment] = React.useState(defaultValue)
  const handleComment = async () => {
    try {
      const data =
        type === 'course'
          ? { courseId: postId, level, content: comment, parentId }
          : { lessonId: postId, level, content: comment, parentId }
      const res =
        type === 'course'
          ? await coursePublicApiRequests.comment(data)
          : await lessonPublicApiRequest.comment(data)
      if (res.status === 200) {
        toast.success('your comment has been added')
        setComment('')
        refresh()
      }
    } catch (error) {}
  }
  const handleUpdateComment = async () => {
    try {
      const res =
        type === 'course'
          ? await coursePublicApiRequests.editComment(postId, {
              content: comment,
            })
          : await lessonPublicApiRequest.editComment(postId, {
              content: comment,
            })
      if (res.status === 200) {
        toast.success('your comment has been added')
        setComment('')
        if (onCancel) {
          onCancel()
        }
        refresh()
      }
    } catch (error) {}
  }

  return (
    <div>
      <Textarea
        variant="faded"
        placeholder="Enter your comment here..."
        className="w-full mb-2"
        value={comment}
        onValueChange={setComment}
      />
      {action === 'create' ? (
        <Button
          className="ml-auto block"
          onClick={handleComment}
          color="primary"
        >
          Comment
        </Button>
      ) : (
        <div className="flex gap-2 justify-end">
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={handleUpdateComment} color="primary">
            Update
          </Button>
        </div>
      )}
    </div>
  )
}

export default ActionComment
