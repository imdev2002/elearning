import http from '@/lib/http'

type UploadResType = {
  path: string
}

export const fileApiRequest = {
  upload: (body: any) => http.post<UploadResType>('/files', body),
}
