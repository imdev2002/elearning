'use client'

import { clientTokens } from '@/lib/http'
import { useEffect } from 'react'
import { differenceInHours } from 'date-fns'
import { authApiRequest } from '@/services/auth.service'
import { decodeJWT } from '@/lib/utils'

export default function SlideRefreshToken() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date()
      const expiresAt = new Date(clientTokens.expiresAt)
      if (differenceInHours(expiresAt, now) < 1) {
        const res = await authApiRequest.refeshToken({
          refreshToken: clientTokens.value.refreshToken,
        })
        const newAccessToken = res.payload?.data?.accessToken
        clientTokens.expiresAt = decodeJWT(newAccessToken).exp
      }
    }, 1000 * 60 * 30)
    return () => clearInterval(interval)
  }, [])
  return null
}
