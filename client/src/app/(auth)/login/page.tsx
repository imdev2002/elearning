'use client'

import GoogleLogin from '@/app/(auth)/login/_components/google-login'
import LoginForm from '@/app/(auth)/login/_components/login-form'
import { useAccountContext } from '@/contexts/account'
import { setItem } from '@/utils/localStorage'
import { Button } from '@nextui-org/react'
import axios from 'axios'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify'

const LoginPage = () => {
  const router = useRouter()
  const params = useParams()
  const { setUser } = useAccountContext()
  console.log(process.env.NEXT_PUBLIC_CLIENT_ID)
  return (
    <div className="flex justify-center items-center mt-20">
      <div className="w-[80vw] h-[80vh] flex">
        <div className="w-2/4 bg-white h-full flex justify-center items-center">
          <Image
            src="/images/login.png"
            alt="0"
            width={0}
            height={0}
            sizes="100%"
            className="w-3/4 object-cover"
          />
        </div>
        <div className="flex flex-col p-20 flex-1">
          <h3 className="text-4xl font-semibold text-center">Login</h3>
          {/* <p className="text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus,
            doloremque. Aliquid accusamus voluptas natus aperiam esse fugit
            rerum hic consectetur?
          </p> */}
          <LoginForm />
          <div className="relative mx-auto w-full">
            <span className="block absolute h-1 top-2/4 -translate-y-2/4 inset-x-10 bg-default-200 z-0"></span>
            <div className="relative flex justify-center">
              <span className="mx-auto text-center p-2 bg-background">OR</span>
            </div>
          </div>
          <GoogleLogin />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
