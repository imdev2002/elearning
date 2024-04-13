'use client'

import { Controller, Form, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { Button, Input } from '@nextui-org/react'
import { useState } from 'react'
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/icons/EyeIcon'
import Link from 'next/link'
import { loginByEmail } from '@/apiRequests/auth'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { setItem } from '@/utils/localStorage'

const LoginForm = () => {
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const onSubmit = async (value: LoginBodyType) => {
    if (loading) return
    setLoading(true)
    try {
      const data: any = await loginByEmail(value)
      if (data) {
        const { accessToken, refreshToken, user } = data
        setItem('tokens', { accessToken, refreshToken })
        setItem('user', user)
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
        render={({ field }) => (
          <Input
            label="Password"
            variant="bordered"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? 'text' : 'password'}
            placeholder="Enter your password"
            {...field}
          />
        )}
      />

      <Button
        type="submit"
        size="lg"
        variant="solid"
        color="primary"
        className="!mt-8 w-full"
      >
        Login
      </Button>
      <div className="flex text-sm gap-1 font-normal ml-auto w-fit">
        You dont have account?{' '}
        <Link
          href="/register"
          className="underline text-primary-500 font-semibold"
        >
          Register now!
        </Link>
      </div>
    </form>
  )
}

export default LoginForm
