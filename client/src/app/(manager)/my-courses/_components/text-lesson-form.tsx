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
import { convertObjectToFormData, generateMediaLink } from '@/lib/utils'
import { lessonManagerApiRequest } from '@/services/lesson.service'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { Globe, Lock } from 'lucide-react'

Quill.register('modules/imageUploader', ImageUploader)

type Props = {
  data?: any
  onSubmit?: any
}

const TextLessonForm = ({ data, onSubmit }: Props) => {
  const [content, setContent] = useState('')
  console.log('TextLessonForm  content:', content)
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()
  const modules = useMemo(
    () => ({
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['link', 'image'],
      ],
      imageUploader: {
        // imgbbAPI
        upload: async (file: any) => {
          const bodyFormData = new FormData()
          bodyFormData.append('image', file)
          const response = await fileApiRequest.upload(bodyFormData)
          console.log('upload:  response:', response)
          return generateMediaLink(response.payload.path)
        },
      },
    }),
    []
  )
  const form = useForm<LessonTextBodyType>({
    resolver: zodResolver(LessonTextBody),
    defaultValues: {
      lessonName: '',
      title: 'xxx',
      content: '',
      descriptionMD: 'yyy',
    },
  })
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
            {...field}
          />
        )}
      />
      <ReactQuill
        modules={modules}
        theme="snow"
        value={content}
        // @ts-ignore
        onChange={setContent}
      />
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
