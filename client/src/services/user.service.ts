import { User } from '@/app/globals'
import http from '@/lib/http'
import { AccountResType } from '@/schemaValidations/account.schema'

export const userApiRequest = {
  getList: (params: any, access_token: string) =>
    http.get<any>(`/users?limit=${params.limit}&offset=${params.offset}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),

  get: (userId: number, access_token?: string) =>
    http.get<User>(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),

  verifyUser: (verifyCode: string) =>
    http.post('/users/verify', { verifyCode }),

  verifyInstructor: (body: any) => http.post('/users/author/verify', body),

  create: (body: any) => http.post('/users', body),

  edit: (userId: number, body: any) =>
    http.patch<any>(`/users/${userId}`, body),

  delete: (userId: number) => http.delete(`/users/${userId}`),
}
