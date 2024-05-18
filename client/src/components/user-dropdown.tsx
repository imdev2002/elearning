'use client'
import ButtonLogout from '@/components/logout-button'
import { useAccountContext } from '@/contexts/account'
import { generateMediaLink } from '@/lib/utils'
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'

const UserDropdown = () => {
  const { user } = useAccountContext()
  const { push } = useRouter()
  if (!user) return
  const { avatar, email } = user
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          size="sm"
          as="button"
          color="secondary"
          className="transition-transform"
          src={
            generateMediaLink(avatar ?? '') ||
            'https://i.pravatar.cc/150?u=a042581f4e29026704d'
          }
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{email}</p>
        </DropdownItem>
        <DropdownItem
          key="settings"
          onClick={() => push(`/profile/${user.id}`)}
        >
          My Profile
        </DropdownItem>
        {/* <DropdownItem key="analytics">Analytics</DropdownItem>
        <DropdownItem key="system">System</DropdownItem>
        <DropdownItem key="configurations">Configurations</DropdownItem> */}
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
        <DropdownItem key="logout" color="danger">
          <ButtonLogout />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default UserDropdown
