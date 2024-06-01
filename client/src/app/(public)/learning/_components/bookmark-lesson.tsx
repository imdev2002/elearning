'use client'
import { useBookmarks } from '@/contexts/bookmarks'
import { cn } from '@/lib/utils'
import { BookmarkApiRequest } from '@/services/bookmark.service'
import { Button, Tooltip } from '@nextui-org/react'
import { Bookmark } from 'lucide-react'
import { useParams, useSearchParams } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify'

const BookmarkLesson = () => {
  const { courseId } = useParams()
  const searchParams = useSearchParams()
  const lessonId = searchParams.get('lesson')
  const { bookmarks, setBookmarksRefresh } = useBookmarks()
  const isBookmarked = bookmarks?.some(
    (bookmark: any) => bookmark.lessonId === Number(lessonId)
  )
  const handleBookmarkLesson = async () => {
    try {
      const bookmarkId = bookmarks?.find(
        (bookmark: any) => bookmark.lessonId === Number(lessonId)
      )?.id
      const res = isBookmarked
        ? await BookmarkApiRequest.delete(bookmarkId)
        : await BookmarkApiRequest.create({ lessonId: Number(lessonId) })
      if (res.status === 200) {
        toast.success(
          isBookmarked
            ? 'Delete bookmark lesson successfully'
            : 'Bookmark lesson successfully'
        )

        setBookmarksRefresh((prev: boolean) => !prev)
      }
    } catch (error) {}
  }
  return (
    <Tooltip content={isBookmarked ? 'Bookmarked' : 'Bookmark this lesson'}>
      <Button isIconOnly onClick={handleBookmarkLesson} variant="ghost">
        <Bookmark
          className={cn(
            'stroke-yellow-500',
            bookmarks?.some(
              (bookmark: any) => bookmark.lessonId === Number(lessonId)
            ) && 'fill-yellow-400'
          )}
        />
      </Button>
    </Tooltip>
  )
}

export default BookmarkLesson
