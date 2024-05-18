'use client'

import React from 'react'
import { emojiApiRequest } from '@/services/emoji.service'
import { SmilePlus } from 'lucide-react'
import {
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@nextui-org/react'
import { cn, generateMediaLink } from '@/lib/utils'
import { coursePublicApiRequests } from '@/services/course.service'
import { useRouter, useSearchParams } from 'next/navigation'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useAccountContext } from '@/contexts/account'
import { toast } from 'react-toastify'

type Props = {
  data: any
  postId: number
}

const ReactionsSection = ({ data, postId }: Props) => {
  const searchParams = useSearchParams()
  console.log('ReactionsSection  searchParams:', searchParams.get('courseId'))
  const { user } = useAccountContext()
  const isAuth = !!user?.email
  const { refresh } = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [emojis, setEmojis] = React.useState<any>([])
  console.log('ReactionsSection  emojis:', emojis)
  const listReactions = emojis.map((emoji: any) => {
    const result = data.filter((reaction: any) => reaction.emojiId === emoji.id)
    console.log('listReactions  result:', result)
    const isReacted = result.some((item: any) => item.userId === user?.id)
    return {
      ...emoji,
      totalReactions: result.length,
      isReacted,
    }
  })
  async function postEmoji(emojiId: number) {
    try {
      if (!isAuth) {
        toast.error('You need to login to react')
        return
      }
      const res = await coursePublicApiRequests.reactAction({
        courseId: postId,
        emojiIconId: emojiId,
      })
      if (res.status === 200) {
        refresh()
      }
    } catch (error) {}
  }
  React.useEffect(() => {
    ;(async function fetchEmojis() {
      try {
        const res = await emojiApiRequest.getList()
        if (res.status === 200) {
          setEmojis(res.payload)
        }
      } catch (error) {}
    })()
  }, [])
  return (
    <div className="relative mx-auto w-fit">
      <div className="flex gap-4 items-center">
        {listReactions.map(
          (emoji: any) =>
            emoji.totalReactions > 0 && (
              <div key={emoji.id} className="flex gap-x-2 items-center">
                <Tooltip
                  content={emoji.name}
                  className=""
                  delay={0}
                  closeDelay={0}
                >
                  <Image
                    onClick={() => postEmoji(emoji.id)}
                    src={generateMediaLink(emoji.emojiHandle ?? '')}
                    alt={emoji.name}
                    width={32}
                    className="object-cover cursor-pointer hover:scale-125 transition-all"
                  />
                </Tooltip>
                <span
                  className={cn(
                    'px-4 border-2 rounded-full',
                    emoji.isReacted && 'border-primary'
                  )}
                >
                  {emoji.totalReactions}
                </span>
              </div>
            )
        )}
        {isAuth && (
          <Popover placement="bottom" showArrow={true}>
            <PopoverTrigger>
              <SmilePlus
                className="stroke-default-400 cursor-pointer"
                size={32}
                strokeWidth={1.5}
              />
            </PopoverTrigger>
            <PopoverContent>
              <div className="grid grid-cols-8 gap-2 max-w-screen-md p-3">
                {emojis.map((emoji: any) => (
                  <Tooltip
                    key={emoji.id}
                    content={emoji.name}
                    className=""
                    delay={0}
                    closeDelay={0}
                  >
                    <Image
                      onClick={() => postEmoji(emoji.id)}
                      src={generateMediaLink(emoji.emojiHandle ?? '')}
                      alt={emoji.name}
                      width={32}
                      className="object-cover cursor-pointer hover:scale-125 transition-all"
                    />
                  </Tooltip>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}

export default ReactionsSection
