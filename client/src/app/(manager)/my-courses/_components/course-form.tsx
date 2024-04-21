'use client'

import { ImageUpload } from '@/components/ImageUpload'
import { categories } from '@/lib/constants'
import { CourseBody, CourseBodyType } from '@/schemaValidations/course.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from '@nextui-org/react'
import { Globe, Lock } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'

const CourseForm = () => {
  const form = useForm<CourseBodyType>({
    resolver: zodResolver(CourseBody),
    defaultValues: {
      thumbnail: '',
      courseName: '',
      knowledgeGained: '',
      isPublic: false,
      descriptionMD: '',
      priceAmount: '',
      category: '',
    },
  })
  return (
    <form>
      <div className="flex gap-8 mb-10">
        <Controller
          name="courseName"
          control={form.control}
          render={({ field }) => (
            <Input
              isRequired
              label="Course name"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter your course name"
              {...field}
            />
          )}
        />
        <Controller
          name="priceAmount"
          control={form.control}
          render={({ field }) => (
            <Input
              isRequired
              label="Price"
              variant="bordered"
              labelPlacement="outside"
              placeholder="eg, 189"
              {...field}
            />
          )}
        />
      </div>
      <div className="flex gap-8 mb-10">
        <ImageUpload />
        <Controller
          name="descriptionMD"
          control={form.control}
          render={({ field }) => (
            <Textarea
              isRequired
              label="Description"
              labelPlacement="outside"
              placeholder="Enter your description"
              className="max-w-md"
              variant="bordered"
              {...field}
            />
          )}
        />
      </div>
      <Controller
        name="knowledgeGained"
        control={form.control}
        render={({ field }) => (
          <Textarea
            isRequired
            label="Knowledge Gained"
            labelPlacement="outside"
            placeholder="Enter your description"
            className="max-w-md"
            variant="bordered"
            {...field}
          />
        )}
      />
      <Select
        labelPlacement="outside"
        label="Category"
        placeholder="Select an category"
        isRequired
        // selectionMode="multiple"
        className="max-w-xs"
      >
        {categories.map((category) => (
          <SelectItem key={category} value={category} className="capitalize">
            {category.replace('_', ' ')}
          </SelectItem>
        ))}
      </Select>
      <Switch
        // defaultSelected
        size="lg"
        color="primary"
        startContent={<Globe />}
        endContent={<Lock />}
      />
      <div className="w-full">
        <Button color="primary" type="submit" className="ml-auto block">
          Save
        </Button>
      </div>
    </form>
  )
}

export default CourseForm

const FiedGroup = () => {
  return <div className="flex gap-8 mb-10"></div>
}
