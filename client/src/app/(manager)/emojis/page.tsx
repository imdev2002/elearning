import CreateEmojiModal from '@/app/(manager)/emojis/_components/create-emoji-modal'
import DeleteEmoji from '@/app/(manager)/emojis/_components/delete-emoji'
import { Heading } from '@/components/heading'
import { SmileIcon } from '@/components/icons/sidebar/smile-icon'
import { MEDIA_URL } from '@/lib/constants'
import { emojiApiRequest } from '@/services/emoji.service'
import { cookies } from 'next/headers'
import Image from 'next/image'
import React from 'react'

const page = async () => {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const { payload: listEmojis } = await emojiApiRequest.getList(accessToken)
  return (
    <>
      <Heading icon={<SmileIcon />} title="Emojis" />

      <div className="grid grid-cols-8 lg:grid-cols-12 gap-2 p-5">
        <CreateEmojiModal />
        {listEmojis.map((emoji, index) => (
          <div
            key={index}
            className="p-1 lg:p-4 border rounded-md border-foreground-200 aspect-square flex items center justify-center relative group"
          >
            <DeleteEmoji emoji={emoji} />
            <Image
              src={`${MEDIA_URL}/${emoji.emojiHandle}`}
              alt={emoji.name}
              width={0}
              height={0}
              sizes="400px"
              className="w-full object-cover"
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default page
