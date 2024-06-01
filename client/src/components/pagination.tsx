'use client'

import { cn } from '@/lib/utils'
import { Button, Pagination, PaginationItemType } from '@nextui-org/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

type Props = {
  totalItems?: number
  itemsPerPage?: number
}

const DKEPagination = ({ totalItems, itemsPerPage = 12 }: Props) => {
  return (
    <Pagination
      disableCursorAnimation
      showControls
      total={totalItems ? Math.ceil(totalItems / itemsPerPage) : 0}
      initialPage={1}
      className="gap-2 rounded-md"
      radius="full"
      renderItem={RenderItem}
      variant="light"
    />
  )
}

export default DKEPagination

const RenderItem = ({
  ref,
  key,
  value,
  isActive,
  onNext,
  onPrevious,
  setPage,
  className = '!rounded-md',
}: any) => {
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const currentPage = searchParams.get('page') || 1
  const params = new URLSearchParams()
  if (value === PaginationItemType.NEXT) {
    return (
      <Button
        key={key}
        className={cn(className, 'bg-default-200/50 min-w-8 w-8 h-8')}
        onClick={onNext}
        isIconOnly
      >
        <ChevronRight />
      </Button>
    )
  }

  if (value === PaginationItemType.PREV) {
    return (
      <Button
        key={key}
        className={cn(className, 'bg-default-200/50 min-w-8 w-8 h-8')}
        onClick={onPrevious}
        isIconOnly
      >
        <ChevronLeft />
      </Button>
    )
  }

  if (value === PaginationItemType.DOTS) {
    return (
      <Button key={key} className={className}>
        ...
      </Button>
    )
  }

  // cursor is the default item
  return (
    <Button
      ref={ref}
      key={key}
      className={cn(className, isActive && 'text-white bg-primary font-bold')}
      onClick={() => {
        setPage(value)
        replace(`?page=${value}`)
      }}
    >
      {value}
    </Button>
  )
}
