import { User } from '@/app/globals'
import http from '@/lib/http'
import { AccountResType } from '@/schemaValidations/account.schema'

export const userApiRequest = {
  getList: (params: string, access_token: string) =>
    http.get<any>(`/users?${params}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    }),

  get: (userId: number, access_token?: string) =>
    http.get<User>(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),

  verifyUser: (verifyCode: string) =>
    http.post<User>('/users/verify', { verifyCode }),

  verifyInstructor: (body: any) => http.post('/users/author/verify', body),

  create: (body: any) => http.post('/users', body),

  edit: (userId: number, body: any) =>
    http.patch<any>(`/users/${userId}`, body),

  delete: (userId: number) => http.delete(`/users/${userId}`),

  getCourseProgress: () => http.get('/users/actions/progress'),

  getCourseBought: () => http.get('/users/actions/bought'),

  getWishList: () => http.get('/users/actions/hearted'),

  getForm: (access_token: string) =>
    http.get('/users/actions/forms', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    }),

  editForm: (body: any) => http.patch('/users/actions/forms', body),
}
