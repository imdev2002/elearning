'use client'
import Foooter from '@/components/layouts/Foooter'
import Header from '@/components/layouts/Header'
import { BookmarksProvider } from '@/contexts/bookmarks'
import { CartProvider } from '@/contexts/cart'
import { CourseProvider } from '@/contexts/course'
import { useEffect, useState } from 'react'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  if (!isClient) return null
  return (
    <CourseProvider>
      <CartProvider>
        <BookmarksProvider>
          <Header />
          <div className="container mx-auto">{children}</div>
          <Foooter />
        </BookmarksProvider>
      </CartProvider>
    </CourseProvider>
  )
}
