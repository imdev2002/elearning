import { courseManagerApiRequests } from '@/services/course.service'
import CourseCard from '@/components/course/course-card'
import { GraduationCap } from 'lucide-react'
import { cookies } from 'next/headers'
import CreateCourseModal from '@/app/(manager)/my-courses/_components/create-course-modal'
import { Heading } from '@/components/heading'
import { ViewIcon } from '@/components/icons/sidebar/view-icon'

const MyCoursePage = async () => {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const { payload } = await courseManagerApiRequests.getList(accessToken)
  const listCourses: any = payload
  return (
    <>
      <Heading icon={<ViewIcon />} title="My Courses" />
      <div className="p-5 grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
        <CreateCourseModal />
        {listCourses.map((course: any, index: number) => (
          <CourseCard isAuth key={index} data={course} />
        ))}
      </div>
    </>
  )
}

export default MyCoursePage
