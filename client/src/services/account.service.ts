import http from '@/lib/http'
import { AccountBodyType } from '@/schemaValidations/account.schema'

export const accountApiRequest = {
  edit: (id: number, body: any) => http.patch(`/users/${id}`, body),
}
