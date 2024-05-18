'use client'

import { useAccountContext } from '@/contexts/account'
import { authApiRequest } from '@/services/auth.service'
import { setItem } from '@/utils/localStorage'
import { Button } from '@nextui-org/react'
import { TokenResponse, useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const GoogleLogin = () => {
  const { setUser } = useAccountContext()
  const router = useRouter()
  const params = useParams()
  const loginByGooogleHandler = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      toast('success')
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/login`,
        {
          accessToken: tokenResponse.access_token,
        }
      )
      console.log(res)
      const { accessToken, refreshToken } = res.data
      await authApiRequest.auth({ accessToken, refreshToken })
      setItem('tokens', { accessToken, refreshToken })
      setItem('user', res.data.data)
      setUser(res.data.data)
      router.push('/')
      router.refresh()
      // if (params.next) {
      //   router.replace(params.next.toString())
      // } else {
      //   router.push('/')
      // }
    },
  })
  return (
    <Button
      size="lg"
      className="max-w-xs mx-auto mt-4"
      color="secondary"
      onClick={() => loginByGooogleHandler()}
    >
      Login with google
    </Button>
  )
}

export default GoogleLogin
