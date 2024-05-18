'use client'

import {
  LessonTextBody,
  LessonTextBodyType,
} from '@/schemaValidations/lesson.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
// @ts-ignore
import ImageUploader from 'quill-image-uploader'
import { Button, Input, Switch } from '@nextui-org/react'
import { useMemo, useState } from 'react'
import { fileApiRequest } from '@/services/file.service'
import { generateMediaLink } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Globe, Lock } from 'lucide-react'
import QuillEditor from '@/components/input/quill-editor'

type Props = {
  data?: any
  onSubmit?: any
}

const TextLessonForm = ({ data, onSubmit }: Props) => {
  const [content, setContent] = useState(data?.content ?? '')
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()

  const form = useForm<LessonTextBodyType>({
    resolver: zodResolver(LessonTextBody),
    defaultValues: {
      lessonName: data?.lessonName ?? '',
      title: data?.title ?? '',
      content: data?.content ?? '',
      descriptionMD: data?.descriptionMD ?? '',
    },
  })
  const { errors } = form.formState
  const handleContentChange = (value: any) => {}

  const submit = async (values: any) => {
    // form.setValue('content', content)
    const body = { ...values, content }
    setLoading(true)
    await onSubmit(body)
    setLoading(false)
    refresh()
  }
  console.log('TextLessonForm  form:', form)
  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <div className="flex gap-8"></div>

      <Controller
        name="lessonName"
        control={form.control}
        render={({ field }) => (
          <Input
            isRequired
            className="flex-1"
            label="Lesson name"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter lesson name..."
            errorMessage={errors.lessonName?.message}
            {...field}
          />
        )}
      />
      <QuillEditor content={content} setContent={setContent} />
      <Controller
        control={form.control}
        name="trialAllowed"
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
      <Button className="block ml-auto" color="primary" type="submit">
        Save
      </Button>
    </form>
  )
}

export default TextLessonForm
