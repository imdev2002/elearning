'use client'
import { generateMediaLink } from '@/lib/utils'
import { CourseResType } from '@/schemaValidations/course.schema'
import { courseManagerApiRequests } from '@/services/course.service'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from '@nextui-org/react'
import { Ellipsis } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify'
import slugify from 'slugify'

type CourseType = {
  data: CourseResType
  isAuth?: boolean
}

const CourseCard = ({ data, isAuth = false }: CourseType) => {
  const { push, refresh } = useRouter()
  const slug = slugify(data.courseName, { lower: true })
  const {
    id,
    category,
    courseName,
    currency,
    hearts,
    thumbnail,
    priceAmount,
    status,
  } = data
  const deleteCourse = async () => {
    try {
      const res = await courseManagerApiRequests.delete(id)
      if (res.status === 200) {
        toast.success(`Deleted ${courseName} course successfully!`)
        refresh()
      }
    } catch (error) {
      toast.error(`Could not delete ${courseName} course!`)
    }
  }

  const approveCourse = async () => {
    try {
      const res = await courseManagerApiRequests.approve(id)
      if (res.status === 200) {
        toast.success(`Approved ${courseName} course successfully!`)
        refresh()
      }
    } catch (error) {
      toast.error(`Could not approve ${courseName} course!`)
    }
  }

  return (
    <Card
      className="py-3 border border-foreground/10 rounded-md shadow-none"
      as={Link}
      href={isAuth ? '#' : `/course/${id}`}
      // href={isAuth ? '#' : `/course/${slug}-${id}`}
    >
      <div className="px-3 relative">
        <Image
          alt="Card background"
          className="object-cover rounded-md w-full aspect-video [div:has(>&)]:!max-w-full"
          src={
            thumbnail
              ? generateMediaLink(thumbnail)
              : 'https://www.filepicker.io/api/file/nlMKa4JeSBysXoj7pa90'
          }
          width={0}
        />
        {isAuth && (
          <Chip
            color={status === 'DRAFT' ? 'default' : 'success'}
            variant="solid"
            className="capitalize text-sm absolute top-2 right-5 z-10 rounded-md"
          >
            {status.toLowerCase()}
          </Chip>
        )}
      </div>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <Chip variant="faded" className="capitalize text-xs" size="sm">
          {category.toLowerCase()}
        </Chip>
        <p className="text-tiny uppercase font-bold text-green-500">
          {priceAmount ? `${priceAmount} ${currency}` : 'Free'}
        </p>
        <small className="text-default-500">12 Tracks</small>
        <h4 className="font-bold text-sm lg:text-large line-clamp-1">
          {courseName}
        </h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        {isAuth && (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" className="w-fit !px-0 min-w-[40px]">
                <Ellipsis />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="approve"
                className={status === 'APPROVED' ? 'hidden' : ''}
                onClick={approveCourse}
              >
                Approve
              </DropdownItem>
              <DropdownItem key="view">View</DropdownItem>
              <DropdownItem onClick={() => push(`my-courses/${id}`)} key="edit">
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onClick={deleteCourse}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </CardBody>
    </Card>
  )
}

export default CourseCard
