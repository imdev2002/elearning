'use client'

import PartCourseForm from '@/app/(manager)/my-courses/_components/part-course-form'
import { Course, Lesson, Part } from '@/app/globals'
import { cn, formatDuration, formatVideoDuration } from '@/lib/utils'
import {
  Accordion,
  AccordionItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import {
  Clock,
  Eye,
  File,
  FileVideo,
  Lock,
  Pencil,
  Play,
  SquarePlay,
  Video,
} from 'lucide-react'
import { useState } from 'react'

type Props = {
  data: Part[]
  isAuth?: boolean
}

const ListPartsAccordion = ({ data, isAuth = false }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [partData, setPartData] = useState()
  const [action, setAction] = useState<'create' | 'edit'>('create')
  return (
    <>
      {isAuth && (
        <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {`${action === 'edit' ? 'Edit' : 'Create'} Part number`}
                </ModalHeader>
                <ModalBody>
                  {action === 'edit' ? (
                    <PartCourseForm data={partData} />
                  ) : (
                    <PartCourseForm />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Save
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      <Accordion variant="shadow">
        {data.map((part: any, index: number) => (
          <AccordionItem
            classNames={{
              heading: '[&>button]:py-2',
            }}
            key={part.id}
            aria-label={part.partName}
            title={<HeadingPart part={part} />}
            startContent={
              isAuth ? (
                <Button
                  className="!min-w-[40px] px-0"
                  variant="flat"
                  color="secondary"
                  onClick={() => {
                    setPartData(part)
                    setAction('edit')
                    onOpen()
                  }}
                >
                  <Pencil />
                </Button>
              ) : null
            }
          >
            {part.lessons.map((lesson: Lesson, index: number) => (
              <div key={lesson.id} className="flex justify-between">
                <div className="flex gap-2 items-center group">
                  {lesson.lessonType === 'VIDEO' ? (
                    <Play size={14} />
                  ) : (
                    <File size={14} />
                  )}
                  {lesson.lessonName}
                  {isAuth ? null : (
                    <span
                      className={cn(
                        'opacity-0 transition-all group-hover:opacity-100',
                        lesson.trialAllowed ? 'cursor-pointer' : ''
                      )}
                    >
                      {lesson.trialAllowed ? (
                        <Eye size={16} />
                      ) : (
                        <Lock size={16} />
                      )}
                    </span>
                  )}
                </div>
                <span className="text-slate-400">
                  {lesson.lessonType === 'VIDEO'
                    ? formatVideoDuration(lesson.duration)
                    : '5.3 MB'}
                </span>
              </div>
            ))}
          </AccordionItem>
        ))}
      </Accordion>
      {isAuth && (
        <Button
          className="w-full"
          color="primary"
          onClick={() => {
            setAction('create')
            onOpen()
          }}
        >
          Add Part Number
        </Button>
      )}
    </>
  )
}

export default ListPartsAccordion

const HeadingPart = ({ part }: { part: Part }) => {
  const totalDuration = part.lessons.reduce((acc = 0, lesson) => {
    return acc + lesson.duration
  }, 0)
  return (
    <div className="flex justify-between items-center">
      {part.partName}
      <ul className="flex gap-2 text-sm">
        <li className="flex items-center gap-1">
          <SquarePlay size={16} />
          {part.lessons.length + ' lectures'}
        </li>
        <li className="flex items-center gap-1">
          <Clock size={16} />
          {formatDuration(totalDuration)}
        </li>
      </ul>
    </div>
  )
}
