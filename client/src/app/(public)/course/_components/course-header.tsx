'use client'

import { Course } from '@/app/globals'
import FiveStars from '@/components/course/five-stars'
import { displayFullname, generateMediaLink } from '@/lib/utils'
import { Avatar } from '@nextui-org/react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type Props = {
  data: Course
}

const CourseHeader = ({ data }: Props) => {
  const { user, courseName, avgRating } = data
  const headerRef = useRef<any>(null)
  const [headerHeight, setHeaderHeight] = useState(0)
  const [headerOffsetTop, setHeaderOffsetTop] = useState(0)

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight)
      setHeaderOffsetTop(headerRef.current.offsetTop)
    }
  }, [])
  return (
    <>
      <div
        className="absolute inset-x-0 bg-[#dddddd2d] dark:bg-slate-800/40"
        style={{
          height: headerHeight + 'px',
          top: headerOffsetTop + 'px',
        }}
      ></div>
      <div
        ref={headerRef}
        className="course-header lg:w-2/3 space-y-4 py-8 relative"
      >
        <h3 className="text-2xl lg:text-4xl font-bold">{courseName}</h3>
        <div className="flex justify-between items-center">
          <Link
            href={`/profile/${user.id}`}
            className="flex gap-2 items-center"
          >
            <Avatar
              src={generateMediaLink(user.avatar ?? '')}
              size="sm"
              color="secondary"
              isBordered
            />
            <span className="text-sm">
              {displayFullname(user.firstName, user.lastName)}
            </span>
          </Link>
          <FiveStars starRated={avgRating} />
        </div>
      </div>
    </>
  )
}

export default CourseHeader
