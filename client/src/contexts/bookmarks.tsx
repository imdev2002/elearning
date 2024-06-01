'use client'

import { useAccountContext } from '@/contexts/account'
import { BookmarkApiRequest } from '@/services/bookmark.service'
import { createContext, useContext, useEffect, useState } from 'react'

type BookmarksContextType = {
  bookmarks: any
  setBookmarks: (progress: any) => void
  setBookmarksRefresh: (val: any) => void
}

const CartContext = createContext<BookmarksContextType>({
  bookmarks: [],
  setBookmarks: () => {},
  setBookmarksRefresh: () => {},
})
function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAccountContext()
  const [bookmarksRefresh, setBookmarksRefresh] = useState(false)
  const [bookmarks, setBookmarks] = useState<any>()
  useEffect(() => {
    if (user?.email)
      (async () => {
        const res = await BookmarkApiRequest.getList()
        if (res.status === 200) setBookmarks(res.payload)
      })()
  }, [bookmarksRefresh])
  return (
    <CartContext.Provider
      value={{ bookmarks, setBookmarks, setBookmarksRefresh }}
    >
      {children}
    </CartContext.Provider>
  )
}

function useBookmarks() {
  const context = useContext(CartContext)
  if (typeof context === 'undefined')
    throw new Error('useDropdown must be used within CourseProvider')
  return context
}
export { useBookmarks, BookmarksProvider }
