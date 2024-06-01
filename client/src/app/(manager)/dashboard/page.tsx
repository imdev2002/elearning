import RevenueChart from '@/app/(manager)/dashboard/_components/chart/revenue'
import { InstructorRanks } from '@/app/(manager)/dashboard/_components/instructor-ranks'
import { Heading } from '@/components/heading'
import { HomeIcon } from '@/components/icons/sidebar/home-icon'
import { reportApiRequest } from '@/services/report.service'
import { cookies } from 'next/headers'
import React from 'react'

type Props = {
  searchParams: { [key: string]: string | undefined }
}

const page = async ({ searchParams }: Props) => {
  const { topInstructorsBy } = searchParams
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const { payload } = await reportApiRequest.revenue(accessToken)
  const { payload: topInstructors } = await reportApiRequest.topAuthors(
    accessToken,
    `?groupBy=${topInstructorsBy}`
  )
  return (
    <>
      <Heading title="Dashboard" icon={<HomeIcon />} />
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6 ">
          <div className="flex gap-2.5 justify-center">
            <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
              <span className="text-default-900 text-xl font-semibold">
                Revenues
              </span>
            </div>
          </div>
          <RevenueChart data={payload} />
        </div>
        <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
          <InstructorRanks data={topInstructors} />
        </div>
      </div>
    </>
  )
}

export default page
