'use client'

import { authApiRequest } from '@/services/auth.service'
import InputPassword from '@/components/input/input-password'
import { RegisterBody, RegisterBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const RegisterForm = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const errors = form.formState.errors
  const onSubmit = async (values: RegisterBodyType) => {
    if (loading) return
    setLoading(true)
    try {
      const data: any = await authApiRequest.registerByEmail(values)
      if (data) {
        toast('Register successful')
        router.push('/login')
        router.refresh()
      }
    } catch (error: any) {
      toast(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex-1 p-10 space-y-4 max-w-2xl mx-auto w-full"
      autoComplete="off"
      // {...form}
    >
      <Controller
        name="email"
        control={form.control}
        render={({ field }) => (
          <Input
            label="Email"
            variant="bordered"
            placeholder="Enter your email"
            errorMessage={errors.email?.message}
            {...field}
          />
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field }) => (
          <InputPassword field={field} errorMsg={errors.password?.message} />
        )}
      />
      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field }) => (
          <InputPassword
            label="Comfirm password"
            field={field}
            errorMsg={errors.confirmPassword?.message}
          />
        )}
      />
      <div className="flex text-sm gap-1 font-normal ml-auto w-fit">
        You have an account?{' '}
        <Link
          href="/login"
          className="underline text-primary-500 font-semibold"
        >
          Login now!
        </Link>
      </div>
      <Button
        type="submit"
        size="lg"
        variant="solid"
        color="secondary"
        className="!mt-8 w-full"
      >
        Register
      </Button>
    </form>
  )
}

export default RegisterForm
