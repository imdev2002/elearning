'use client'

import DeleteUser from '@/app/(manager)/users/_components/delete-user'
import EditUserModal from '@/app/(manager)/users/_components/edit-user-modal'
import { User as UserType } from '@/app/globals'
import { generateMediaLink } from '@/lib/utils'
import { AccountResType } from '@/schemaValidations/account.schema'
import { userApiRequest } from '@/services/user.service'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from '@nextui-org/react'
import { DeleteIcon, EditIcon, EyeIcon, Trash2 } from 'lucide-react'
import React from 'react'

type Props = {
  data: UserType[]
}

const columns = [
  { name: 'NAME', uid: 'name' },
  { name: 'ROLES', uid: 'roles' },
  { name: 'PHONE', uid: 'phone' },
  { name: 'STATUS', uid: 'status' },
  { name: 'ACTIONS', uid: 'actions' },
]

const UsersTable = ({ data }: Props) => {
  const renderCell = React.useCallback(
    (user: UserType, columnKey: React.Key) => {
      switch (columnKey) {
        case 'name':
          return (
            <User
              avatarProps={{
                radius: 'full',
                src: generateMediaLink(user.avatar ?? ''),
              }}
              description={user.email ?? user.username}
              name={
                user.firstName
                  ? `${user.firstName}`
                  : '' + user.lastName
                  ? ` ${user.lastName}`
                  : ''
              }
            >
              {user.email}
            </User>
          )
        case 'phone':
          return <p>{user.phone}</p>
        case 'roles':
          return (
            <div className="flex gap-2">
              {user.roles.map((role) => (
                <Chip
                  key={role.roleId}
                  className="capitalize"
                  color={user.isVerified ? 'success' : 'warning'}
                  size="sm"
                  variant="dot"
                >
                  {role.role.name}
                </Chip>
              ))}
            </div>
          )

        case 'status':
          return (
            <Chip
              className="capitalize"
              color={user.isVerified ? 'success' : 'warning'}
              size="sm"
              variant="flat"
            >
              {user.isVerified ? 'Active' : 'Not verified'}
            </Chip>
          )
        case 'actions':
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Details">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon />
                </span>
              </Tooltip>
              <EditUserModal user={user} />

              <DeleteUser user={user} />
            </div>
          )
        default:
          return <></>
      }
    },
    []
  )

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default UsersTable
