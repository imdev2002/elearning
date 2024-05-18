import { HttpError } from '@/lib/http'
import { authApiRequest } from '@/services/auth.service'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const headers = new Headers()
  const res = await request.json()
  const force = res.force as boolean | undefined
  headers.append('Set-Cookie', `accessToken=; Path=/; HttpOnly; Max-Age=0`)
  headers.append('Set-Cookie', `refreshToken=; Path=/; HttpOnly; Max-Age=0`)
  if (force) {
    return Response.json(
      {
        message: 'Buộc đăng xuất thành công',
      },
      {
        status: 200,
        headers,
      }
    )
  }
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')
  if (!accessToken) {
    return Response.json(
      { message: 'Can not get access token' },
      {
        status: 401,
      }
    )
  }
  try {
    const result = await authApiRequest.logoutFromNextServerToServer(
      accessToken.value
    )
    return Response.json(result.payload, {
      status: 200,
      headers,
    })
  } catch (error) {
    // if (error instanceof HttpError) {
    //   return Response.json(error.payload, {
    //     status: error.status,
    //   })
    // } else {
    //   return Response.json(
    //     {
    //       message: 'Lỗi không xác định',
    //     },
    //     {
    //       status: 500,
    //     }
    //   )
    // }
  }
}
