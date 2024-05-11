'use client'

import CourseForm from '@/app/(manager)/my-courses/_components/course-form'
import LessonForm from '@/app/(manager)/my-courses/_components/lesson-form'
import PartCourseForm from '@/app/(manager)/my-courses/_components/part-course-form'
import { Course, Part } from '@/app/globals'
import ListPartsAccordion from '@/components/course/list-parts-accordion'
import { CourseResType } from '@/schemaValidations/course.schema'
import { Button, Chip, Tab, Tabs } from '@nextui-org/react'
import { File, ListOrdered, Presentation } from 'lucide-react'
import React from 'react'
type Props = {
  courseData: Course
}

const CreateTabs = ({ courseData }: Props) => {
  return (
    <Tabs
      aria-label="Options"
      color="primary"
      variant="underlined"
      classNames={{
        tabList:
          'gap-6 w-full relative rounded-none p-0 border-b border-divider',
        cursor: 'w-full',
        tab: 'max-w-fit px-0 h-12',
        tabContent: '',
      }}
    >
      <Tab
        key="photos"
        title={
          <div className="flex items-center space-x-2">
            <File />
            <span>Course ifomation</span>
            <Chip size="sm" variant="faded">
              9
            </Chip>
          </div>
        }
      >
        <CourseForm defaultValues={courseData} />
      </Tab>
      <Tab
        key="music"
        title={
          <div className="flex items-center space-x-2">
            <ListOrdered />
            <span>Course Parts</span>
            <Chip size="sm" variant="faded">
              3
            </Chip>
          </div>
        }
      >
        <ListPartsAccordion isAuth data={courseData.parts} />
      </Tab>
      <Tab
        key="videos"
        title={
          <div className="flex items-center space-x-2">
            <Presentation />
            <span>Lesson</span>
          </div>
        }
      >
        <LessonForm />
      </Tab>
    </Tabs>
  )
}

export default CreateTabs
