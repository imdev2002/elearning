import FileUpload from '@/components/input/file-upload'
import {
  LessonVideoBody,
  LessonVideoBodyType,
} from '@/schemaValidations/lesson.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Switch, Textarea } from '@nextui-org/react'
import { Globe, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

type Props = {
  data?: any
  onSubmit?: any
}

const VideoLessonForm = ({ data, onSubmit }: Props) => {
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()
  const form = useForm<LessonVideoBodyType>({
    resolver: zodResolver(LessonVideoBody),
    defaultValues: {
      thumbnail: data?.thumbnailPath ?? '',
      video: data?.localPath ?? '',
      descriptionMD: data?.descriptionMD ?? '',
      lessonName: data?.lessonName ?? '',
    },
  })
  const submit = async (values: any) => {
    setLoading(true)
    await onSubmit(values)
    setLoading(false)
    refresh()
  }

  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <div className="flex gap-8">
        <FileUpload name="thumbnail" form={form} />
        <FileUpload type="video" name="video" form={form} />
      </div>

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
      <Controller
        name="descriptionMD"
        control={form.control}
        render={({ field }) => (
          <Textarea
            isRequired
            label="Description"
            labelPlacement="outside"
            placeholder="Enter your description"
            className=""
            variant="bordered"
            {...field}
          />
        )}
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

export default VideoLessonForm
