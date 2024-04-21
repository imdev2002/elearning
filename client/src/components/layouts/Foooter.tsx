import { Button } from '@nextui-org/react'
import Link from 'next/link'

const Foooter = () => {
  return (
    <div className="grid grid-cols-4 gap-12 container mx-auto">
      <div>
        <h2>DKEducation</h2>
        <p>
          Aliquam rhoncus ligula est, non pulvinar elit convallis nec. Donec
          mattis odio at.
        </p>
        <div className="flex gap-4">
          <Button>Facebook</Button>
          <Button>Facebook</Button>
          <Button>Facebook</Button>
          <Button>Facebook</Button>
        </div>
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
