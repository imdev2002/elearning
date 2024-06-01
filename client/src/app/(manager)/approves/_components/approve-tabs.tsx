'use client'

import ApprovesLessonsTable from '@/app/(manager)/approves/_components/approve-lesson-table'
import ApprovesCoursesTable from '@/app/(manager)/approves/_components/approves-courses-table'
import { Tab, Tabs } from '@nextui-org/react'
import React from 'react'

type Props = {
  coursesData?: any
  lessonsData?: any
}
const ApproveTabs = ({ coursesData, lessonsData }: Props) => {
  return (
    <Tabs
      aria-label="Options"
      classNames={{
        base: 'w-full mt-4',
        tabList: 'w-full max-w-full',
      }}
      color="primary"
    >
      <Tab key="courses" title="Courses">
        <ApprovesCoursesTable data={coursesData} />
      </Tab>
      <Tab key="lessons" title="Lectures">
        <ApprovesLessonsTable data={lessonsData} />
      </Tab>
    </Tabs>
  )
}

export default ApproveTabs
