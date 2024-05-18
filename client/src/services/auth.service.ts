import http from '@/lib/http'
import {
  LoginBodyType,
  LoginResponseType,
  RegisterBodyType,
  RegisterResponseType,
  TokensType,
} from '@/schemaValidations/auth.schema'

type RefreshTokenResType = {
  accessToken: string
  newRefreshToken: string
}

export const authApiRequest = {
  auth: (tokens: TokensType) =>
    http.post('/api/auth', tokens, {
      baseUrl: '',
    }),

  loginByEmail: (body: LoginBodyType) =>
    http.post<LoginResponseType>('/auth/local/login', body),

  registerByEmail: (body: RegisterBodyType) =>
    http.post<RegisterResponseType>('/auth/local/register', body),

  loginByGoogle: (body: Omit<TokensType, 'refeshToken'>) =>
    http.post<LoginResponseType>('auth/login', body),

  refeshToken: (body: Omit<TokensType, 'accessToken'>) =>
    http.post<RefreshTokenResType>('/auth/refresh', body),

  changePassword: (body: any) => http.post('/auth/local/password', body),

  logoutFromNextServerToServer: (sessionToken: string) =>
    http.post(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
  logoutFromNextClientToNextServer: (
    force?: boolean | undefined,
    signal?: AbortSignal | undefined
  ) =>
    http.post(
      '/api/auth/logout',
      {
        force,
      },
      {
        baseUrl: '',
        signal,
      }
    ),
}
