import http from '@/lib/http'
import { EmojiBodyType } from '@/schemaValidations/emoji.schema'

export const emojiApiRequest = {
  create: async (body: EmojiBodyType) => http.post(`/emojis`, body),

  getList: () => http.get(`/emojis`),

  delete: (emojiId: number) => http.delete(`/emojis/${emojiId}`),
}
