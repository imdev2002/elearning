import Image from 'next/image'
import React from 'react'

const Empty = () => {
  return (
    <div>
      <Image
        src="/images/box-empty.png"
        alt="Empty"
        width={500}
        height={500}
        className="object-cover mx-auto mb-8 w-72"
      />
      <p className="text-center text-2xl font-semibold">Empty</p>
    </div>
  )
}

export default Empty
