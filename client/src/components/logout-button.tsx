'use client'

import { useAccountContext } from '@/contexts/account'
import { handleErrorApi } from '@/lib/utils'
import { authApiRequest } from '@/services/auth.service'
import { removeItem } from '@/utils/localStorage'
import { Button } from '@nextui-org/react'
import { usePathname, useRouter } from 'next/navigation'

export default function ButtonLogout() {
  const { setUser } = useAccountContext()
  const router = useRouter()
  const pathname = usePathname()
  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer()
      // router.push('/login')
    } catch (error) {
      // handleErrorApi({
      //   error,
      // })
      authApiRequest.logoutFromNextClientToNextServer(true)
      // .then((res) => {
      //   router.push(`/login?redirectFrom=${pathname}`)
      // })
    } finally {
      setUser(null)
      router.refresh()
      removeItem('user')
    }
  }
  return (
    <span className="block w-full" onClick={handleLogout}>
      Log Out
    </span>
  )
}
