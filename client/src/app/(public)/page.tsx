import CourseCard from '@/components/course/course-card'
import ListCardSlider from '@/components/course/list-card-slider'
import { Heading } from '@/components/heading'
import {
  courseManagerApiRequests,
  coursePublicApiRequests,
} from '@/services/course.service'
import { Button, cn } from '@nextui-org/react'
import { ArrowUpRight } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const cookieStore = cookies()
  const token = cookieStore.get('accessToken')?.value
  const { payload: listCourses } = await coursePublicApiRequests.getList()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between mt-[120px] space-y-8">
      <div className="flex justify-between mb-20">
        <div className="flex flex-col w-1/3 gap-y-8">
          <h3 className="font-bold text-4xl leading-10">
            Learn a New Skill Everyday, Anytime, and Anywhere.
          </h3>
          <p>
            <b>1000+</b> Courses covering all tech domains for you to learn and
            explore new oppurtunities. Learn from Industry Experts and land your
            Dream Job.
          </p>
          <div className="flex gap-8 justify-around">
            <Button
              size="lg"
              color="primary"
              variant="solid"
              className="rounded-full px-10 text-lg"
              as={Link}
              href="/login"
            >
              Start Trial
            </Button>
            <Button
              size="lg"
              color="primary"
              variant="bordered"
              className="rounded-full px-10 text-lg"
            >
              How it Works
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <h3 className="w-full text-4xl font-semibold text-yellow-400 text-center">
                100+
              </h3>
              <p className="w-full font-semibold text-center">
                Courses to choose from
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="w-full text-4xl font-semibold text-blue-500 text-center">
                500+
              </h3>
              <p className="w-full font-semibold text-center">
                Students Trained
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <h3 className="w-full text-4xl font-semibold text-orange-500">
                200+
              </h3>
              <p className="w-full font-semibold text-center">
                Professional Trainers
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/3">
          <div className="flex justify-center items-center relative">
            <Image
              src="/images/rocket.png"
              alt=""
              width={0}
              height={0}
              sizes="100%"
              className="absolute w-80 object-cover -top-[30%] -left-[30%] animate-floating-y-slow"
            />
            <Image
              src="/images/model.png"
              alt=""
              width={0}
              height={0}
              sizes="100%"
              className="w-96 object-cover"
            />
            <Image
              src="/images/cup.png"
              alt=""
              width={0}
              height={0}
              sizes="100%"
              className="absolute w-60 object-cover -bottom-[30%] -right-[10%] animate-floating-x-slow"
            />
            <RectangleRounded
              withBorder={false}
              className="bottom-0 left-0 animate-floating-y-slow"
            />
            <RectangleRounded
              size={32}
              color="bg-[#F0C932]"
              withBorder={false}
              className="-top-[10%] left-[40%] animate-floating-x-slow"
            />
            <RectangleRounded
              size={64}
              color="bg-[#7253A4]"
              className="top-[10%] right-[10%] animate-floating-y-slow"
            />
            <RectangleRounded
              size={92}
              color="bg-orange-500"
              className="-bottom-[30%] left-[30%] animate-floating-x-slow"
            />
          </div>
        </div>
      </div>
      <div className="w-full space-y-4">
        <Heading title="Best selling courses" />
        <ListCardSlider data={listCourses.courses} />
      </div>
      <div className="space-y-4">
        <Heading title="Recent courses" />
        <div className="grid grid-cols-4 gap-4">
          {listCourses.courses.map((course, index) => (
            <CourseCard key={index} data={course} />
          ))}
        </div>
      </div>
      {/* <div className="w-full">
        <h3>Most Popular Category</h3>
        <p>
          Various versions have evolved over the years, sometimes by accident,
        </p>
        <div className="grid grid-cols-4 gap-y-4 gap-x-8 w-full">
          <Category icon={<PenNibIcon />} name="Design" href="/design" />
          <Category icon={<PenNibIcon />} name="Design" href="/design" />
          <Category icon={<PenNibIcon />} name="Design" href="/design" />
          <Category icon={<PenNibIcon />} name="Design" href="/design" />
          <Category icon={<PenNibIcon />} name="Design" href="/design" />
          <Category icon={<PenNibIcon />} name="Design" href="/design" />
          <Category icon={<PenNibIcon />} name="Design" href="/design" />
          <Category icon={<PenNibIcon />} name="Design" href="/design" />
        </div>
      </div> */}
    </main>
  )
}

type RectangleRoundedProps = {
  color?: string
  size?: string | number
  className?: string
  withBorder?: boolean
}

const RectangleRounded = ({
  color = 'bg-blue-500',
  size = 40,
  className,
  withBorder = true,
}: RectangleRoundedProps) => {
  return (
    <div
      className={cn('absolute', className)}
      style={{ width: size, height: size }}
    >
      <div
        className={`${color} rounded-[67%_33%_71%_29%_/_31%_68%_32%_69%] relative w-full h-full`}
      >
        {withBorder && (
          <span className="absolute w-full h-full border dark:border-white border-black -top-[10%] -right-[10%] rounded-[67%_33%_71%_29%_/_31%_68%_32%_69%]"></span>
        )}
      </div>
    </div>
  )
}

type CategoryProps = {
  icon: JSX.Element
  name: string
  href: string
}

const Category = ({ icon, name, href }: CategoryProps) => {
  return (
    <Link
      href={href}
      className="flex justify-between px-4 py-2 group border-2 items-center rounded-md cursor-pointer gap-x-4"
    >
      <div className="flex gap-2 items-center">
        {icon}
        {name}
      </div>
      <ArrowUpRight
        size={18}
        className="ml-auto opacity-0 group-hover:opacity-100 transition-all"
      />
    </Link>
  )
}
