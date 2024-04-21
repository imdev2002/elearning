import http from '@/lib/http'

export const UserApiRequest = {
  getList: (params: any) => http.get('/users/users/profile', params),

  verifyUser: () => http.post('/users/verify', undefined),

  vrifyInstructor: (body: any) => http.post('/users/author/verify', body),

  create: (body: any) => http.post('/users', body),

  edit: (userId: number, body: any) => http.patch(`/users/${userId}`, body),

  delete: (userId: number) => http.delete(`/users/${userId}`),
}
