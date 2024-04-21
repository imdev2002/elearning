import CourseForm from '@/app/(manager)/my-courses/_components/course-form'
import { GraduationCap } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div className="bg-neutral-900 rounded-xl h-full">
      <h1 className="text-primary font-bold px-3 py-2 border-b-1 border-neutral-800 flex items-center gap-2">
        <GraduationCap />
        Create Course
      </h1>
      <div className="p-5">
        <CourseForm />
      </div>
    </div>
  )
}

export default page
