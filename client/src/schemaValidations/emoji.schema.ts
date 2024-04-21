import { z } from 'zod'

export const EmojiBody = z.object({
  image: z.string(),
  name: z.string(),
})

export type EmojiBodyType = z.infer<typeof EmojiBody>
