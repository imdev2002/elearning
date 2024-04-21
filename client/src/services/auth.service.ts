import http from '@/lib/http'
import {
  LoginBodyType,
  LoginResponseType,
  RegisterBodyType,
  RegisterResponseType,
  TokensType,
} from '@/schemaValidations/auth.schema'

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
    http.post('/auth/refresh', body),
}
