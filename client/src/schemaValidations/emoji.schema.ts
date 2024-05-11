import { z } from 'zod'

export const EmojiBody = z.object({
  image: z.any(),
  name: z.string(),
})

export type EmojiBodyType = z.infer<typeof EmojiBody>

export const EmojiRes = z.object({
  id: z.number(),
  name: z.string(),
  emojiHandle: z.string(),
})

export type EmojiResType = z.infer<typeof EmojiRes>
