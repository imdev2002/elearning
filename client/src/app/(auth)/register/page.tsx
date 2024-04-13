import RegisterForm from '@/app/(auth)/register/_components/register-form'
import Image from 'next/image'

const page = () => {
  return (
    <div className="flex">
      <div>
        <Image
          src="/public/images/register.png"
          alt=""
          width={0}
          height={0}
          className="w-2/4 object-cover"
        />
      </div>
      <RegisterForm />
    </div>
  )
}

export default page
