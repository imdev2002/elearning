import { ImageUpload } from '@/components/ImageUpload'
import { LessonBody, LessonBodyType } from '@/schemaValidations/lesson.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@nextui-org/react'
import { Controller, useForm } from 'react-hook-form'

const LessonForm = () => {
  const form = useForm<LessonBodyType>({
    resolver: zodResolver(LessonBody),
    defaultValues: {
      thumbnail: '',
      video: '',
      descriptionMD: '',
      lessonNumber: 0,
      lessonName: '',
      courseId: 0,
      partNumber: 0,
    },
  })
  return (
    <form>
      <div className="flex gap-8">
        <ImageUpload />
        <ImageUpload />
      </div>
      <div className="flex gap-8">
        <Controller
          name="lessonNumber"
          control={form.control}
          render={({ field }) => (
            <Input
              className="w-1/12"
              isRequired
              label="Lesson number"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter lesson number..."
              {...field}
            />
          )}
        />
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
      </div>
    </form>
  )
}

export default LessonForm
