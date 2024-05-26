'use client'

import { CATEGORIES } from '@/lib/constants'
import { Radio, RadioGroup, Select, SelectItem } from '@nextui-org/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}
const SearchPage = ({ searchParams }: Props) => {
  const { keyword } = searchParams
  const params = new URLSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [sortBy, setSortBy] = useState<string>('newest')
  const [selected, setSelected] = useState('london')
  params.append('keyword', keyword as string)
  params.append('orderby', sortBy)
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
    params.set('orderby', e.target.value)
    replace(`${pathname}?${params.toString()}`)
  }
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.value)
    params.set('category', e.target.value)
    replace(`${pathname}?${params.toString()}`)
  }
  return (
    <>
      <p className="text-4xl text-center font-semibold mt-10">{`Results for "${keyword}"`}</p>
      <div className="flex gap-8 w-full my-10">
        <div className="w-1/4 border-r">
          <RadioGroup
            label="Filter by category"
            value={selected}
            // onValueChange={setSelected}
            onChange={handleCategoryChange}
          >
            <Radio size="md" value="">
              All
            </Radio>
            {CATEGORIES.map((category, index) => (
              <Radio size="md" key={index} value={category.value}>
                {category.name}
              </Radio>
            ))}
          </RadioGroup>
        </div>
        <div className="flex-1">
          <Select
            size="sm"
            label="Sort by"
            placeholder="Sort by"
            className="max-w-xs ml-auto flex items-center"
            labelPlacement="outside-left"
            value={sortBy}
            onChange={handleSelectionChange}
            disallowEmptySelection
            defaultSelectedKeys={[sortBy]}
            classNames={{
              label: 'w-20 text-sm',
            }}
          >
            <SelectItem key="newest" value="newest">
              Newest
            </SelectItem>
            <SelectItem key="rating" value="rating">
              Highest Rating
            </SelectItem>
            <SelectItem key="lowest-price" value="lowest-price">
              Lowest Price
            </SelectItem>
            <SelectItem key="highest-price" value="highest-price">
              Highest Price
            </SelectItem>
          </Select>

          {/* <Link href={params.toString()}>keyword: {keyword}</Link> */}
        </div>
      </div>
    </>
  )
}

export default SearchPage
