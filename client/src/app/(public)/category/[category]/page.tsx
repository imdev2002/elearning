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
  const { payload: courses } = await coursePublicApiRequests.getList(
    `?categories=${categoryParam}`
  )
  const header = CATEGORIES.find((c) => c.path.includes(category))
  return (
    <div>
      <div className="w-96 mx-auto">
        <span className="[&>svg]:w-24 [&>svg]:h-24 [&>svg]:mx-auto">
          {header?.icon}
        </span>
        <h2 className="text-4xl font-semibold text-center">{header?.name}</h2>
        <p className="text-center">{header?.description}</p>
        <SearchCourse />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {courses.map((course: any) => (
          <CourseCard key={course.id} data={course} />
        ))}
      </div>
    </div>
  )
}

export default CoursesByCategory
