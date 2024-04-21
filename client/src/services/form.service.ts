import http from '@/lib/http'

export const FormApiRequest = {
  get: (formId: number) => http.get(`/form/${formId}`),

  getList: () => http.get('/form'),

  update: (formId: number, body: any) => http.patch(`/form/${formId}`, body),
}
