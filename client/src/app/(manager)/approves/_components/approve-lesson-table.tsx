'use client'

import CourseForm from '@/app/(manager)/my-courses/_components/course-form'
import TextLessonForm from '@/app/(manager)/my-courses/_components/text-lesson-form'
import VideoLessonForm from '@/app/(manager)/my-courses/_components/video-lesson-form'
import { generateMediaLink } from '@/lib/utils'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'
import { formatDate } from 'date-fns'
import { Check, EyeIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
type Props = {
  data: any
}

const ApprovesLessonsTable = ({ data }: Props) => {
  return (
    <Table aria-label="Example empty table" className="w-full">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>CATEGORY</TableColumn>
        <TableColumn>REQUEST AT</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody emptyContent={'No pending request'}>
        {data.map((lesson: any, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <span className="line-clamp-2">{lesson.lessonName}</span>
            </TableCell>
            <TableCell>{lesson.lessonType}</TableCell>
            <TableCell>
              {formatDate(new Date(lesson.timestamp), 'MM/dd/yyyy')}
            </TableCell>
            <TableCell className="">
              <div className="flex gap-2 items-center">
                <LessonPreview data={lesson} />
                <Tooltip content="Approve">
                  <span
                    className="text-lg text-success-400 cursor-pointer active:opacity-50"
                    onClick={() => null}
                  >
                    <Check />
                  </span>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ApprovesLessonsTable

const LessonPreview = ({ data }: { data: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Tooltip content="Details">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <EyeIcon />
        </span>
      </Tooltip>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-screen-xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">Rating course</ModalHeader>
              <ModalBody>
                <ModalBody>
                  {data.lessonType === 'VIDEO' ? (
                    <VideoLessonForm isReadOnly data={data} />
                  ) : (
                    <TextLessonForm isReadOnly data={data} />
                  )}
                </ModalBody>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
