import { normalizePath } from '@/lib/utils'
import { LoginResponseType, TokensType } from '@/schemaValidations/auth.schema'
import { redirect } from 'next/navigation'

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }
  constructor({ status, payload }: { status: number; payload: any }) {
    super('Http Error')
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: 422
  payload: EntityErrorPayload
  constructor({
    status,
    payload,
  }: {
    status: 422
    payload: EntityErrorPayload
  }) {
    super({ status, payload })
    this.status = status
    this.payload = payload
  }
}

class Tokens {
  private accessToken = ''
  private refreshToken = ''
  private _expiresAt = new Date().toISOString()
  get value() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    }
  }
  set value(tokens: TokensType) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === 'undefined') {
      throw new Error('Cannot set token on server side')
    }
    this.accessToken = tokens.accessToken
    this.refreshToken = tokens.refreshToken
  }
  get expiresAt() {
    return this._expiresAt
  }
  set expiresAt(expiresAt: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === 'undefined') {
      throw new Error('Cannot set token on server side')
    }
    this._expiresAt = expiresAt
  }
}

export const clientTokens = new Tokens()
// let clientLogoutRequest: null | Promise<any> = null

const request = async <Response>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body
    ? options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined
  const baseHeaders =
    body instanceof FormData
      ? {
          Authorization: clientTokens.value.accessToken
            ? `Bearer ${clientTokens.value.accessToken}`
            : '',
        }
      : {
          'Content-Type': 'application/json',
          Authorization: clientTokens.value.accessToken
            ? `Bearer ${clientTokens.value.accessToken}`
            : '',
        }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API_BASE
      : options.baseUrl

  const fullUrl = `${baseUrl}${url}`

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  })
  const payload: Response = await res.json()
  const data = {
    status: res.status,
    payload,
  }
  // Interceptor là nời chúng ta xử lý request và response trước khi trả về cho phía component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422
          payload: EntityErrorPayload
        }
      )
    }
    // else if (res.status === AUTHENTICATION_ERROR_STATUS) {
    //   if (typeof window !== 'undefined') {
    //     if (!clientLogoutRequest) {
    //       clientLogoutRequest = fetch('/api/auth/logout', {
    //         method: 'POST',
    //         body: JSON.stringify({ force: true }),
    //         headers: {
    //           ...baseHeaders,
    //         } as any,
    //       })

    //       await clientLogoutRequest
    //       clientTokens.value = {
    //         accessToken: '',
    //         refreshToken: '',
    //       }
    //       // clientTokens.expiresAt = new Date().toISOString()
    //       clientLogoutRequest = null
    //       location.href = '/login'
    //     }
    //   } else {
    //     const sessionToken = (options?.headers as any)?.Authorization.split(
    //       'Bearer '
    //     )[1]
    //     redirect(`/logout?sessionToken=${sessionToken}`)
    //   }
    // }
    else {
      throw new HttpError(data)
    }
  }
  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (typeof window !== 'undefined') {
    if (
      ['auth/login', 'auth/register'].some(
        (item) => item === normalizePath(url)
      )
    ) {
      clientTokens.value = {
        accessToken: (payload as LoginResponseType).accessToken,
        refreshToken: (payload as LoginResponseType).refreshToken,
      }
      // clientTokens.expiresAt = (
      //   payload as LoginResponseType
      // ).data.expiresAt
    } else if ('auth/logout' === normalizePath(url)) {
      clientTokens.value = {
        accessToken: '',
        refreshToken: '',
      }
      // clientTokens.expiresAt = new Date().toISOString()
    }
  }
  return data
}

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('GET', url, options)
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('POST', url, { ...options, body })
  },
  patch<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('PATCH', url, { ...options, body })
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('DELETE', url, { ...options })
  },
}

export default http
