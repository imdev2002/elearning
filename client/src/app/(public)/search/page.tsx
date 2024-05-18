'use client'

import { Select, SelectItem } from '@nextui-org/react'
import Link from 'next/link'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}
const page = ({ searchParams }: Props) => {
  const { search } = searchParams
  const params = new URLSearchParams()
  params.append('search', search as string)
  params.append('tesst', 'ac')
  return (
    <div>
      <Select
        label="Favorite Animal"
        placeholder="Select an animal"
        disabledKeys={[
          'zebra',
          'tiger',
          'lion',
          'elephant',
          'crocodile',
          'whale',
        ]}
        className="max-w-xs"
      >
        <SelectItem key="newest" value="">
          Newest
        </SelectItem>
        <SelectItem key="newest" value="">
          Newest
        </SelectItem>
      </Select>
      keyword: {search}
      <Link href={params.toString()}>click</Link>
    </div>
  )
}

export default page
