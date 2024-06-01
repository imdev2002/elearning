import Filter from '@/app/(public)/search/_components/filter'
import { coursePublicApiRequests } from '@/services/course.service'

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const page = async ({ searchParams }: Props) => {
  const { categories, keyword } = searchParams
  const { payload } = await coursePublicApiRequests.getList(
    `?search=${keyword}&categories=${categories ?? ''}`
  )
  return (
    <div>
      <Filter data={payload.courses} />
    </div>
  )
}

export default page
