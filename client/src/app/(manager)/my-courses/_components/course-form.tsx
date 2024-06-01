'use client'

import { Course } from '@/app/globals'
import FileUpload from '@/components/input/file-upload'
import QuillEditor from '@/components/input/quill-editor'
import Label from '@/components/label'
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
import { use, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type Props = {
  defaultValues?: Course
  isReadOnly?: boolean
}

const CourseForm = ({ defaultValues, isReadOnly = false }: Props) => {
  const [desc, setDesc] = useState(defaultValues?.descriptionMD ?? '')
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
  const { errors } = form.formState
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: 'knowledgeGained',
  })
  const submitCourseForm = async (values: any) => {
    try {
      values.isPublic = JSON.parse(values.isPublic)
      values.knowledgeGained = JSON.stringify(values.knowledgeGained)
      values.descriptionMD = desc
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
  return (
    <form onSubmit={form.handleSubmit(submitCourseForm)}>
      <div className="flex gap-8 mb-10 items-center flex-row-reverse">
        <FileUpload
          name="thumbnail"
          form={form}
          placeholder="."
          disabled={isReadOnly}
        />

        <div className="w-2/4 flex-shrink-0 flex flex-col gap-y-4">
          <Controller
            name="courseName"
            control={form.control}
            render={({ field }) => (
              <Input
                disabled={isReadOnly}
                isRequired
                label="Course name"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your course name"
                errorMessage={errors.courseName?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="priceAmount"
            control={form.control}
            render={({ field }) => (
              <Input
                disabled={isReadOnly}
                isRequired
                label="Price"
                variant="bordered"
                labelPlacement="outside"
                placeholder="eg, 189"
                errorMessage={errors.priceAmount?.message}
                {...field}
              />
            )}
          />
        </div>
      </div>
      <div className="relative">
        <Label isRequired title="Description" />
        <QuillEditor
          disabled={isReadOnly}
          content={desc}
          setContent={setDesc}
        />
      </div>
      <div className="relative my-8">
        <Label isRequired title="Knowledge Gained" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {fields.map((fieldSection, index) => (
            <Controller
              key={fieldSection.id}
              name={`knowledgeGained.${index}`}
              control={form.control}
              render={({ field }) => (
                <Input
                  disabled={isReadOnly}
                  isRequired
                  autoFocus
                  placeholder="Enter your description"
                  className="w-full"
                  variant="bordered"
                  errorMessage={errors.knowledgeGained?.message}
                  {...field}
                />
              )}
            />
          ))}
          <Button disabled={isReadOnly} onClick={() => append('')}>
            Add Knowledge Gained
          </Button>
        </div>
      </div>
      <div className="pt-0 pb-2">
        <Controller
          control={form.control}
          name="category"
          render={({ field }) => (
            <Select
              disabled={isReadOnly}
              selectedKeys={[field.value]}
              onChange={(value) => field.onChange(value)}
              labelPlacement="outside"
              label="Category"
              placeholder="Select an category"
              isRequired
              errorMessage={errors.category?.message}
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
      </div>

      <Controller
        control={form.control}
        name="isPublic"
        render={({ field }) => (
          <Switch
            disabled={isReadOnly}
            isSelected={field.value}
            size="lg"
            color="primary"
            startContent={<Globe />}
            endContent={<Lock />}
            {...field}
          />
        )}
      />

      {!isReadOnly && (
        <div className="w-full">
          <Button color="primary" type="submit" className="ml-auto block">
            Save
          </Button>
        </div>
      )}
    </form>
  )
}

export default CourseForm
