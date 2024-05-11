'use client'

import { Course } from '@/app/globals'
import FileUpload from '@/components/input/file-upload'
import { categories } from '@/lib/constants'
import { convertObjectToFormData } from '@/lib/utils'
import {
  CourseBody,
  CourseBodyType,
  CourseResType,
} from '@/schemaValidations/course.schema'
import { courseManagerApiRequests } from '@/services/course.service'
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
import { useParams, useRouter } from 'next/navigation'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type Props = {
  defaultValues?: Course
}

const CourseForm = ({ defaultValues }: Props) => {
  const { courseId } = useParams()
  const { refresh } = useRouter()
  const form = useForm<CourseBodyType>({
    resolver: zodResolver(CourseBody),
    defaultValues: {
      thumbnail: defaultValues?.thumbnail || '',
      courseName: defaultValues?.courseName || '',
      knowledgeGained: defaultValues?.knowledgeGained || [],
      isPublic: defaultValues?.isPublic || false,
      descriptionMD: defaultValues?.descriptionMD || '',
      priceAmount: String(defaultValues?.priceAmount) || '',
      category: defaultValues?.category || '',
    },
  })
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: 'knowledgeGained',
  })
  const submitCourseForm = async (values: any) => {
    console.log('submitCourseForm  values:', values)
    try {
      values.isPublic = JSON.parse(values.isPublic)
      // console.log(typeof values.isPublic)
      values.knowledgeGained = JSON.stringify(values.knowledgeGained)
      const payload: any = convertObjectToFormData(values)
      // return
      const res = await courseManagerApiRequests.update(
        Number(courseId),
        payload
      )
      if (res.status === 200) {
        toast.success('Updated course!')
        refresh()
      }
    } catch (error) {
      toast.error('Failed to update')
    }
  }
  console.log('CourseForm  form:', form)
  return (
    <form onSubmit={form.handleSubmit(submitCourseForm)}>
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
        <FileUpload name="thumbnail" form={form} />
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
      <div className="relative">
        <label
          htmlFor=""
          className=" pointer-events-none origin-top-left subpixel-antialiased block text-foreground-500 after:content-['*'] after:text-danger after:ml-0.5 will-change-auto !duration-200 !ease-out motion-reduce:transition-none transition-[transform,color,left,opacity] group-data-[filled-within=true]:text-foreground group-data-[filled-within=true]:pointer-events-auto pb-0 z-20 top-1/2 -translate-y-1/2 group-data-[filled-within=true]:left-0 left-3 text-small group-data-[filled-within=true]:-translate-y-[calc(100%_+_theme(fontSize.small)/2_+_20px)] pe-2 max-w-full text-ellipsis overflow-hidden"
        >
          Knowledge Gained
        </label>
        <div>
          {fields.map((fieldSection, index) => (
            <Controller
              key={fieldSection.id}
              name={`knowledgeGained.${index}`}
              control={form.control}
              render={({ field }) => (
                <Input
                  isRequired
                  // label="Knowledge Gained"
                  // labelPlacement="outside"
                  placeholder="Enter your description"
                  className="max-w-md"
                  variant="bordered"
                  {...field}
                />
              )}
            />
          ))}
          <Button onClick={() => append('')}>Add Knowledge Gained</Button>
        </div>
      </div>
      <Controller
        control={form.control}
        name="category"
        render={({ field }) => (
          <Select
            selectedKeys={[field.value]}
            onChange={(value) => field.onChange(value)}
            labelPlacement="outside"
            label="Category"
            placeholder="Select an category"
            isRequired
            // selectionMode="multiple"
            className="max-w-xs"
          >
            {categories.map((category) => (
              <SelectItem
                key={category}
                value={category}
                className="capitalize"
              >
                {category.replace('_', ' ')}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        control={form.control}
        name="isPublic"
        render={({ field }) => (
          <Switch
            // defaultSelected
            // onChange={(value) => field.onChange(value)}
            isSelected={field.value}
            size="lg"
            color="primary"
            startContent={<Globe />}
            endContent={<Lock />}
            {...field}
          />
        )}
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
