import CreateTabs from '@/app/(manager)/my-courses/_components/create-tabs'
import { Heading } from '@/components/heading'
import { courseManagerApiRequests } from '@/services/course.service'
import { FilePen } from 'lucide-react'
import { cookies } from 'next/headers'
import React from 'react'

type Props = {
  params: { courseId: string }
}

const EditCoursePage = async ({ params }: Props) => {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const { payload: courseData } = await courseManagerApiRequests.get(
    Number(params.courseId),
    accessToken ?? ''
  )
  // const {payload} = await courseManagerApiRequests.get
  return (
    <>
      <Heading icon={<FilePen />} title="Edit course" />
      <div className="flex w-full flex-col p-5">
        <CreateTabs courseData={courseData} />
      </div>
    </>
  )
}

export default EditCoursePage
