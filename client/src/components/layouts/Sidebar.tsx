'use client'

import { useAccountContext } from '@/contexts/account'
import { dashboardNavigation } from '@/lib/constants'
import { cn, generateMediaLink } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import { Avatar, Chip, Tooltip } from '@nextui-org/react'
import { Menu, Power } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { isMobile } from 'react-device-detect'

export default function SideBar() {
  const pathname = usePathname()
  const { user } = useAccountContext()

  return (
    <div className="shadow-xl shrink-0 p-5 flex flex-col gap-8 border-r-1 dark:border-white/20 bg-background">
      {!isMobile && (
        <Link className="font-semibold text-2xl" href="/">
          DKEducation
        </Link>
      )}
      <div className="flex flex-col gap-2 flex-1">
        {dashboardNavigation.map((navigation, index) => (
          <Link
            href={navigation.pathname}
            key={index}
            className={cn(
              'flex gap-2 items-center p-3 rounded-lg dark:text-foreground',
              pathname === navigation.pathname
                ? 'bg-blue-500 font-semibold text-white/80'
                : 'hover:bg-white/10'
            )}
          >
            {navigation.icon}
            <p className="capitalize font-semibold text-sm">
              {navigation.title}
            </p>
          </Link>
        ))}
      </div>
      {user && (
        <div className="shadow-xl border dark:border-none dark:bg-neutral-800 rounded-xl p-3 flex gap-3">
          <Avatar
            size="md"
            src={generateMediaLink(user.avatar ?? '')}
            showFallback
            isBordered
            classNames={{
              base: 'ring-gold shrink-0',
            }}
          />
          <div className="-mt-1 flex-1">
            <div className="font-bold line-clamp-1">{user.username}</div>
            <div>
              <div className="flex gap-2 items-center">
                <span>{`${user.firstName ? user.firstName : ''} ${
                  user.lastName ? user.lastName : ''
                }`}</span>
                <Tooltip content="Logout">
                  <div className="text-gold cursor-pointer">
                    <Power size={18} />
                  </div>
                </Tooltip>
              </div>

              <div className="flex gap-1 mt-[2px]">
                {user.roles.map((role, index) => (
                  <Chip size="sm" key={index} color="primary" variant="dot">
                    {role.role.name}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
