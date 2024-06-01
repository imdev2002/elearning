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
import { Button, Input, Spinner, Switch } from '@nextui-org/react'
import { useMemo, useState } from 'react'
import { fileApiRequest } from '@/services/file.service'
import { cn, generateMediaLink } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Globe, Lock } from 'lucide-react'
import QuillEditor from '@/components/input/quill-editor'
import Label from '@/components/label'

type Props = {
  data?: any
  onSubmit?: any
  isReadOnly?: boolean
}

const TextLessonForm = ({ data, onSubmit, isReadOnly = false }: Props) => {
  const [content, setContent] = useState(data?.content ?? '')
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()

  const form = useForm<LessonTextBodyType>({
    resolver: zodResolver(LessonTextBody),
    defaultValues: {
      lessonName: data?.lessonName ?? '',
      title: data?.title ?? 'abc',
      content: data?.content ?? '',
      descriptionMD: data?.descriptionMD ?? 'abc',
      lessonNumber:
        data?.lessonNumber ?? String((data?.lessons?.length ?? 0) + 1),
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
  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      className={cn('space-y-4', isReadOnly && 'opacity-90')}
    >
      <div className="flex gap-8"></div>

      <div className="flex gap-x-4">
        <Controller
          name="lessonNumber"
          control={form.control}
          render={({ field }) => (
            <Input
              disabled={isReadOnly}
              isRequired
              className="w-1/5"
              label="Lesson number"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter lesson number..."
              errorMessage={errors.lessonNumber?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="lessonName"
          control={form.control}
          render={({ field }) => (
            <Input
              disabled={isReadOnly}
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
      </div>
      <div className="pt-4">
        <Label isRequired title="Content" />
        <QuillEditor
          disabled={isReadOnly}
          content={content}
          setContent={setContent}
        />
      </div>
      <Controller
        control={form.control}
        name="trialAllowed"
        render={({ field }) => (
          <Switch
            disabled={isReadOnly}
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
      {!isReadOnly && (
        <Button
          className="flex items-center ml-auto"
          color="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner color="success" /> : 'Save'}
        </Button>
      )}
    </form>
  )
}

export default TextLessonForm
