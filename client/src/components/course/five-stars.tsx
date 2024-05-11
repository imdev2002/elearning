'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

type FiveStarsProps = {
  starRated?: number
  className?: string
}

const FiveStars = ({ starRated = 0, className }: FiveStarsProps) => {
  const widthPercentage = (starRated / 5) * 100
  return (
    <div className={cn('flex justify-center relative w-fit', className)}>
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <Star
            key={index}
            size={16}
            className="stroke-yellow-400 fill-yellow-400"
          />
        ))}
      <div
        className="absolute inset-y-0 right-0 mix-blend-color bg-background"
        style={{ width: 100 - widthPercentage + '%' }}
      ></div>
    </div>
  )
}

export default FiveStars
