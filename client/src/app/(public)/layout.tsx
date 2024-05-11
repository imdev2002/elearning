'use client'
import Foooter from '@/components/layouts/Foooter'
import Header from '@/components/layouts/Header'
import { use, useEffect, useState } from 'react'

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
    <>
      <Header />
      <div className="container mx-auto">{children}</div>
      <Foooter />
    </>
  )
}
