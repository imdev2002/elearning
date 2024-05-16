'use client'

import {
  CoursePartsBody,
  CoursePartsBodyType,
} from '@/schemaValidations/course.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { Check, Pencil, Trash2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'

type Props = {
  data?: any
  action?: 'create' | 'edit'
}

const PartCourseForm = ({ data, action = 'create' }: Props) => {
  const form = useForm<CoursePartsBodyType>({
    resolver: zodResolver(CoursePartsBody),
    defaultValues: {
      partNumber: data?.partNumber ?? '',
      partName: data?.partName ?? '',
    },
  })
  const { errors } = form.formState
  return (
    <form className="flex gap-2 items-end bg-neutral-700/30 p-4 rounded-xl">
      {/* <div className="flex gap-4 w-[90%]"> */}
      <Controller
        name="partNumber"
        control={form.control}
        render={({ field }) => (
          <Input
            isRequired
            className="w-1/3"
            label="Part number"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter your course name"
            errorMessage={errors.partNumber?.message}
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
            labelPlacement="outside"
            placeholder="Enter part name..."
            errorMessage={errors.partName?.message}
            {...field}
          />
        )}
      />
    </form>
  )
}

export default PartCourseForm
