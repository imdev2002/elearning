'use client'

import InputPassword from '@/app/(auth)/_components/InputPassword'
import { RegisterBody, RegisterBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

const RegisterForm = () => {
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const onSubmit = () => null
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex-1 p-10 space-y-4 max-w-2xl mx-auto w-full"
      autoComplete="off"
      {...form}
    >
      <Controller
        name="email"
        control={form.control}
        render={({ field }) => (
          <Input
            label="Email"
            variant="bordered"
            placeholder="Enter your email"
            {...field}
          />
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field }) => <InputPassword field={field} />}
      />
      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field }) => (
          <InputPassword label="Comfirm password" field={field} />
        )}
      />

      <Button
        type="submit"
        size="lg"
        variant="solid"
        color="secondary"
        className="!mt-8 w-full"
      >
        Register
      </Button>
      <div className="flex text-sm gap-1 font-normal ml-auto w-fit">
        You have an account?{' '}
        <Link
          href="/login"
          className="underline text-primary-500 font-semibold"
        >
          Login now!
        </Link>
      </div>
    </form>
  )
}

export default RegisterForm
