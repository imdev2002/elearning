import CourseHeader from '@/app/(public)/course/_components/course-header'
import FiveStars from '@/components/course/five-stars'
import ListPartsAccordion from '@/components/course/list-parts-accordion'
import CommentSection from '@/components/comment'
import { formatDuration } from '@/lib/utils'
import { coursePublicApiRequests } from '@/services/course.service'
import { Progress } from '@nextui-org/react'
import { CircleCheckBig, Clock, FolderOpen, SquarePlay } from 'lucide-react'
import CourseSidebar from '@/app/(public)/course/_components/course-sidebar'
import ReactionsSection from '@/components/reactions'

type Props = {
  params: {
    courseId: string
  }
}

const page = async ({ params }: Props) => {
  const { courseId } = params
  const { payload: courseData } = await coursePublicApiRequests.get(
    Number(courseId)
  )
  console.log('page  courseData:', courseData)
  const {
    id,
    courseName,
    user,
    knowledgeGained,
    descriptionMD,
    parts,
    rating,
    thumbnail,
    priceAmount,
    comments,
    avgRating,
    totalDuration,
    totalLesson,
    totalPart,
    emojis,
  } = courseData

  return (
    <>
      <CourseHeader data={courseData} />
      <div className=" flex flex-col-reverse lg:flex-row gap-8 justify-between w-full relative mt-4">
        <div className="lg:w-2/3 space-y-8">
          <div>
            <p className="text-2xl font-semibold">Description</p>
            <div
              className="entry-content"
              // Prevent XSS Attack recommen from React Docs
              dangerouslySetInnerHTML={{
                __html: descriptionMD ? descriptionMD : '',
              }}
            ></div>
          </div>
          <div className="p-5 bg-green-200 text-black rounded-md space-y-4">
            <p className="text-2xl font-semibold">
              What you will learn in this course
            </p>
            <ul className="grid lg:grid-cols-2 gap-4">
              {knowledgeGained.map((knowledge, index) => (
                <li key={index} className="flex">
                  <CircleCheckBig
                    className="stroke-green-500 mr-2 flex-shrink-0"
                    strokeWidth={2.5}
                    size={24}
                  />
                  <p>{knowledge}</p>
                </li>
              ))}
            </ul>
          </div>
          {parts && parts.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-semibold">Curriculum</p>
                <div className="flex gap-2 items-center">
                  <span className="flex gap-1 items-center">
                    <FolderOpen size={16} />
                    <p>{totalPart} parts</p>
                  </span>
                  <span className="flex gap-1 items-center">
                    <SquarePlay size={16} />
                    <p>{totalLesson} lectures</p>
                  </span>
                  <span className="flex gap-1 items-center">
                    <Clock size={16} />
                    <p>{formatDuration(totalDuration)}</p>
                  </span>
                </div>
              </div>
              <ListPartsAccordion data={parts} />
            </div>
          )}
          <div className="space-y-4">
            <p className="text-2xl font-semibold">Ratings</p>
            <div className="flex gap-8 w-full">
              <div className="aspect-square p-8 border rounded-md space-y-1 text-center">
                <p className="text-6xl font-bold">{avgRating?.toFixed(1)}</p>
                <FiveStars className="mx-auto" starRated={avgRating} />
                <p className="text-nowrap">Course Rating</p>
              </div>
              <div className="w-full flex flex-col justify-around">
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <FiveStars starRated={index + 1} />
                      <Progress
                        classNames={{
                          indicator: 'bg-yellow-400',
                        }}
                        value={
                          (rating.filter((rate) => rate.star === index + 1)
                            .length /
                            rating.length) *
                          100
                        }
                        className=""
                      />
                      <p>{`(${
                        rating.filter((rate) => rate.star === index + 1).length
                      })`}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <ReactionsSection postId={Number(courseId)} data={emojis} />
          <div className="space-y-4">
            <p className="text-2xl font-semibold">Comments</p>
            <CommentSection data={comments} postId={id} />
          </div>
        </div>
        <CourseSidebar data={courseData} />
      </div>
    </>
  )
}

export default page
