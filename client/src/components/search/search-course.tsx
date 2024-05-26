'use client'

import { SearchIcon } from '@/components/icons/searchicon'
import { Input } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const SearchCourse = () => {
  const { push } = useRouter()
  const [keyword, setKeyword] = React.useState('')
  return (
    <div>
      <Input
        startContent={<SearchIcon />}
        isClearable
        className="w-full"
        classNames={{
          input: 'w-full',
          mainWrapper: 'w-full',
        }}
        value={keyword}
        onValueChange={setKeyword}
        placeholder="Search..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            push(`/search?keyword=${keyword}&orderby=newest`)
          }
        }}
      />
    </div>
  )
}

export default SearchCourse
