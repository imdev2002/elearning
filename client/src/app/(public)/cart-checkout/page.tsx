'use client'

import { Heading } from '@/components/heading'
import { useCart } from '@/contexts/cart'
import { generateMediaLink } from '@/lib/utils'
import { cartApiRequest } from '@/services/cart.service'
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
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'

const CartCheckoutPage = () => {
  const { refresh } = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { setCartRefresh } = useCart()
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]))
  const { cart } = useCart()
  const totalPrice = cart?.coursesOnCarts
    ?.filter((item: any) =>
      [...selectedKeys].map(Number)?.includes(item.courseId)
    )
    ?.reduce((acc: number, course: any) => acc + course.course.priceAmount, 0)

  const removeItem = async (courseIds: number[]) => {
    try {
      const res = await cartApiRequest.remove(courseIds)
      if (res.status === 200) {
        setCartRefresh((prev: boolean) => !prev)
      }
    } catch (error) {}
  }
  const checkoutCart = async () => {
    try {
      setIsLoading(true)
      const data =
        selectedKeys === 'all'
          ? cart?.coursesOnCarts?.map((course: any) => course.courseId)
          : [...selectedKeys]
      const res = await cartApiRequest.checkout(data.map(Number))
      if (res.status === 200) {
        if ((res.payload as { url: string }).url) {
          window.location.href = (res.payload as { url: string }).url
        } else {
          toast.success('Buy course successfully')
          refresh()
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }
  if (!cart) return
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
  console.log(cart?.coursesOnCarts)
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
            <TableColumn key="courseName">COURSE</TableColumn>
            <TableColumn key="priceAmount">PRICE</TableColumn>
            <TableColumn key="cartAction">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody items={rows}>
            {cart?.coursesOnCarts?.length > 0 ? (
              cart.coursesOnCarts.map((course: any) => (
                <TableRow key={course.courseId}>
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
                    <Button
                      size="sm"
                      color="danger"
                      onClick={() => removeItem([parseInt(course.courseId)])}
                    >
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
          <span>{`Total: $${totalPrice}`}</span>
        </div>
        <Button color="primary" onClick={checkoutCart}>
          Pay now
        </Button>
      </div>
    </div>
  )
}

export default CartCheckoutPage
