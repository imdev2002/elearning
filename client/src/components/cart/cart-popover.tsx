'use client'

import Empty from '@/components/empty'
import { useCart } from '@/contexts/cart'
import { generateMediaLink } from '@/lib/utils'
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'
import { ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const CartPopover = () => {
  const { cart } = useCart()
  return (
    <Popover placement="bottom" showArrow>
      <Badge
        color="danger"
        content={cart?.coursesOnCarts?.length}
        isInvisible={!cart?.coursesOnCarts?.length}
        shape="circle"
      >
        <PopoverTrigger>
          <ShoppingBag className="cursor-pointer" />
        </PopoverTrigger>
      </Badge>
      <PopoverContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">My cart</h3>
        {cart?.coursesOnCarts?.length > 0 ? (
          <div className="max-w-sm space-y-4">
            {cart.coursesOnCarts.map((course: any) => (
              <Link
                href={`/course/${course.courseId}`}
                key={course.courseId}
                className="flex justify-between items-center"
              >
                <div className="flex gap-2 items-center w-4/5">
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
                </div>
                <span>{'$' + course.course.priceAmount}</span>
              </Link>
            ))}
            <div className="flex justify-between items-center">
              <div className="space-x-2">
                <span>Total:</span>
                <span>{cart.coursesOnCarts.length}</span>
              </div>
              <Button
                as={Link}
                color="secondary"
                href="/cart-checkout"
                size="sm"
              >
                Go to Cart checkout
              </Button>
            </div>
          </div>
        ) : (
          <Empty />
        )}
      </PopoverContent>
    </Popover>
  )
}

export default CartPopover
