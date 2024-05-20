'use client'

import { Controller, Form, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { Button, Input } from '@nextui-org/react'
import { useState } from 'react'
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/icons/EyeIcon'
import Link from 'next/link'
import { authApiRequest } from '@/services/auth.service'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { setItem } from '@/utils/localStorage'
import { useAccountContext } from '@/contexts/account'
import InputPassword from '@/components/input/input-password'

const LoginForm = () => {
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const { errors } = form.formState
  const { setUser } = useAccountContext()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const onSubmit = async (value: LoginBodyType) => {
    if (loading) return
    setLoading(true)
    try {
      const { payload } = await authApiRequest.loginByEmail(value)
      if (payload) {
        const { accessToken, refreshToken, user } = payload
        await authApiRequest.auth({ accessToken, refreshToken })
        setItem('tokens', { accessToken, refreshToken })
        setItem('user', user)
        setUser(user)
        toast('Login successful')
        router.push('/')
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
      className="p-10 pb-6 max-w-2xl mx-auto w-full flex flex-col gap-y-6"
      autoComplete="off"
    >
      <Controller
        name="email"
        control={form.control}
        render={({ field }) => (
          <Input
            size="lg"
            label="Email"
            variant="bordered"
            placeholder="Enter your email"
            labelPlacement="outside"
            isRequired
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

      <div className="w-full">
        <div className="flex text-sm gap-1 font-normal ml-auto w-fit">
          You dont have account?{' '}
          <Link
            href="/register"
            className="underline text-primary-500 font-semibold"
          >
            Register now!
          </Link>
        </div>
        <Button
          type="submit"
          size="lg"
          variant="solid"
          color="primary"
          className="!mt-2 mb-1 w-full"
        >
          Login
        </Button>
        <Link
          href="/register"
          className="underline text-primary-500 text-sm ml-auto w-fit block"
        >
          Forgot password?
        </Link>
      </div>
    </form>
  )
}

export default LoginForm
