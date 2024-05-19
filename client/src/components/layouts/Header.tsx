'use client'

import CartPopover from '@/components/cart/cart-popover'
import { GraduationCap } from '@/components/icons/graduation-cap'
import { SearchIcon } from '@/components/icons/searchicon'
import SearchCourse from '@/components/search/search-course'
import { ThemeSwitcher } from '@/components/theme-swicher'
import UserDropdown from '@/components/user-dropdown'
import { useAccountContext } from '@/contexts/account'
import { CATEGORIES } from '@/lib/constants'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const menuItems = [
  'Profile',
  'Dashboard',
  'Activity',
  'Analytics',
  'System',
  'Deployments',
  'My Settings',
  'Team Settings',
  'Help & Feedback',
  'Log Out',
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useAccountContext()
  const isManager =
    user &&
    user.roles.some(
      (role) => role.role.name === 'ADMIN' || role.role.name === 'AUTHOR'
    )
  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="lg:[&>header]:max-w-full lg:[&>header]:px-40"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
        {/* <NavbarBrand>
          <Link
            href="/"
            className="flex gap-2 items-center p-2 border rounded-md"
          >
            <GraduationCap size={32} />
            <p className="font-bold text-inherit text-xl uppercase">DangKhai</p>
          </Link>
        </NavbarBrand> */}
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        {/* <NavbarBrand>
          <Link
            href="/"
            className="flex gap-2 items-center p-2 border rounded-md"
          >
            <GraduationCap size={32} />
            <p className="font-bold text-inherit text-xl uppercase">DangKhai</p>
          </Link>
        </NavbarBrand> */}
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <Link
            href="/"
            className="flex gap-2 items-center p-2 border rounded-md"
          >
            <GraduationCap size={32} />
            <p className="font-bold text-inherit text-xl uppercase">DangKhai</p>
          </Link>
          {/* <p className="font-bold text-inherit">ACME</p> */}
        </NavbarBrand>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                endContent={<ChevronDown size={18} />}
                radius="sm"
                variant="light"
              >
                Categories
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="ACME categories"
            className="w-[340px]"
            itemClasses={{
              base: 'gap-4',
            }}
          >
            {CATEGORIES.map((category, index) => (
              <DropdownItem
                key={index}
                // description="ACME scales apps to meet user demand, automagically, based on load."
                as={Link}
                href={`${category.path}`}
                startContent={category.icon}
              >
                {category.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {/* <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem> */}
        {isManager && (
          <NavbarItem>
            <Link color="foreground" href="/dashboard">
              Dashboard
            </Link>
          </NavbarItem>
        )}
        <NavbarItem>
          <SearchCourse />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <ThemeSwitcher />
        <CartPopover />
        {user ? (
          <NavbarItem>
            <UserDropdown />
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="/register"
                variant="solid"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? 'warning'
                  : index === menuItems.length - 1
                  ? 'danger'
                  : 'foreground'
              }
              href="#"
              // size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}

export default Header
