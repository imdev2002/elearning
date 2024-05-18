'use client'

import { User } from '@/app/globals'
import CourseCard from '@/components/course/course-card'
import Empty from '@/components/empty'
import { useAccountContext } from '@/contexts/account'
import { cn } from '@/lib/utils'
import { coursePublicApiRequests } from '@/services/course.service'
import { userApiRequest } from '@/services/user.service'
import React, { useEffect, useState } from 'react'

type Props = {
  profile: User
}

const CoursesTab = ({ profile }: Props) => {
  const [courses, setCourses] = useState<any>([])
  const { user } = useAccountContext()
  const isMe = user?.email === profile.email
  const isInstructor = profile.roles.some((role) => role.role.name === 'AUTHOR')
  const [coursesByAuthor, setCoursesByAuthor] = React.useState<any>([])
  useEffect(() => {
    const fetchCoursesOwn = async () => {
      try {
        const res = await coursePublicApiRequests.getList(
          `?byAuthor=${profile.id}&myOwn=${isMe}`
        )
        if (res.status === 200) setCourses(res.payload)
      } catch (error) {}
    }
    async function fetchCoursesBought() {
      try {
        const res = await userApiRequest.getCourseBought()
        if (res.status === 200) {
          const result = (res.payload as any).map((item: any) => item.course)
          setCourses(result)
        }
      } catch (error) {}
    }
    if (isInstructor) fetchCoursesOwn()
    else fetchCoursesBought()
  }, [])
  // useEffect(() => {
  //   ;(async function () {
  //     try {
  //       const res = await userApiRequest.getCourseBought()
  //       if (res.status === 200) setCourses(res.payload)
  //     } catch (error) {}
  //   })()
  // }, [])
  return (
    <div className={cn('', courses.length > 0 ? 'grid grid-cols-4 gap-4' : '')}>
      {courses.length > 0 ? (
        courses.map((course: any) => (
          <CourseCard key={course.id} data={course} />
        ))
      ) : (
        <Empty />
      )}
    </div>
  )
}

export default CoursesTab
