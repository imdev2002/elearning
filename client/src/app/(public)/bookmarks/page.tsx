'use client'

import { useBookmarks } from '@/contexts/bookmarks'
import { BookmarkApiRequest } from '@/services/bookmark.service'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react'
import { Eye, Trash, View } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { toast } from 'react-toastify'

const BookmarksPage = () => {
  const { bookmarks, setBookmarksRefresh } = useBookmarks()
  const deleteBookmark = async (bookmarkId: number) => {
    try {
      const res = await BookmarkApiRequest.delete(bookmarkId)
      if (res.status === 200) {
        toast.success('Bookmark lesson successfully')
        setBookmarksRefresh((prev: boolean) => !prev)
      }
    } catch (error) {}
  }
  return (
    <div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>BOOKMARK AT</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {bookmarks.length > 0
            ? bookmarks.map((bookmark: any, index: any) => (
                <TableRow key={bookmark.id}>
                  <TableCell>{bookmark.lesson.lessonName}</TableCell>
                  <TableCell>{bookmark.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <Tooltip content="Go to lesson">
                        <Link
                          href={`/learning/${bookmark.lesson.part.courseId}?lesson=${bookmark.lessonId}`}
                          className="cursor-pointer"
                        >
                          <Eye />
                        </Link>
                      </Tooltip>
                      <Tooltip content="Delete bookmark">
                        <span
                          className="cursor-pointer"
                          onClick={() => deleteBookmark(bookmark.id)}
                        >
                          <Trash className="stroke-danger-500" />
                        </span>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : 'No bookmarked lessons found.'}
        </TableBody>
      </Table>
    </div>
  )
}

export default BookmarksPage
