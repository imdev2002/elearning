'use client'

import { accountApiRequest } from '@/services/account.service'
import { ImageUpload } from '@/components/ImageUpload'
import {
  AccountBody,
  AccountBodyType,
} from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Radio, RadioGroup } from '@nextui-org/react'
import { CalendarDays, X } from 'lucide-react'
import React from 'react'
import DatePicker from 'react-date-picker'
import { Controller, useForm } from 'react-hook-form'

const ProfileForm = () => {
  const form = useForm<AccountBodyType>({
    resolver: zodResolver(AccountBody),
    defaultValues: {
      avatar: '',
      username: '',
      firstName: '',
      lastName: '',
      phone: '',
      gender: '',
      birthday: '',
    },
  })
  const submitProfileForm = async (values: any) => {
    values.birthday = values.birthday.toISOString()
    const formData = new FormData()
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key])
    })
    await accountApiRequest.edit(2, formData)
  }
  console.log('ProfileForm  form:', form)
  return (
    <form
      className="mx-auto w-fit"
      onSubmit={form.handleSubmit(submitProfileForm)}
    >
      <div className="flex">
        <ImageUpload name="avatar" setValue={form.setValue} />
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
