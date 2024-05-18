'use client'

import { generateMediaLink } from '@/lib/utils'
import {
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@nextui-org/react'
import { SmilePlus } from 'lucide-react'
import React from 'react'

type Props = {
  data?: any
}

const EmojiPicker = ({ data }: Props) => {
  return (
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
          {data.map((emoji: any) => (
            <Tooltip
              key={emoji.id}
              content={emoji.name}
              className=""
              delay={0}
              closeDelay={0}
            >
              <Image
                // onClick={() => postEmoji(emoji.id)}
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
  )
}

export default EmojiPicker
