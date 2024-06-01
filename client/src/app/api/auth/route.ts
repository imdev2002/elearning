import { convertExpiresJWT, decodeJWT } from '@/lib/utils'

export async function POST(request: Request) {
  const headers = new Headers()
  const body = await request.json()
  const { exp: expAT } = decodeJWT(body.accessToken)
  const { exp: expRT } = decodeJWT(body.refreshToken)
  const expiresAT = convertExpiresJWT(expAT)
  const expiresRT = convertExpiresJWT(expRT)
  headers.append(
    'Set-Cookie',
    `accessToken=${body.accessToken}; Path=/; HttpOnly; Expires=${expiresAT}; SameSite=Lax; Secure`
  )
  headers.append(
    'Set-Cookie',
    `refreshToken=${body.refreshToken}; Path=/; HttpOnly; Expires=${expiresRT}; SameSite=Lax; Secure`
  )
  if (!body.accessToken) {
    return Response.json(
      { message: 'Không nhận được token' },
      {
        status: 400,
      }
    )
  }
  return Response.json(body, {
    status: 200,
    headers,
  })
}
