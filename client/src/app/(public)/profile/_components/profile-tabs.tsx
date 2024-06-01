'use client'

import CoursesTab from '@/app/(public)/profile/_components/courses-tab'
import WishListTab from '@/app/(public)/profile/_components/wish-list-tab'
import { User } from '@/app/globals'
import ProfileForm from '@/components/forms/profile-form'
import { useAccountContext } from '@/contexts/account'
import { coursePublicApiRequests } from '@/services/course.service'
import { Tab, Tabs } from '@nextui-org/react'
import { format } from 'date-fns'
import { Cake, CircleUserRound, Contact, Mail, Phone } from 'lucide-react'
import React, { useEffect } from 'react'

type Props = {
  data: User
}

const ProfileTabs = ({ data }: Props) => {
  const { user } = useAccountContext()
  const isMe = user?.email === data.email
  const isInstructor = data.roles.some(
    (role) => role.role.name === 'ADMIN' || role.role.name === 'AUTHOR'
  )
  const [coursesByAuthor, setCoursesByAuthor] = React.useState<any>([])
  useEffect(() => {
    const fetchCoursesOwn = async () => {
      try {
        const res = await coursePublicApiRequests.getList(
          `?byAuthor=${data.id}&myOwn=${isMe}`
        )
        if (res.status === 200) setCoursesByAuthor(res.payload)
      } catch (error) {}
    }
    if (isInstructor) fetchCoursesOwn()
  }, [])
  return (
    <Tabs
      aria-label="Options"
      classNames={{
        base: 'w-full mb-6',
        tabList: 'w-full max-w-full',
      }}
    >
      {(isMe || isInstructor) && (
        <Tab key="courses" title="Courses">
          <CoursesTab profile={data} />
        </Tab>
      )}
      {isMe && (
        <Tab key="wish-list" title="Wish list">
          <WishListTab />
        </Tab>
      )}
      <Tab key="setting" title={isMe ? 'Setting' : 'Information'}>
        {isMe ? (
          <ProfileForm data={data} />
        ) : (
          <InformationReadOnly data={data} />
        )}
      </Tab>
    </Tabs>
  )
  // ) : isInstructor ? (
  //   <Tabs
  //     aria-label="Options"
  //     classNames={{
  //       base: 'w-full mb-6',
  //       tabList: 'w-full max-w-full',
  //     }}
  //   >
  //     <Tab key="courses" title="Courses">
  //       <CoursesTab profile={data} />
  //     </Tab>
  //     <Tab key="videos" title="Infomation">
  //       <ProfileForm data={data} />
  //     </Tab>
  //   </Tabs>
  // ) : null
}

export default ProfileTabs

const InformationReadOnly = ({ data }: { data: User }) => {
  const { username, birthday, phone, email } = data
  return (
    <div className="space-y-4 divide-y-1 mx-auto w-fit">
      <div className="flex gap-2 items-center pt-4">
        <span className="flex gap-2 items-center">
          <CircleUserRound />
          <p>User name:</p>
        </span>
        <p>{username}</p>
      </div>
      <div className="flex gap-2 items-center pt-4">
        <span className="flex gap-2 items-center">
          <Cake />
          <p>Birth day:</p>
        </span>
        <p>
          {format(birthday ? new Date(birthday) : new Date(), 'MM/dd/yyyy')}
        </p>
      </div>
      <div className="flex gap-2 items-center pt-4">
        <span className="flex gap-2 items-center">
          <Contact />
          <p>Phone:</p>
        </span>
        <p>{phone}</p>
      </div>
      <div className="flex gap-2 items-center pt-4">
        <span className="flex gap-2 items-center">
          <Mail />
          <p>Email:</p>
        </span>
        <p>{email}</p>
      </div>
    </div>
  )
}
