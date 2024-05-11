import { GraduationCap } from '@/components/icons/graduation-cap'
import { Button } from '@nextui-org/react'
import Link from 'next/link'

const Foooter = () => {
  return (
    <div className="py-8 border-t mt-8">
      <div className="grid xl:grid-cols-4 gap-12 container mx-auto ">
        <div>
          <Link
            href="/"
            className="flex gap-2 items-center p-2 border rounded-md w-fit"
          >
            <GraduationCap size={32} />
            <p className="font-bold text-inherit text-xl uppercase">DangKhai</p>
          </Link>
          <div className="flex gap-4 flex-wrap">
            <Button>Facebook</Button>
            <Button>Facebook</Button>
            <Button>Facebook</Button>
            <Button>Facebook</Button>
          </div>
        </div>
        <div>
          <h3 className="text-lg uppercase">Category</h3>
          <ul>
            <li>Development</li>
            <li>Development</li>
            <li>Development</li>
            <li>Development</li>
          </ul>
        </div>
        <div>
          <h3>Category</h3>
          <ul>
            <li>Development</li>
            <li>Development</li>
            <li>Development</li>
            <li>Development</li>
          </ul>
        </div>
        <div>
          <h3>Category</h3>
          <ul>
            <li>Development</li>
            <li>Development</li>
            <li>Development</li>
            <li>Development</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Foooter

const FooterItem = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold">Title</h3>
      <Link className="block" href="#">
        About
      </Link>
      <Link className="block" href="#">
        About
      </Link>
      <Link className="block" href="#">
        About
      </Link>
      <Link className="block" href="#">
        About
      </Link>
      <Link className="block" href="#">
        About
      </Link>
      <Link className="block" href="#">
        About
      </Link>
    </div>
  )
}
