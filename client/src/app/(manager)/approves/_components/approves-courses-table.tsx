'use client'

import CourseForm from '@/app/(manager)/my-courses/_components/course-form'
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

const ApprovesCoursesTable = ({ data }: Props) => {
  return (
    <Table aria-label="Example empty table" className="w-full">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>CATEGORY</TableColumn>
        <TableColumn>REQUEST AT</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody emptyContent={'No pending request'}>
        {data.map((course: any, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center gap-2 w-fit">
                <Image
                  src={
                    course.thumbnail
                      ? generateMediaLink(course.thumbnail)
                      : 'https://www.filepicker.io/api/file/nlMKa4JeSBysXoj7pa90'
                  }
                  alt={course.courseName}
                  width={400}
                  height={400}
                  className="object-cover w-14"
                />
                <span className="line-clamp-2">{course.courseName}</span>
              </div>
            </TableCell>
            <TableCell>{course.category}</TableCell>
            <TableCell>
              {formatDate(new Date(course.timestamp), 'MM/dd/yyyy')}
            </TableCell>
            <TableCell className="">
              <div className="flex gap-2 items-center">
                <CoursePreview data={course} />
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

export default ApprovesCoursesTable

const CoursePreview = ({ data }: { data: any }) => {
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
        className="max-w-screen-md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">Rating course</ModalHeader>
              <ModalBody>
                <CourseForm defaultValues={data} isReadOnly />
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
