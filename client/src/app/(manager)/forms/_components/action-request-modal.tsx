import { SubmitForm } from '@/app/globals'
import { displayFullname, generateMediaLink } from '@/lib/utils'
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
import { EyeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Props = {
  data: SubmitForm
}

const ActionRequestModal = ({ data }: Props) => {
  const { refresh } = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    selfie,
    real_firstName,
    real_lastName,
    frontIdCard,
    backIdCard,
    timestamp,
    category,
    linkCV,
  } = data
  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-screen-md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Course
              </ModalHeader>
              <ModalBody>
                <Image
                  src={generateMediaLink(selfie ?? '')}
                  alt=""
                  width={400}
                  height={400}
                  className="w-96 object-cover"
                />
                <p>{displayFullname(real_firstName, real_lastName)}</p>
                <div className="flex gap-4">
                  <Button>{category}</Button>
                  <Button as={Link} href={linkCV}>
                    Open CV
                  </Button>
                </div>
                <div className="flex justify-between">
                  <Image
                    src={generateMediaLink(frontIdCard ?? '')}
                    alt=""
                    width={400}
                    height={400}
                    className="w-96 object-cover"
                  />
                  <Image
                    src={generateMediaLink(backIdCard ?? '')}
                    alt=""
                    width={400}
                    height={400}
                    className="w-96 object-cover"
                  />
                </div>
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
      <Tooltip content="Details" className="mx-auto">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50 w-fit block"
          onClick={onOpen}
        >
          <EyeIcon />
        </span>
      </Tooltip>
    </>
  )
}

export default ActionRequestModal
