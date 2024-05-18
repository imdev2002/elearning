'use client'

import CreateLessonModal from '@/app/(manager)/my-courses/_components/create-lesson-modal'
import DeleteLessonModal from '@/app/(manager)/my-courses/_components/delete-lesson-modal'
import EditLessonModal from '@/app/(manager)/my-courses/_components/edit-lesson-modal'
import PartCourseForm from '@/app/(manager)/my-courses/_components/part-course-form'
import { Course, Lesson, Part } from '@/app/globals'
import { cn, formatDuration, formatVideoDuration } from '@/lib/utils'
import { courseManagerApiRequests } from '@/services/course.service'
import { userApiRequest } from '@/services/user.service'
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
  Pause,
  Pencil,
  Play,
  PlusCircle,
  SquarePlay,
  Video,
} from 'lucide-react'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type Props = {
  data: Part[]
  isAuth?: boolean
}

const ListPartsAccordion = ({ data, isAuth = false }: Props) => {
  const { push, refresh } = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [listLessonFinished, setListLessonFinished] = useState([])
  const [partData, setPartData] = useState()
  const [action, setAction] = useState<'create' | 'edit'>('create')
  const searchParams = useSearchParams()
  const lessonId = searchParams.get('lesson')
  const { courseId } = useParams()
  console.log('ListPartsAccordion  pathname:', courseId)
  let currentPartId = 1
  data.forEach((part) => {
    const lesson = part.lessons.find((lesson) => lesson.id === Number(lessonId))
    if (lesson) {
      currentPartId = part.id
    }
  })
  const createPartNumber = async (values: any) => {
    try {
      const res = await courseManagerApiRequests.ceateParts(
        Number(courseId),
        values
      )
      if (res.status === 200) {
        toast.success('Part number created successfully')
        onClose()
        refresh()
      }
    } catch (error) {}
  }
  const editPartNumber = async (values: any) => {
    try {
      const res = await courseManagerApiRequests.updatePart(
        Number(courseId),
        Number((partData as any).id),
        values
      )
      if (res.status === 200) {
        toast.success('Part number updated successfully')
        onClose()
        refresh()
      }
    } catch (error) {}
  }
  // useEffect(() => {
  //   ;(async function fetchProgress() {
  //     try {
  //       const res = await userApiRequest.getCourseProgress()
  //       if (res.status === 200 && lessonId) {
  //         const course = (res.payload as any[]).find(
  //           (course: any) => course.id === data.id
  //         )
  //         const lisLessonFinished = course.lessons.map(
  //           (item: any) => item.lesson.lessonNumber
  //         )
  //         const isFinished = lisLessonFinished.includes(parseInt(lessonId))
  //         setCanNext(isFinished)
  //         setCanPrev(isFinished)
  //       }
  //     } catch (error) {}
  //   })()
  // }, [lessonId])
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
                    <PartCourseForm data={partData} onSubmit={editPartNumber} />
                  ) : (
                    <PartCourseForm onSubmit={createPartNumber} />
                  )}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      <Accordion
        variant="bordered"
        selectionMode="multiple"
        defaultExpandedKeys={[currentPartId.toString()]}
      >
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
              <div
                key={lesson.id}
                className={cn(
                  'flex justify-between px-4 py-1 rounded-sm',
                  Number(lessonId) === lesson.id && 'bg-default-300'
                )}
                onClick={() => {
                  if (lessonId) push(`?lesson=${lesson.id}`)
                }}
              >
                <div className="flex gap-2 items-center group">
                  {lesson.lessonType === 'VIDEO' ? (
                    Number(lessonId) === lesson.id ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} />
                    )
                  ) : (
                    <File size={14} />
                  )}
                  {lesson.lessonName}
                  {!lessonId &&
                    (isAuth ? (
                      <div className="flex items-center gap-2">
                        <EditLessonModal data={lesson} />
                        <DeleteLessonModal lessonId={lesson.id} />
                      </div>
                    ) : (
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
                    ))}
                </div>
                <span className="text-slate-400">
                  {lesson.lessonType === 'VIDEO'
                    ? formatVideoDuration(lesson.duration)
                    : '5.3 MB'}
                </span>
              </div>
            ))}
            {isAuth && <CreateLessonModal data={part} />}
          </AccordionItem>
        ))}
      </Accordion>
      {isAuth && (
        <Button
          className="w-full flex items-center gap-x-2 mt-4"
          color="primary"
          onClick={() => {
            setAction('create')
            onOpen()
          }}
        >
          <PlusCircle />
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
