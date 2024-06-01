import React from 'react'
import { Sidebar } from './sidebar.styles'
import { Avatar, Chip, NavbarBrand, Tooltip } from '@nextui-org/react'
import { CompaniesDropdown } from './companies-dropdown'
import { HomeIcon } from '../icons/sidebar/home-icon'
import { PaymentsIcon } from '../icons/sidebar/payments-icon'
import { BalanceIcon } from '../icons/sidebar/balance-icon'
import { AccountsIcon } from '../icons/sidebar/accounts-icon'
import { CustomersIcon } from '../icons/sidebar/customers-icon'
import { ProductsIcon } from '../icons/sidebar/products-icon'
import { ReportsIcon } from '../icons/sidebar/reports-icon'
import { DevIcon } from '../icons/sidebar/dev-icon'
import { ViewIcon } from '../icons/sidebar/view-icon'
import { SettingsIcon } from '../icons/sidebar/settings-icon'
import { CollapseItems } from './collapse-items'
import { SidebarItem } from './sidebar-item'
import { SidebarMenu } from './sidebar-menu'
import { FilterIcon } from '../icons/sidebar/filter-icon'
import { ChangeLogIcon } from '../icons/sidebar/changelog-icon'
import { usePathname } from 'next/navigation'
import { useSidebarContext } from '@/components/layouts/layout-manager-context'
import { GraduationCap } from '@/components/icons/graduation-cap'
import { dashboardNavigation } from '@/lib/constants'
import Link from 'next/link'
import { Power } from 'lucide-react'
import { useAccountContext } from '@/contexts/account'
import { generateMediaLink } from '@/lib/utils'

export const SidebarWrapper = () => {
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useSidebarContext()
  const { user } = useAccountContext()

  const isAdmin = user?.roles
    ? user.roles.some((role) => role.role.name === 'ADMIN')
    : false

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <Link href="/" className={Sidebar.Header()}>
          <GraduationCap size={32} />
          <p className="font-bold text-inherit text-xl">Dang Khai</p>
        </Link>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            {isAdmin ? (
              <>
                <SidebarItem
                  title="Dashboard"
                  icon={<HomeIcon />}
                  isActive={pathname === '/dashboard'}
                  href="/dashboard"
                />
                <SidebarMenu title="Manage">
                  {dashboardNavigation.map((item, index) => (
                    <SidebarItem
                      key={index}
                      isActive={pathname === item.pathname}
                      title={item.title}
                      icon={item.icon}
                      href={item.pathname}
                    />
                  ))}
                </SidebarMenu>
              </>
            ) : (
              <SidebarMenu title="Manage">
                <SidebarItem
                  isActive={pathname === '/my-courses'}
                  title="My courses"
                  icon={<ViewIcon />}
                  href="/my-courses"
                />
              </SidebarMenu>
            )}

            <SidebarMenu title="General">
              <SidebarItem
                isActive={pathname === '/settings'}
                title="Settings"
                icon={<SettingsIcon />}
                href={`profile/${user?.id}`}
              />
            </SidebarMenu>
          </div>
          {user && (
            <div className="shadow-xl border dark:border-none dark:bg-neutral-800 rounded-xl p-3 flex gap-3 w-full">
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
      </div>
    </aside>
  )
}
