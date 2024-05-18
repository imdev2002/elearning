'use client'

import { User } from '@/app/globals'
import { useAccountContext } from '@/contexts/account'
import { displayFullname, generateMediaLink } from '@/lib/utils'
import { Button, Chip } from '@nextui-org/react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
  data: User
}

const ProfileHeader = ({ data }: Props) => {
  const { user } = useAccountContext()
  const isInstructor = data.roles.some(
    (role) => role.role.name === 'ADMIN' || role.role.name === 'AUTHOR'
  )
  return (
    <>
      <div className="flex gap-4 items-center py-8">
        <Image
          src={generateMediaLink(data.avatar ?? '')}
          alt={data.firstName ?? ''}
          width={160}
          height={160}
          className="object-cover rounded-full aspect-square"
        />
        <div className="space-y-4">
          <p className="text-xl font-semibold">
            {displayFullname(data.firstName, data.lastName)}
          </p>
          <div className="space-x-2">
            {data.roles.map((role) => (
              <Chip key={role.id} variant="dot" color="secondary">
                {role.role.name}
              </Chip>
            ))}
          </div>
        </div>
        {user?.email === data.email && !isInstructor && (
          <Button
            as={Link}
            href="/become-instructor"
            color="secondary"
            className="flex ml-auto items-center gap-x-2"
          >
            Become Instructor
            <ArrowRight size={18} />
          </Button>
        )}
      </div>
    </>
  )
}

export default ProfileHeader
