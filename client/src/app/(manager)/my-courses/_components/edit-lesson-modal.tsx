import TextLessonForm from '@/app/(manager)/my-courses/_components/text-lesson-form'
import VideoLessonForm from '@/app/(manager)/my-courses/_components/video-lesson-form'
import { convertObjectToFormData } from '@/lib/utils'
import { lessonManagerApiRequest } from '@/services/lesson.service'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'
import { Pencil } from 'lucide-react'
import React from 'react'
import { toast } from 'react-toastify'

type Props = {
  data?: any
}

const EditLessonModal = ({ data }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const editLesson = async (body: any) => {
    const formData = convertObjectToFormData(
      data.lessonType === 'VIDEO'
        ? {
            lessonType: data.lessonType,
            lessonNumber: data.lessonNumber,
            partId: data.partId,
            ...body,
          }
        : {}
    )
    try {
      const res = await lessonManagerApiRequest.update(data.id, formData)
      if (res.status === 200) {
        toast.success('Lesson updated successfully')
        onClose()
      }
    } catch (error) {}
  }
  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-screen-xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit {data.lessonName}
              </ModalHeader>
              <ModalBody>
                {data.lessonType === 'VIDEO' ? (
                  <VideoLessonForm data={data} onSubmit={editLesson} />
                ) : (
                  <TextLessonForm data={data} onSubmit={editLesson} />
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Tooltip content="Edit">
        <span className="cursor-pointer" onClick={onOpen}>
          <Pencil size={14} />
        </span>
      </Tooltip>
    </>
  )
}

export default EditLessonModal
