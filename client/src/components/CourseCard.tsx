'use client'
import { CourseResType } from '@/schemaValidations/course.schema'
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
import React from 'react'

type CourseType = {
  data: CourseResType
  isAuth: boolean
}

const CourseCard = ({ data, isAuth = true }: CourseType) => {
  const { category, courseName, currency, hearts, thumbnail, priceAmount } =
    data
  return (
    <Card className="py-4 border border-foreground/10">
      <div>
        <Image
          alt="Card background"
          className="object-cover !rounded-xl w-full px-3"
          src={
            thumbnail ||
            'https://www.filepicker.io/api/file/nlMKa4JeSBysXoj7pa90'
          }
          width={0}
        />
      </div>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <Chip variant="faded" className="capitalize text-xs">
          {category.toLowerCase()}
        </Chip>
        <p className="text-tiny uppercase font-bold text-green-500">
          {priceAmount ? `${priceAmount} ${currency}` : 'Free'}
        </p>
        <small className="text-default-500">12 Tracks</small>
        <h4 className="font-bold text-large">{courseName}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="flat" className="w-fit !px-0 min-w-[40px]">
              <Ellipsis />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="copy">Xem</DropdownItem>
            <DropdownItem key="new">Chỉnh sửa</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
              Xoá
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardBody>
    </Card>
  )
}

export default CourseCard
