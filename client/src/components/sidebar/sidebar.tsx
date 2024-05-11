import React from 'react'
import { Sidebar } from './sidebar.styles'
import { Avatar, NavbarBrand, Tooltip } from '@nextui-org/react'
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

export const SidebarWrapper = () => {
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useSidebarContext()

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
              {/* <SidebarItem
                isActive={pathname === '/accounts'}
                title="Accounts"
                icon={<AccountsIcon />}
                href="accounts"
              /> */}
              {/* <SidebarItem
                isActive={pathname === '/payments'}
                title="Payments"
                icon={<PaymentsIcon />}
              />
              <CollapseItems
                icon={<BalanceIcon />}
                items={['Banks Accounts', 'Credit Cards', 'Loans']}
                title="Balances"
              />
              <SidebarItem
                isActive={pathname === '/customers'}
                title="Customers"
                icon={<CustomersIcon />}
              />
              <SidebarItem
                isActive={pathname === '/products'}
                title="Products"
                icon={<ProductsIcon />}
              />
              <SidebarItem
                isActive={pathname === '/reports'}
                title="Reports"
                icon={<ReportsIcon />}
              /> */}
            </SidebarMenu>

            <SidebarMenu title="General">
              <SidebarItem
                isActive={pathname === '/settings'}
                title="Settings"
                icon={<SettingsIcon />}
              />
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={'Settings'} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={'Adjustments'} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={'Profile'} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  )
}
