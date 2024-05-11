'use client'

import { EmojiResType } from '@/schemaValidations/emoji.schema'
import { emojiApiRequest } from '@/services/emoji.service'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify'

type Props = {
  emoji: EmojiResType
}

const DeleteEmoji = ({ emoji }: Props) => {
  const { refresh } = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const deleteEmoji = async () => {
    try {
      const res = await emojiApiRequest.delete(Number(emoji.id))
      if (res.status === 200) {
        toast.success(`Deleted ${emoji.name} emoji!`)
        refresh()
      }
    } catch (error) {
      toast.error(`Could not delete ${emoji.name} emoji`)
    }
  }
  return (
    <>
      <span
        className="absolute top-2 right-2 p-1 cursor-pointer opacity-0 group-hover:opacity-100 bg-red-400 rounded-md"
        onClick={onOpen}
      >
        <Trash2 />
      </span>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete emoji
              </ModalHeader>
              <ModalBody>
                <p>Are you sure?.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose()
                    deleteEmoji()
                  }}
                >
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

export default DeleteEmoji
