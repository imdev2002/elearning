'use client'

import InputPassword from '@/components/input/input-password'
import { useAccountContext } from '@/contexts/account'
import {
  ChangePasswordBody,
  ChangePasswordBodyType,
} from '@/schemaValidations/auth.schema'
import { authApiRequest } from '@/services/auth.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@nextui-org/react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const ChangePasswordForm = () => {
  const { user } = useAccountContext()
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })
  const { errors } = form.formState
  const changePassword = async (values: ChangePasswordBodyType) => {
    try {
      const bodyData = { email: user?.email, ...values }
      const res = await authApiRequest.changePassword(bodyData)
      if (res.status === 200) {
        toast.success('Change password successful')
        form.reset()
      }
    } catch (error) {
      toast.error('Change password failed')
    }
  }
  return (
    <form
      onSubmit={form.handleSubmit(changePassword)}
      className="flex flex-col gap-y-6"
    >
      <Controller
        name="oldPassword"
        control={form.control}
        render={({ field }) => (
          <InputPassword
            label="Old password"
            field={field}
            errorMsg={errors.oldPassword?.message}
          />
        )}
      />
      <Controller
        name="newPassword"
        control={form.control}
        render={({ field }) => (
          <InputPassword
            label="New password"
            field={field}
            errorMsg={errors.newPassword?.message}
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field }) => (
          <InputPassword
            label="Comfirm new password"
            field={field}
            errorMsg={errors.confirmPassword?.message}
          />
        )}
      />
      <Button type="submit" color="primary">
        Submit
      </Button>
    </form>
  )
}

export default ChangePasswordForm
