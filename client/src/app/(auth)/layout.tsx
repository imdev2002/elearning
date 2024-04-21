import { GoogleOAuthProvider } from '@react-oauth/google'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID as string}>
      {children}
    </GoogleOAuthProvider>
  )
}
