import http from '@/lib/http'
import { EmojiBodyType } from '@/schemaValidations/emoji.schema'

export const emojiApiRequest = {
  create: async (body: any) => http.post(`/emojis`, body),

  getList: (access_token?: string) =>
    http.get<any[]>(`/emojis`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    }),

  delete: (emojiId: number) => http.delete(`/emojis/${emojiId}`),
}
