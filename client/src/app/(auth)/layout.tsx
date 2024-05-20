import { GraduationCap } from '@/components/icons/graduation-cap'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID as string}>
      {children}
      <Link
        href="/"
        className="flex gap-2 items-center p-2 border rounded-md absolute top-6 left-6 z-50"
      >
        <GraduationCap size={32} />
        <p className="font-bold text-inherit text-xl uppercase">DangKhai</p>
      </Link>
    </GoogleOAuthProvider>
  )
}
