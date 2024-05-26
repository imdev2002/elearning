import RevenueChart from '@/app/(manager)/dashboard/_components/chart/revenue'
import { reportApiRequest } from '@/services/report.service'
import { cookies } from 'next/headers'
import React from 'react'

const page = async () => {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const { payload } = await reportApiRequest.revenue(accessToken)
  return (
    <div>
      <RevenueChart data={payload} />
    </div>
  )
}

export default page
