import UsersTable from '@/app/(manager)/users/_components/users-table'
import { Heading } from '@/components/heading'
import { AccountsIcon } from '@/components/icons/sidebar/accounts-icon'
import { userApiRequest } from '@/services/user.service'
import { UserRoundCog } from 'lucide-react'
import { cookies } from 'next/headers'
import React from 'react'

const defaultParams = {
  limit: 20,
  offset: 0,
}

const page = async () => {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const { payload: listUser } = await userApiRequest.getList(
    defaultParams,
    accessToken
  )
  console.log(listUser)
  return (
    <>
      <Heading icon={<AccountsIcon />} title="Users" />
      <div className="p-5">
        <UsersTable data={listUser} />
      </div>
    </>
  )
}

export default page
