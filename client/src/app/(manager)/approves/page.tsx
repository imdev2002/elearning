import ApproveTabs from '@/app/(manager)/approves/_components/approve-tabs'
import { courseManagerApiRequests } from '@/services/course.service'
import { lessonManagerApiRequest } from '@/services/lesson.service'
import { cookies } from 'next/headers'

type Props = {
  searchParams: { [key: string]: string | undefined }
}

const page = async ({ searchParams }: Props) => {
  const { page } = searchParams
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const { payload: courses } = await courseManagerApiRequests.getList(
    accessToken
  )
  const { payload: lessons } = await lessonManagerApiRequest.getList(
    accessToken
  )
  const listCourses: any = (courses as any).courses.filter(
    (course: any) => course.status === 'DRAFT'
  )
  const listLessons: any = (lessons as any).lessons.filter(
    (course: any) => course.status === 'PENDING'
  )
  return (
    <div>
      <ApproveTabs coursesData={listCourses} lessonsData={listLessons} />
    </div>
  )
}

export default page
