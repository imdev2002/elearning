'use client'

import CourseCard from '@/components/course/course-card'
import { cn } from '@/lib/utils'
import { userApiRequest } from '@/services/user.service'
import React, { useEffect, useState } from 'react'

const WishListTab = () => {
  const [courses, setCourses] = useState<any>([])
  useEffect(() => {
    ;(async function () {
      try {
        const res = await userApiRequest.getWishList()
        if (res.status === 200) setCourses((res.payload as any).courseHearted)
      } catch (error) {}
    })()
  }, [])
  return (
    <div className={cn('', courses.length > 0 ? 'grid grid-cols-4 gap-4' : '')}>
      {courses.length > 0
        ? courses.map((course: any) => (
            <CourseCard key={course.courseId} data={course.course} />
          ))
        : 'Empty hihi'}
    </div>
  )
}

export default WishListTab
