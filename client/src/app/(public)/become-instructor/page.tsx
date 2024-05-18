import BecomeInstructorForm from '@/app/(public)/become-instructor/_components/become-instructor-form'
import StepsBecomeInstructor from '@/app/(public)/become-instructor/_components/steps-become-instructor'
import { userApiRequest } from '@/services/user.service'
import { Button } from '@nextui-org/react'
import { format } from 'date-fns'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

const BecomeInstructorPage = async () => {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const res = accessToken ? await userApiRequest.getForm(accessToken) : null
  const form = res ? res.payload : null
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="space-y-4">
          <h3 className="font-bold text-4xl">Become an Instuctor</h3>
          <p>
            Become an instructor & start teaching with 26k certified
            instructors. Create a success story with 67.1k Students — Grow
            yourself with 71 countries.
          </p>
          <Button color="primary" as={Link} href="#register-instructor">
            Get Started
          </Button>
        </div>
        <div className="w-1/3">
          <Image
            src="/images/model-2.png"
            alt=""
            width={500}
            height={500}
            className="object-cover"
          />
        </div>
      </div>

      <StepsBecomeInstructor />
      <div className="py-8">
        <div>
          <h3 className="font-bold text-4xl text-center">
            Become Instructor Form
          </h3>
        </div>
        <BecomeInstructorForm data={form ? (form as any)[0] : undefined} />
      </div>
    </>
  )
}

export default BecomeInstructorPage
