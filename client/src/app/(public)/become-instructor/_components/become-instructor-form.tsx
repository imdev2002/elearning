'use client'

import FileUpload from '@/components/input/file-upload'
import { CATEGORIES } from '@/lib/constants'
import { cn, convertObjectToFormData } from '@/lib/utils'
import {
  BecomeInstructorBody,
  BecomeInstructorBodyType,
} from '@/schemaValidations/become-instructor.schema'
import { userApiRequest } from '@/services/user.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { differenceInDays, format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Countdown from 'react-countdown'
import { useAccountContext } from '@/contexts/account'

type Props = {
  data?: any
}

const BecomeInstructorForm = ({ data }: Props) => {
  const { user } = useAccountContext()
  const isManager =
    user &&
    user.roles.some(
      (role) => role.role.name === 'ADMIN' || role.role.name === 'AUTHOR'
    )
  const isDisabledInput =
    differenceInDays(new Date(data?.updatedAt), new Date()) >= 15 ||
    !!data.id ||
    (!isManager ? false : true)
  console.log('BecomeInstructorForm  isDisabledInput:', isDisabledInput)
  const { refresh } = useRouter()
  const form = useForm<BecomeInstructorBodyType>({
    resolver: zodResolver(BecomeInstructorBody),
    defaultValues: {
      real_firstName: data?.real_firstName ?? '',
      real_lastName: data?.real_lastName ?? '',
      frontIdCard: data?.frontIdCard ?? '',
      backIdCard: data?.backIdCard ?? '',
      selfie: data?.selfie ?? '',
      category: data?.category ?? 'OTHER',
      linkCV: data?.linkCV ?? '',
    },
  })
  const { errors } = form.formState
  const submit = async (values: BecomeInstructorBodyType) => {
    if (!user?.email) {
      toast.error('You need login to use this feature.')
      return
    }
    const body = convertObjectToFormData(values)
    try {
      const res =
        data?.status === 'REJECTED'
          ? await userApiRequest.editForm(body)
          : await userApiRequest.verifyInstructor(body)
      if (res.status === 200) {
        toast.success('Request sent successfully')
        refresh()
      }
    } catch (error) {
      toast.error('You have already submitted your information')
    }
  }
  return (
    <>
      {data?.status ? (
        <div>
          <p className="ml-auto w-fit">
            {data?.status === 'PENDING' ? (
              <i>
                Update at: {format(new Date(data?.updatedAt), 'MM/dd/yyyy')}
              </i>
            ) : (
              <i className="capitalize">
                {(data?.status as string).toLowerCase()} at:{' '}
                {format(new Date(data?.updatedAt), 'MM/dd/yyyy')}
              </i>
            )}
          </p>
          {data?.status === 'REJECTED' && (
            <div className="ml-auto w-fit">
              Form modification permitted after:{' '}
              <Countdown
                date={
                  new Date(data?.updatedAt).getTime() + 15 * 24 * 60 * 60 * 1000
                }
              />
            </div>
          )}
        </div>
      ) : null}
      <form
        id="#register-instructor"
        onSubmit={form.handleSubmit(submit)}
        className={cn(
          'w-[920px] mx-auto space-y-4 py-10',
          isDisabledInput && 'opacity-80'
        )}
      >
        <div className="flex gap-8">
          <div className="flex flex-col gap-y-4 w-2/4">
            <div className="flex gap-2">
              <Controller
                name="real_firstName"
                control={form.control}
                render={({ field }) => (
                  <Input
                    isRequired
                    disabled={isDisabledInput}
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
                    disabled={isDisabledInput}
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
                  disabled={isDisabledInput}
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
                  disabled={isDisabledInput}
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
          <FileUpload
            disabled={isDisabledInput}
            name="selfie"
            form={form}
            placeholder="Upload your selfie here. "
          />
        </div>
        <div className="flex gap-4 justify-between">
          <FileUpload
            disabled={isDisabledInput}
            name="frontIdCard"
            form={form}
            placeholder="Upload your <b><i>front ID Card</i></b> here."
          />
          <FileUpload
            disabled={isDisabledInput}
            name="backIdCard"
            form={form}
            placeholder="Upload your <b><i>back ID Card</i></b> here."
          />
        </div>
        <Button
          disabled={isDisabledInput}
          type="submit"
          className="block ml-auto"
          color="primary"
          size="lg"
        >
          Register
        </Button>
      </form>
    </>
  )
}

export default BecomeInstructorForm
