import Foooter from '@/components/layouts/Foooter'
import Header from '@/components/layouts/Header'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <div className="container mx-auto">{children}</div>
      <Foooter />
    </>
  )
}
