'use client'

import { useAccountContext } from '@/contexts/account'
import { userApiRequest } from '@/services/user.service'
import { createContext, useContext, useEffect, useState } from 'react'

type CourseContextType = {
  progress: any
  setProgress: (progress: any) => void
  setCourseRefresh: (val: any) => void
}

const CartContext = createContext<CourseContextType>({
  progress: [],
  setProgress: () => {},
  setCourseRefresh: () => {},
})
function CourseProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAccountContext()
  const [courseRefresh, setCourseRefresh] = useState(false)
  const [progress, setProgress] = useState<any>()
  useEffect(() => {
    if (user?.email)
      (async () => {
        const res = await userApiRequest.getCourseProgress()
        if (res.status === 200) setProgress(res.payload)
      })()
  }, [courseRefresh])
  return (
    <CartContext.Provider value={{ progress, setProgress, setCourseRefresh }}>
      {children}
    </CartContext.Provider>
  )
}

function useCourse() {
  const context = useContext(CartContext)
  if (typeof context === 'undefined')
    throw new Error('useDropdown must be used within CourseProvider')
  return context
}
export { useCourse, CourseProvider }
