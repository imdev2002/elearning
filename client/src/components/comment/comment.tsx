'use client'

import { Comment as CommentType } from '@/app/globals'
import ActionComment from '@/components/comment/action-comment'
import { useAccountContext } from '@/contexts/account'
import { cn, displayFullname, generateMediaLink } from '@/lib/utils'
import { coursePublicApiRequests } from '@/services/course.service'
import { lessonPublicApiRequest } from '@/services/lesson.service'
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { formatDistanceToNow } from 'date-fns'
import { ChevronUp, Ellipsis, MessagesSquare, Reply } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

type Props = {
  data: CommentType[]
  comment: CommentType
  type?: 'course' | 'lesson'
}

const Comment = ({ data, comment, type = 'course' }: Props) => {
  const { refresh } = useRouter()
  const { user } = useAccountContext()
  const isAuth = !!user?.email
  const isOwner = user?.id === comment.user.id
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [showReplies, setShowReplies] = useState(false)
  const [isReply, setIsReply] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const childrenComments = data.filter((c) => c.parentId === comment.id)
  const handleReply = () => {
    if (!isAuth) {
      toast.error('You need to login to reply')
      return
    }
    setIsReply(true)
    setShowReplies(true)
  }

  const toggleReplies = () => {
    setShowReplies((prevState) => !prevState)
  }
  const handleDeleteComment = async () => {
    try {
      const res =
        type === 'course'
          ? await coursePublicApiRequests.deleteComment(comment.id)
          : await lessonPublicApiRequest.deleteComment(comment.id)
      if (res.status === 200) {
        toast.success('Deleted comment!')
        refresh()
      }
    } catch (error) {}
  }
  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete this comment?
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this comment?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose()
                    handleDeleteComment()
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="mt-4">
        <div className="flex gap-2">
          <div className="relative">
            <Avatar
              src={generateMediaLink(comment.user.avatar ?? '')}
              size="sm"
              className={cn(
                'aspect-square',
                comment.level === 0 ? '' : 'scale-85'
              )}
            />
            {/* <span className="absolute w-[2px] inset-y-0 bg-default-300 -translate-x-2/4 left-2/4"></span> */}
          </div>

          {isEditing ? (
            <ActionComment
              postId={comment.id}
              level={comment.id}
              parentId={comment.parentId ?? null}
              defaultValue={comment.content}
              action="edit"
              type={type}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="w-full">
              <div className="rounded-md bg-default-100 py-2 px-4">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">
                    {displayFullname(
                      comment.user.firstName,
                      comment.user.lastName
                    )}
                  </p>
                  <p className="text-xs">
                    {formatDistanceToNow(new Date(comment.timestamp)) + ' ago.'}
                  </p>
                </div>
                {comment.content}
              </div>
              <div className="text-xs mt-2">
                <div className="flex gap-2 mb-2">
                  <Button
                    size="sm"
                    className="flex gap-1"
                    onClick={handleReply}
                  >
                    <MessagesSquare size={16} />
                    REPPLY
                  </Button>
                  {isOwner && (
                    <Dropdown>
                      <DropdownTrigger>
                        <Button size="sm" className="!w-fit px-2 !min-w-0">
                          <Ellipsis size={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Static Actions">
                        <DropdownItem
                          key="edit"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          onClick={() => onOpen()}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </div>

                {childrenComments.length > 0 && (
                  <div
                    className="cursor-pointer flex gap-1 items-center w-fit"
                    onClick={toggleReplies}
                  >
                    {showReplies ? (
                      <ChevronUp size={14} />
                    ) : (
                      <Reply size={14} className="rotate-180" />
                    )}
                    {`${showReplies ? 'Hide' : 'View'} ${
                      childrenComments.length
                    } reply`}
                  </div>
                )}
              </div>
              {showReplies && (
                <>
                  {childrenComments.map((childComment) => (
                    <Comment
                      key={childComment.id}
                      comment={childComment}
                      data={data}
                      type={type}
                    />
                  ))}
                  {comment.level < 2 && (
                    <div
                    // style={{ marginLeft: (comment.level + 1) * 20 + 'px' }}
                    >
                      <ActionComment
                        postId={
                          type === 'course'
                            ? comment.courseId ?? 0
                            : comment.lessonId ?? 0
                        }
                        level={comment.level + 1}
                        parentId={comment.id}
                        type={type}
                        defaultValue={
                          isReply
                            ? `@${displayFullname(
                                comment.user.firstName,
                                comment.user.lastName
                              )}`
                            : undefined
                        }
                        placeholder={`Reply to @${displayFullname(
                          comment.user.firstName,
                          comment.user.lastName
                        )}...`}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Comment
