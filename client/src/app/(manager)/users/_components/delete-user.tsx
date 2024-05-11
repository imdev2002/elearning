import { Trash2 } from 'lucide-react'
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
import { userApiRequest } from '@/services/user.service'
import { AccountResType } from '@/schemaValidations/account.schema'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { User } from '@/app/globals'

type Props = {
  user: User
}

const DeleteUser = ({ user }: Props) => {
  const { refresh } = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const fullname = user.firstName
    ? `${user.firstName}`
    : '' + user.lastName
    ? ` ${user.lastName}`
    : ''
  const deleteUser = async () => {
    try {
      const res = await userApiRequest.delete(user.id)
      if (res.status === 200) {
        toast.success(`Deleted ${fullname}!`)
        refresh()
      }
    } catch (error) {
      toast.error(`Could not delete ${fullname}`)
    }
  }
  return (
    <>
      <Tooltip color="danger" content="Delete user">
        <span
          className="text-lg text-danger cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <Trash2 />
        </span>
      </Tooltip>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete user
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
                    deleteUser()
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

export default DeleteUser
