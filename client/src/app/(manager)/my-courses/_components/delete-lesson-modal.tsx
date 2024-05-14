import { lessonManagerApiRequest } from '@/services/lesson.service'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify'

type Props = {
  lessonId: number
}

const DeleteLessonModal = ({ lessonId }: Props) => {
  const { refresh } = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleDeleteLesson = async () => {
    try {
      const res = await lessonManagerApiRequest.delete(lessonId)
      if (res.status === 200) {
        toast.success('Lesson deleted successfully')
        refresh()
      }
      onClose()
    } catch (error) {
      toast.error('Error deleting lesson')
    }
  }
  return (
    <>
      <>
        <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Delete
                </ModalHeader>
                <ModalBody>Delete this lesson?</ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleDeleteLesson}>
                    OK
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Tooltip content="Delete">
          <span
            className="text-lg text-danger-200 cursor-pointer active:opacity-50"
            onClick={onOpen}
          >
            <Trash2 size={14} />
          </span>
        </Tooltip>
      </>
    </>
  )
}

export default DeleteLessonModal
