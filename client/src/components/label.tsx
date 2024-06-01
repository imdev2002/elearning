'use client'

import { cn } from '@/lib/utils'

type Props = {
  isRequired?: boolean
  title?: string
}

const Label = ({ isRequired = false, title }: Props) => {
  return (
    <label
      htmlFor=""
      className={cn(
        'pointer-events-none origin-top-left subpixel-antialiased block text-foreground-500 will-change-auto !duration-200 !ease-out motion-reduce:transition-none transition-[transform,color,left,opacity] group-data-[filled-within=true]:text-foreground group-data-[filled-within=true]:pointer-events-auto pb-0 z-20 top-1/2 -translate-y-1/2 group-data-[filled-within=true]:left-0 left-3 text-small group-data-[filled-within=true]:-translate-y-[calc(100%_+_theme(fontSize.small)/2_+_20px)] pe-2 max-w-full text-ellipsis overflow-hidden',
        isRequired && "after:content-['*'] after:text-danger after:ml-0.5"
      )}
    >
      {title}
    </label>
  )
}

export default Label
