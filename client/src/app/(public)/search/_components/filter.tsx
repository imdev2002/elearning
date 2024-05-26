'use client'

import { Course } from '@/app/globals'
import CourseCard from '@/components/course/course-card'
import Empty from '@/components/empty'
import { CATEGORIES } from '@/lib/constants'
import {
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from '@nextui-org/react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  data: any
}
const Filter = ({ data }: Props) => {
  const searchParams = useSearchParams()
  const params = new URLSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [sortBy, setSortBy] = useState<string>('newest')
  let keyword = searchParams.get('keyword')
  let categories = searchParams.get('categories')
  console.log('Filter  categories:', categories)
  const [selected, setSelected] = useState(categories?.split(',') ?? [])
  params.append('keyword', keyword as string)
  params.append('orderby', sortBy)
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
    params.set('orderby', e.target.value)
    replace(`${pathname}?${params.toString()}`)
  }
  // const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelected(e.target.value)
  //   params.set('category', e.target.value)
  //   replace(`${pathname}?${params.toString()}`)
  // }
  useEffect(() => {
    if (selected.length > 0) {
      params.set('categories', selected.join(','))
      replace(`${pathname}?${params.toString()}`)
    }
  }, [JSON.stringify(selected)])
  return (
    <>
      <p className="text-4xl text-center font-semibold mt-10">{`Results for "${keyword}"`}</p>
      <div className="flex gap-8 w-full my-10">
        <div className="w-1/5 border-r">
          <CheckboxGroup
            label="Filter by categories"
            color="primary"
            value={selected}
            onValueChange={setSelected}
          >
            {CATEGORIES.map((category, index) => (
              <Checkbox key={index} value={category.value}>
                {category.name}
              </Checkbox>
            ))}
          </CheckboxGroup>
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
          {data.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 mt-10">
              {data.map((course: any) => (
                <CourseCard key={course.id} data={course} />
              ))}
            </div>
          ) : (
            <div className="mx-auto w-fit block mt-10">
              <Empty />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Filter
