'use client'

import { useAccountContext } from '@/contexts/account'
import { generateMediaLink } from '@/lib/utils'
import { coursePublicApiRequests } from '@/services/course.service'
import { lessonPublicApiRequest } from '@/services/lesson.service'
import { Avatar, Button, Textarea } from '@nextui-org/react'
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
  placeholder?: string
}

const ActionComment = ({
  postId,
  level,
  parentId = null,
  defaultValue,
  onCancel,
  action = 'create',
  type = 'course',
  placeholder = 'Enter your comment here...',
}: Props) => {
  const { user } = useAccountContext()
  const isAuth = !!user?.email
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
  if (!isAuth) return null
  return (
    <>
      <div className="flex gap-2">
        <div>
          <Avatar
            size="sm"
            className={level > 0 ? 'scale-85' : ''}
            src={generateMediaLink(user?.avatar ?? '')}
          />
        </div>
        <Textarea
          variant="faded"
          placeholder={placeholder}
          className="w-full mb-2"
          value={comment}
          onValueChange={setComment}
        />
      </div>
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
    </>
  )
}

export default ActionComment
