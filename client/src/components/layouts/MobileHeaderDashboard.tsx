'use client'

import SideBar from '@/components/layouts/Sidebar'
import { Transition } from '@headlessui/react'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

const MobileHeaderDashboard = () => {
  const [showing, setShowing] = useState(false)
  return (
    <div className="sticky top-0 z-50">
      <div className="px-5 py-3 flex border-b-1 border-white/20 items-center gap-5 w-full relative z-10 bg-black">
        <span
          className="[&>svg]:w-7 [&>svg]:h-7"
          onClick={() => setShowing(!showing)}
        >
          <Menu />
        </span>
        <Link href="/">
          <h1>DKEducation</h1>
        </Link>
      </div>
      <Transition
        show={showing}
        className="absolute top-full left-0 h-[calc(100dvh-67px)]"
      >
        {/* Background overlay */}
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setShowing(false)}
          />
        </Transition.Child>

        {/* Sliding sidebar */}
        <Transition.Child
          className="w-fit relative h-full flex"
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <SideBar />
        </Transition.Child>
      </Transition>
    </div>
  )
}

export default MobileHeaderDashboard
