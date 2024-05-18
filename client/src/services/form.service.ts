import { SubmitForm } from '@/app/globals'
import http from '@/lib/http'

export const formApiRequest = {
  get: (formId: number) => http.get(`/forms/${formId}`),

  getList: (access_token: string) =>
    http.get<SubmitForm[]>('/forms', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        cache: 'no-store',
      },
    }),

  update: (formId: number, body: any) => http.patch(`/forms/${formId}`, body),
}
