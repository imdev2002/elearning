import { courseManagerApiRequests } from '@/services/course.service'
import CourseCard from '@/components/course/course-card'
import { cookies } from 'next/headers'
import CreateCourseModal from '@/app/(manager)/my-courses/_components/create-course-modal'
import { Heading } from '@/components/heading'
import { ViewIcon } from '@/components/icons/sidebar/view-icon'
import MyCoursePagination from '@/app/(manager)/my-courses/_components/my-course-pagination'
import DKEPagination from '@/components/pagination'

type Props = {
  searchParams?: { [key: string]: string | undefined }
}

const MyCoursePage = async ({ searchParams }: Props) => {
  const { page } = searchParams as { page: string }
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const { payload } = await courseManagerApiRequests.getList(
    accessToken,
    page
      ? `limit=${parseInt(page) > 1 ? 8 : 7}&offset=${
          parseInt(page) > 2
            ? (parseInt(page) - 2) * 8 + 7
            : parseInt(page) === 1
            ? 0
            : 7
        }`
      : 'limit=7&offset=0'
  )
  const listCourses: any = payload
  return (
    <>
      <Heading icon={<ViewIcon />} title="My Courses" />
      <div className="p-5 grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
        {(parseInt(page as string) < 2 || !page) && <CreateCourseModal />}
        {listCourses.courses.map((course: any, index: number) => (
          <CourseCard isAuth key={index} data={course} />
        ))}
      </div>
      <DKEPagination totalItems={listCourses.total} itemsPerPage={8} />
    </>
  )
}

export default MyCoursePage
