'use client'

import { userApiRequest } from '@/services/user.service'
import { Button } from '@nextui-org/react'
import { BadgeCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  params: any
}

const VerifyPage = () => {
  const searchParams = useSearchParams()
  const verifyCode = searchParams.get('verify')
  const [msg, setMsg] = useState('')
  useEffect(() => {
    const handleVerify = async () => {
      try {
        const res = await userApiRequest.verifyUser(verifyCode ?? '')
        if (res.status === 200) {
          setMsg('Verify successfully!')
        }
      } catch (error) {
        setMsg('Verify failed!')
      }
    }
    if (verifyCode) handleVerify()
  }, [])
  return (
    <div className="mx-auto min-h-screen flex flex-col items-center gap-4">
      <BadgeCheck size={50} className="stroke-green-600" />
      <p className="text-xl font-semibold">{msg}</p>
      <Button as={Link} href="/">
        Go to home page
      </Button>
    </div>
  )
}

export default VerifyPage
