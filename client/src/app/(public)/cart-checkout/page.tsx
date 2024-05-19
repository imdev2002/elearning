'use client'

import { Heading } from '@/components/heading'
import { useCart } from '@/contexts/cart'
import { generateMediaLink } from '@/lib/utils'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import { useAsyncList } from '@react-stately/data'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const CartCheckoutPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedKeys, setSelectedKeys] = useState<any>()
  console.log('CartCheckoutPage  selectedKeys:', selectedKeys)
  const { cart } = useCart()
  const rows = cart?.coursesOnCarts?.map((course: any) => ({
    key: course.coureseId,
    name: (
      <Link
        href={'/course/' + course.courseId}
        className="flex items-center gap-2 w-fit"
      >
        <Image
          src={generateMediaLink(course.course.thumbnail ?? '')}
          alt={course.course.courseName}
          width={400}
          height={400}
          className="object-cover w-14"
        />
        <span className="line-clamp-2">{course.course.courseName}</span>
      </Link>
    ),
    price: '$' + course.course.priceAmount,
    action: <Button size="sm" color="danger"></Button>,
  }))
  // let list = useAsyncList({
  //   async load({ signal }) {
  //     return {
  //       items: cart.coursesOnCarts,
  //     }
  //   },
  //   async sort({ items, sortDescriptor }) {
  //     return {
  //       items: items.sort((a:any, b:any) => {
  //         let first = a[sortDescriptor.column]
  //         let second = b[sortDescriptor.column]
  //         let cmp =
  //           (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1

  //         if (sortDescriptor.direction === 'descending') {
  //           cmp *= -1
  //         }

  //         return cmp
  //       }),
  //     }
  //   },
  // })
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Heading title="My cart" />
        <Table
          // sortDescriptor={list.sortDescriptor}
          color={'primary'}
          selectionMode="multiple"
          defaultSelectedKeys={['2', '3']}
          aria-label="Example static collection table"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <TableHeader>
            <TableColumn>COURSE</TableColumn>
            <TableColumn>PRICE</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody items={rows}>
            {cart?.coursesOnCarts?.length > 0 ? (
              cart.coursesOnCarts.map((course: any) => (
                <TableRow key={course.id}>
                  <TableCell className="">
                    <Link
                      href={'/course/' + course.courseId}
                      className="flex items-center gap-2 w-fit"
                    >
                      <Image
                        src={generateMediaLink(course.course.thumbnail ?? '')}
                        alt={course.course.courseName}
                        width={400}
                        height={400}
                        className="object-cover w-14"
                      />
                      <span className="line-clamp-2">
                        {course.course.courseName}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>{'$' + course.course.priceAmount}</TableCell>
                  <TableCell>
                    <Button size="sm" color="danger">
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="w-fit ml-auto flex gap-2 items-center">
        <div>
          <span>Total: $109</span>
        </div>
        <Button color="primary">Checkout now</Button>
      </div>
    </div>
  )
}

export default CartCheckoutPage
