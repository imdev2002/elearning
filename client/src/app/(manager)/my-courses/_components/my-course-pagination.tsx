'use client'

import { cn } from '@/lib/utils'
import { Pagination, PaginationItemType } from '@nextui-org/react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronUpIcon,
  ChevronsUpIcon,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { use } from 'react'

const MyCoursePagination = () => {
  return (
    <Pagination
      disableCursorAnimation
      showControls
      total={10}
      initialPage={1}
      className="gap-2"
      radius="full"
      renderItem={RenderItem}
      variant="light"
    />
  )
}

export default MyCoursePagination

const RenderItem = ({
  ref,
  key,
  value,
  isActive,
  onNext,
  onPrevious,
  setPage,
  className,
}: any) => {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const currentPage = searchParams.get('page') || 1
  if (value === PaginationItemType.NEXT) {
    return (
      <button
        key={key}
        className={cn(className, 'bg-default-200/50 min-w-8 w-8 h-8')}
        onClick={onNext}
      >
        <ChevronLeft className="rotate-180" />
      </button>
    )
  }

  if (value === PaginationItemType.PREV) {
    return (
      <button
        key={key}
        className={cn(className, 'bg-default-200/50 min-w-8 w-8 h-8')}
        onClick={onPrevious}
      >
        <ChevronRight />
      </button>
    )
  }

  if (value === PaginationItemType.DOTS) {
    return (
      <button key={key} className={className}>
        ...
      </button>
    )
  }

  // cursor is the default item
  return (
    <button
      ref={ref}
      key={key}
      className={cn(
        className,
        isActive &&
          'text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold'
      )}
      onClick={() => setPage(value)}
    >
      {value}
    </button>
  )
}
