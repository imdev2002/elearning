'use client'

import CoursesTab from '@/app/(public)/profile/_components/courses-tab'
import WishListTab from '@/app/(public)/profile/_components/wish-list-tab'
import { User } from '@/app/globals'
import ProfileForm from '@/components/forms/profile-form'
import { useAccountContext } from '@/contexts/account'
import { coursePublicApiRequests } from '@/services/course.service'
import { Tab, Tabs } from '@nextui-org/react'
import React, { useEffect } from 'react'

type Props = {
  data: User
}

const ProfileTabs = ({ data }: Props) => {
  const { user } = useAccountContext()
  const isMe = user?.email === data.email
  const isInstructor = data.roles.some((role) => role.role.name === 'ADMIN')
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
  return !isMe ? (
    <Tabs
      aria-label="Options"
      classNames={{
        base: 'w-full mb-6',
        tabList: 'w-full max-w-full',
      }}
    >
      <Tab key="courses" title="Courses">
        <CoursesTab profile={data} />
      </Tab>
      <Tab key="music" title="Wish list">
        <WishListTab />
      </Tab>
      <Tab key="videos" title="Setting">
        <ProfileForm data={data} />
      </Tab>
    </Tabs>
  ) : isInstructor ? (
    <Tabs
      aria-label="Options"
      classNames={{
        base: 'w-full mb-6',
        tabList: 'w-full max-w-full',
      }}
    >
      <Tab key="courses" title="Courses">
        <CoursesTab profile={data} />
      </Tab>
      <Tab key="videos" title="Infomation">
        <ProfileForm data={data} />
      </Tab>
    </Tabs>
  ) : null
}

export default ProfileTabs

const InformationReadOnly = ({ data }: { data: any }) => {
  return
}
