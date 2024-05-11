'use client'

import { accountApiRequest } from '@/services/account.service'
import {
  AccountBody,
  AccountBodyType,
  AccountResType,
} from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Radio, RadioGroup } from '@nextui-org/react'
import { CalendarDays, X } from 'lucide-react'
import React from 'react'
import DatePicker from 'react-date-picker'
import { Controller, useForm } from 'react-hook-form'
import FileUpload from '@/components/input/file-upload'
import { useAccountContext } from '@/contexts/account'
import { userApiRequest } from '@/services/user.service'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { setItem } from '@/utils/localStorage'
import { User } from '@/app/globals'

type Props = {
  data?: User
}

const ProfileForm = ({ data }: Props) => {
  const { user, setUser } = useAccountContext()
  const { refresh } = useRouter()
  const profileData = data ? data : user
  const fullname = profileData?.firstName
    ? `${profileData?.firstName}`
    : '' + profileData?.lastName
    ? ` ${profileData?.lastName}`
    : ''
  const form = useForm<AccountBodyType>({
    resolver: zodResolver(AccountBody),
    defaultValues: {
      avatar: profileData?.avatar ?? '',
      username: profileData?.username ?? '',
      firstName: profileData?.firstName ?? '',
      lastName: profileData?.lastName ?? '',
      phone: profileData?.phone ?? '',
      gender: profileData?.gender ?? '',
      birthday: profileData?.birthday ?? '',
    },
  })
  console.log('ProfileForm  form:', form)
  const submitProfileForm = async (values: any) => {
    try {
      values.birthday =
        values.birthday instanceof Date
          ? values.birthday.toISOString()
          : values.birthday
      const formData = new FormData()
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key])
      })
      const res = await userApiRequest.edit(Number(profileData?.id), formData)
      if (res.status === 200) {
        toast.success(`Updated information of ${fullname}!`)

        console.log(res.payload)
        if (user?.id === profileData?.id) {
          setUser(res.payload)
          setItem('user', { ...user, ...res.payload })
        }
        refresh()
      }
    } catch (error) {
      console.log(error)
      toast.error(`Could not update information of ${fullname}`)
    }
  }
  return (
    <form
      className="mx-auto w-fit"
      onSubmit={form.handleSubmit(submitProfileForm)}
    >
      <div className="flex">
        <FileUpload name="avatar" form={form} />
        <div>
          <div className="flex gap-4">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <Input
                  isRequired
                  label="First name"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="Enter your first name"
                  {...field}
                />
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <Input
                  isRequired
                  label="Last name"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="Enter your last name"
                  {...field}
                />
              )}
            />
          </div>
          <Controller
            name="username"
            control={form.control}
            render={({ field }) => (
              <Input
                isRequired
                label="User name"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your username"
                {...field}
              />
            )}
          />
          <Controller
            name="phone"
            control={form.control}
            render={({ field }) => (
              <Input
                isRequired
                label="Phone number"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your phone number"
                {...field}
              />
            )}
          />
          <div>
            <Controller
              control={form.control}
              name="gender"
              render={({ field }) => (
                <RadioGroup
                  onChange={(value) => field.onChange(value)}
                  orientation="horizontal"
                  label="Gender"
                  isRequired
                  value={field.value}
                  // className="flex flex-row gap-4"
                >
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                </RadioGroup>
              )}
            />
            <Controller
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <>
                  <span className="relative text-foreground-500 after:content-['*'] after:text-danger after:ml-0.5">
                    Birth day
                  </span>
                  <DatePicker
                    className="w-full"
                    dayPlaceholder="dd"
                    monthPlaceholder="mm"
                    yearPlaceholder="yyyy"
                    onChange={(date) => field.onChange(date)}
                    value={field.value}
                    calendarIcon={!field.value ? <CalendarDays /> : null}
                    clearIcon={field.value ? <X /> : null}
                  />
                </>
              )}
            />
          </div>
        </div>
      </div>
      <Button type="submit">Save</Button>
    </form>
  )
}

export default ProfileForm
