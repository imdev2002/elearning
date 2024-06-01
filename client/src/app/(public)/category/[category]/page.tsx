import CourseCard from '@/components/course/course-card'
import SearchCourse from '@/components/search/search-course'
import { CATEGORIES } from '@/lib/constants'
import { coursePublicApiRequests } from '@/services/course.service'

type Props = {
  params: {
    category: string
  }
}

const CoursesByCategory = async ({ params }: Props) => {
  const { category } = params
  const categoryParam = category.replace(/-/g, '_').toUpperCase()
  const { payload } = await coursePublicApiRequests.getList(
    `?categories=${categoryParam}`
  )
  const header = CATEGORIES.find((c) => c.path.includes(category))
  return (
    <div>
      <div className="w-96 mx-auto mb-8">
        <div className="flex items-center gap-4 justify-center">
          <span className="[&>svg]:w-14 [&>svg]:h-14 [&>svg]:mx-auto">
            {header?.icon}
          </span>
          <h2 className="text-4xl font-semibold text-center">{header?.name}</h2>
        </div>
        <p className="text-center">{header?.description}</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {payload.courses.map((course: any) => (
          <CourseCard key={course.id} data={course} />
        ))}
      </div>
    </div>
  )
}

export default CoursesByCategory
