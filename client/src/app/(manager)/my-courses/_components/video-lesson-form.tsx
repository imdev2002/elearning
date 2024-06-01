import FileUpload from '@/components/input/file-upload'
import { cn } from '@/lib/utils'
import {
  LessonVideoBody,
  LessonVideoBodyType,
} from '@/schemaValidations/lesson.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Spinner, Switch, Textarea } from '@nextui-org/react'
import { Globe, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

type Props = {
  data?: any
  onSubmit?: any
  isReadOnly?: boolean
}

const VideoLessonForm = ({ data, onSubmit, isReadOnly = false }: Props) => {
  console.log('VideoLessonForm  data:', data)
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()
  const form = useForm<LessonVideoBodyType>({
    resolver: zodResolver(LessonVideoBody),
    defaultValues: {
      thumbnail: data?.thumbnailPath ?? '',
      video: data?.localPath ?? '',
      descriptionMD: data?.descriptionMD ?? '',
      lessonName: data?.lessonName ?? '',
      lessonNumber:
        data?.lessonNumber ?? String((data?.lessons?.length ?? 0) + 1),
    },
  })
  const { errors } = form.formState
  const submit = async (values: any) => {
    setLoading(true)
    await onSubmit(values)
    setLoading(false)
    refresh()
  }

  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      className={cn('space-y-4', isReadOnly && 'opacity-90')}
    >
      <div className="flex gap-8">
        <FileUpload
          disabled={isReadOnly}
          name="thumbnail"
          form={form}
          placeholder="Upload thumbnail. "
        />
        <FileUpload
          disabled={isReadOnly}
          type="video"
          name="video"
          form={form}
          placeholder="Upload video. "
        />
      </div>
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
      <Controller
        name="descriptionMD"
        control={form.control}
        render={({ field }) => (
          <Textarea
            disabled={isReadOnly}
            isRequired
            label="Description"
            labelPlacement="outside"
            placeholder="Enter your description"
            className=""
            variant="bordered"
            errorMessage={errors.descriptionMD?.message}
            {...field}
          />
        )}
      />
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

export default VideoLessonForm
