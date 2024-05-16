'use client'

import FileUpload from '@/components/input/file-upload'
import { CATEGORIES } from '@/lib/constants'
import { convertObjectToFormData } from '@/lib/utils'
import {
  BecomeInstructorBody,
  BecomeInstructorBodyType,
} from '@/schemaValidations/become-instructor.schema'
import { userApiRequest } from '@/services/user.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const BecomeInstructorForm = () => {
  const { refresh } = useRouter()
  const form = useForm<BecomeInstructorBodyType>({
    resolver: zodResolver(BecomeInstructorBody),
    defaultValues: {
      real_firstName: '',
      real_lastName: '',
      frontIdCard: '',
      backIdCard: '',
      selfie: '',
      category: '',
      linkCV: '',
    },
  })
  const { errors } = form.formState
  const submit = async (data: BecomeInstructorBodyType) => {
    const body = convertObjectToFormData(data)
    try {
      const res = await userApiRequest.verifyInstructor(body)
      if (res.status === 200) {
        toast.success('Request sent successfully')
        refresh()
      }
    } catch (error) {
      toast.error('You have already submitted your information')
    }
  }
  return (
    <form
      id="#register-instructor"
      onSubmit={form.handleSubmit(submit)}
      className="w-[920px] mx-auto space-y-4"
    >
      <div className="flex gap-4">
        <div className="flex flex-col gap-y-4">
          <div className="flex gap-2">
            <Controller
              name="real_firstName"
              control={form.control}
              render={({ field }) => (
                <Input
                  isRequired
                  labelPlacement="outside"
                  label="First name"
                  variant="bordered"
                  placeholder="Enter your real first name"
                  errorMessage={errors.real_firstName?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="real_lastName"
              control={form.control}
              render={({ field }) => (
                <Input
                  isRequired
                  labelPlacement="outside"
                  label="Last name"
                  variant="bordered"
                  placeholder="Enter your real last name"
                  errorMessage={errors.real_lastName?.message}
                  {...field}
                />
              )}
            />
          </div>
          <Controller
            name="linkCV"
            control={form.control}
            render={({ field }) => (
              <Input
                isRequired
                labelPlacement="outside"
                label="Link CV"
                variant="bordered"
                placeholder="Enter your link CV"
                errorMessage={errors.linkCV?.message}
                {...field}
              />
            )}
          />
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
                className="max-w-xs"
                errorMessage={errors.category?.message}
              >
                {CATEGORIES.map((category) => (
                  <SelectItem
                    key={category.value}
                    value={category.value}
                    className="capitalize"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
        <FileUpload name="selfie" form={form} />
      </div>
      <div className="flex gap-4 justify-between">
        <FileUpload name="frontIdCard" form={form} />
        <FileUpload name="backIdCard" form={form} />
      </div>
      <Button type="submit" className="block ml-auto" color="primary" size="lg">
        Register
      </Button>
    </form>
  )
}

export default BecomeInstructorForm
