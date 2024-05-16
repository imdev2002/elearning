import RegisterForm from '@/app/(auth)/register/_components/register-form'
import Image from 'next/image'

const page = () => {
  return (
    <div className="w-[80vw] h-screen flex flex-row-reverse items-center justify-between mx-auto">
      <div className="w-2/4">
        <Image
          src="/images/register.png"
          alt=""
          width={360}
          height={360}
          sizes="100%"
          className="object-cover mx-auto"
        />
      </div>
      <RegisterForm />
    </div>
  )
}

export default page
