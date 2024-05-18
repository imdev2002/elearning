'use client'

import { Course } from '@/app/globals'
import { useAccountContext } from '@/contexts/account'
import { generateMediaLink } from '@/lib/utils'
import { coursePublicApiRequests } from '@/services/course.service'
import { Button, Divider } from '@nextui-org/react'
import { FileBadge } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

type Props = {
  data: Course
}

const CourseSidebar = ({ data }: Props) => {
  const { refresh } = useRouter()
  const { thumbnail, courseName, priceAmount, id, parts } = data
  const { user } = useAccountContext()
  const isAuth = !!user?.email
  // const isHearted =
  const isBought = data.coursedPaid.some(
    (item) => item.userId === user?.id && item.status === 'SUCCESS'
  )
  const heartCourseToggle = async () => {
    try {
      if (!isAuth) {
        toast.error('You need to login to heart course')
        return
      }
      const res = await coursePublicApiRequests.toogleHeart(id)
      if (res.status === 200) {
        refresh()
      }
    } catch (error) {}
  }
  const buyCourseHandler = async () => {
    try {
      if (!isAuth) {
        toast.error('You need to login to buy course')
        return
      }
      const res = await coursePublicApiRequests.buy(id)
      if (res.status === 200) {
        if ((res.payload as { url: string }).url) {
          window.location.href = (res.payload as { url: string }).url
        } else {
          toast.success('Buy course successfully')
          refresh()
        }
      }
    } catch (error) {}
  }

  return (
    <div className="flex-1 p-3 lg:-mt-28 ml-4 border rounded-lg bg-background h-fit space-y-2">
      <Image
        src={generateMediaLink(thumbnail)}
        alt={courseName}
        width={0}
        height={0}
        sizes="1000px"
        className="w-full object-cover rounded-md"
      />
      <p className="text-xl">{'$' + priceAmount}</p>
      <Button
        className="w-full"
        color="secondary"
        variant="bordered"
        onClick={heartCourseToggle}
      >
        Add to favourite list
      </Button>
      {isBought ? (
        <Button
          as={Link}
          href={
            parts && parts.length > 0
              ? `/learning/${id}?lesson=${parts[0].lessons[0].id}`
              : '#'
          }
          className="w-full"
          color="primary"
          onClick={buyCourseHandler}
        >
          Study now
        </Button>
      ) : (
        <Button className="w-full" color="primary" onClick={buyCourseHandler}>
          Buy now
        </Button>
      )}
      <Divider className="my-2" />
      <ul>
        <li className="flex gap-1">
          <FileBadge size={18} />
          <p className="text-sm">42 lessons</p>
        </li>
      </ul>
    </div>
  )
}

export default CourseSidebar
