'use client'

import EmojiForm from '@/app/(manager)/emojis/_components/emoji-form'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const CreateEmojiModal = () => {
  const { refresh } = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <div
        className="h-full w-full flex items-center justify-center border border-dashed rounded-lg cursor-pointer"
        onClick={onOpen}
      >
        <PlusCircle size={32} />
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Course
              </ModalHeader>
              <ModalBody>
                <EmojiForm closeModal={onClose} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateEmojiModal
