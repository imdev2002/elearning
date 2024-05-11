'use client'

import MobileHeaderDashboard from '@/components/layouts/MobileHeaderDashboard'
import SideBar from '@/components/layouts/Sidebar'
import { SidebarContext } from '@/components/layouts/layout-manager-context'
import { NavbarWrapper } from '@/components/navbar/navbar'
import { SidebarWrapper } from '@/components/sidebar/sidebar'
import { useLockedBody } from '@/hooks/useBodyLock'
import { useState } from 'react'
import { isMobile } from 'react-device-detect'

export default function ManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // if (isMobile) {
  //   return (
  //     <div className="min-h-screen">
  //       <MobileHeaderDashboard />
  //       <div className="p-5">{children}</div>
  //     </div>
  //   )
  // }
  // return (
  //   <div className="min-h-screen flex overflow-hidden">
  //     <SideBar />
  //     <div className="flex-1 p-5 h-screen overflow-auto">
  //       <div className="bg-primary-foreground dark:bg-neutral-900 rounded-xl shadow-xl h-full border dark:border-none">
  //         {children}
  //       </div>
  //     </div>
  //   </div>
  // )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [_, setLocked] = useLockedBody(false)
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    setLocked(!sidebarOpen)
  }
  return (
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}
    >
      <section className="flex">
        <SidebarWrapper />
        <NavbarWrapper>
          <section className="p-6">{children}</section>
        </NavbarWrapper>
      </section>
    </SidebarContext.Provider>
  )
}
