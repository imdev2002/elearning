'use client'

import { accountApiRequest } from '@/services/account.service'
import {
  AccountBody,
  AccountBodyType,
  AccountResType,
} from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
} from '@nextui-org/react'
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
import { convertObjectToFormData } from '@/lib/utils'
import ChangePasswordForm from '@/components/forms/change-password-form'

type Props = {
  data?: User
}

const ProfileForm = ({ data }: Props) => {
  const { user, setUser } = useAccountContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
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
      syncWithGoogle: profileData?.syncWithGoogle ?? false,
    },
  })
  const { errors } = form.formState
  const submitProfileForm = async (values: any) => {
    try {
      values.birthday =
        values.birthday instanceof Date
          ? values.birthday.toISOString()
          : values.birthday
      const formData = convertObjectToFormData(values)
      const res = await userApiRequest.edit(Number(profileData?.id), formData)
      if (res.status === 200) {
        toast.success(`Updated information of ${fullname}!`)

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
    <>
      <form
        className="mx-auto w-fit"
        onSubmit={form.handleSubmit(submitProfileForm)}
      >
        <div className="flex gap-8">
          <div className="flex flex-col items-center gap-y-2">
            <FileUpload name="avatar" form={form} />
            <Button variant="solid" color="secondary" onClick={onOpen}>
              Change password
            </Button>
          </div>
          <div className="flex flex-col gap-y-4">
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
                  errorMessage={errors.username?.message}
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
                  errorMessage={errors.phone?.message}
                  {...field}
                />
              )}
            />
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
                  errorMessage={errors.gender?.message}
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
                <div className="space-y-2">
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
                </div>
              )}
            />
            <Controller
              control={form.control}
              name="syncWithGoogle"
              render={({ field }) => (
                <Checkbox
                  onChange={field.onChange}
                  value={field.value}
                  // defaultSelected
                >
                  Sync with Google
                </Checkbox>
              )}
            />
          </div>
        </div>
        <Button type="submit" color="primary" className="ml-auto block">
          Save
        </Button>
      </form>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-[640px] px-8 pb-4"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Change password
              </ModalHeader>
              <ModalBody>
                <ChangePasswordForm />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileForm
