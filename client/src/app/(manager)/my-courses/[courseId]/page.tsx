'use client'

import { HeaderManager } from '@/app/(manager)/layout'
import CourseForm from '@/app/(manager)/my-courses/_components/course-form'
import LessonForm from '@/app/(manager)/my-courses/_components/lesson-form'
import PartCourseForm from '@/app/(manager)/my-courses/_components/part-course-form'
import { Chip, Tab, Tabs } from '@nextui-org/react'
import { File, FilePen, ListOrdered, Presentation } from 'lucide-react'
import React from 'react'

const EditCoursePage = () => {
  return (
    <>
      <HeaderManager icon={<FilePen />} title="Edit course" />
      <div className="flex w-full flex-col p-5">
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
            <CourseForm />
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
            <PartCourseForm />
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
      </div>
    </>
  )
}

export default EditCoursePage
