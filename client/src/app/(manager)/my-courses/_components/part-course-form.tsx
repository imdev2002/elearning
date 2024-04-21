'use client'

import {
  CoursePartsBody,
  CoursePartsBodyType,
} from '@/schemaValidations/course.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { Check, Pencil, Trash2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'

const PartCourseForm = () => {
  const form = useForm<CoursePartsBodyType>({
    resolver: zodResolver(CoursePartsBody),
    defaultValues: {
      partNumber: 0,
      partName: '',
    },
  })
  return (
    <form className="flex gap-8 items-center bg-neutral-700/30 p-4 rounded-xl">
      <div className="flex gap-4 w-[90%]">
        <Controller
          name="partNumber"
          control={form.control}
          render={({ field }) => (
            <Input
              isRequired
              className="w-1/3"
              label="Part number"
              variant="bordered"
              // labelPlacement="outside"
              placeholder="Enter your course name"
              {...field}
            />
          )}
        />
        <Controller
          name="partName"
          control={form.control}
          render={({ field }) => (
            <Input
              isRequired
              label="Part name"
              variant="bordered"
              // labelPlacement="outside"
              placeholder="Enter part name..."
              {...field}
            />
          )}
        />
      </div>
      <div className="flex gap-4">
        <Button className="!min-w-[40px] px-0" variant="flat" color="danger">
          <Trash2 />
        </Button>
        <Button className="!min-w-[40px] px-0" variant="flat" color="primary">
          <Pencil />
        </Button>
        <Button className="!min-w-[40px] px-0" variant="flat" color="success">
          <Check />
        </Button>
      </div>
    </form>
  )
}

export default PartCourseForm
