'use client'

import { NextUIProvider } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { createContext, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
interface IContext {
  initializing: boolean
}
export const RootContext = createContext<IContext>({
  initializing: false,
})

export default function RootProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [initializing, setInitializing] = useState(true)
  const router = useRouter()

  return (
    <RootContext.Provider
      value={{
        initializing,
      }}
    >
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          {children}
        </NextThemesProvider>
      </NextUIProvider>
    </RootContext.Provider>
  )
}
