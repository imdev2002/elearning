import LoginForm from '@/app/(auth)/login/_components/login-form'
import Image from 'next/image'
import React from 'react'

const page = () => {
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
        <div className="flex flex-col p-20">
          <h3 className="text-4xl font-semibold text-center">Login</h3>
          <p className="text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus,
            doloremque. Aliquid accusamus voluptas natus aperiam esse fugit
            rerum hic consectetur?
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default page
