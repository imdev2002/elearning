import { courseManagerApiRequests } from '@/services/course.service'
import CourseCard from '@/components/course/course-card'
import { cookies } from 'next/headers'
import CreateCourseModal from '@/app/(manager)/my-courses/_components/create-course-modal'
import { Heading } from '@/components/heading'
import { ViewIcon } from '@/components/icons/sidebar/view-icon'
import MyCoursePagination from '@/app/(manager)/my-courses/_components/my-course-pagination'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

const MyCoursePage = async ({ searchParams }: Props) => {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const { payload } = await courseManagerApiRequests.getList(accessToken)
  const listCourses: any = payload
  const { page = 1 } = searchParams
  return (
    <>
      <Heading icon={<ViewIcon />} title="My Courses" />
      <div className="p-5 grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
        <CreateCourseModal />
        {listCourses.map((course: any, index: number) => (
          <CourseCard isAuth key={index} data={course} />
        ))}
      </div>
      <MyCoursePagination />
    </>
  )
}

export default MyCoursePage
