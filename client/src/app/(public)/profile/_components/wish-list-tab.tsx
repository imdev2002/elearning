'use client'

import CourseCard from '@/components/course/course-card'
import Empty from '@/components/empty'
import { useAccountContext } from '@/contexts/account'
import { cn } from '@/lib/utils'
import { userApiRequest } from '@/services/user.service'
import React, { useEffect, useState } from 'react'

const WishListTab = () => {
  const { coursesHearted, setCoursesHearted } = useAccountContext()
  useEffect(() => {
    ;(async function () {
      try {
        const res = await userApiRequest.getWishList()
        if (res.status === 200)
          setCoursesHearted((res.payload as any)?.courseHearted)
      } catch (error) {}
    })()
  }, [])
  return (
    <div
      className={cn(
        '',
        coursesHearted?.length > 0 ? 'grid grid-cols-4 gap-4' : ''
      )}
    >
      {coursesHearted?.length > 0 ? (
        coursesHearted.map((course: any) => (
          <CourseCard key={course.courseId} data={course.course} />
        ))
      ) : (
        <Empty />
      )}
    </div>
  )
}

export default WishListTab
