'use client'

import CourseCard from '@/components/course/course-card'
import Empty from '@/components/empty'
import { useAccountContext } from '@/contexts/account'
import { cn } from '@/lib/utils'
import { userApiRequest } from '@/services/user.service'
import React, { useEffect, useState } from 'react'

const WishListTab = () => {
  const { coursesHearted, setCoursesHearted } = useAccountContext()
  return (
    <div
      className={cn(
        '',
        coursesHearted?.courseHearted?.length > 0
          ? 'grid grid-cols-4 gap-4'
          : ''
      )}
    >
      {coursesHearted?.courseHearted?.length > 0 ? (
        coursesHearted?.courseHearted?.length.map((course: any) => (
          <CourseCard key={course.courseId} data={course.course} />
        ))
      ) : (
        <Empty />
      )}
    </div>
  )
}

export default WishListTab
