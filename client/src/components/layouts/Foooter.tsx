import { Heading } from '@/components/heading'
import { GraduationCap } from '@/components/icons/graduation-cap'
import { Button } from '@nextui-org/react'
import { Facebook, Instagram, Youtube } from 'lucide-react'
import Link from 'next/link'

const Foooter = () => {
  return (
    <>
      <div className="py-8 border-y mt-8">
        <div className="grid xl:grid-cols-4 gap-12 container mx-auto ">
          <div className="space-y-2">
            <div className="space-y-2">
              <Link
                href="/"
                className="flex gap-2 items-center p-2 border rounded-md w-fit mx-auto"
              >
                <GraduationCap size={32} />
                <p className="font-bold text-inherit text-xl uppercase">
                  DangKhai
                </p>
              </Link>
              <p className="text-center text-default-400 text-sm">
                Learn a New Skill Everyday, Anytime, and Anywhere.
              </p>
            </div>
            <div className="flex gap-4 flex-wrap mx-auto w-fit">
              <Button
                size="sm"
                className="flex items-center gap-x-2"
                isIconOnly
              >
                <Facebook size={16} />
              </Button>
              <Button
                size="sm"
                className="flex items-center gap-x-2"
                isIconOnly
              >
                <Youtube size={16} />
              </Button>
              <Button
                size="sm"
                className="flex items-center gap-x-2"
                isIconOnly
              >
                <Instagram size={16} />
              </Button>
            </div>
          </div>
          <div>
            <Heading title="CATEGORY" className="text-base mb-2" />
            <ul>
              <li>Development</li>
              <li>Language</li>
              <li>IT</li>
              <li>Helth</li>
            </ul>
          </div>
          <div>
            <Heading title="QUICK LINKS" className="text-base mb-2" />
            <ul>
              <li>Development</li>
              <li>Development</li>
              <li>Development</li>
              <li>Development</li>
            </ul>
          </div>
          <div>
            <Heading title="SUPPORT" className="text-base mb-2" />
            <ul>
              <li>Help Center</li>
              <li>FAQs</li>
              <li>Terms & Condition</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="py-2 text-center text-sm">
        © 2024 - DangKhai Education. All rights reserved
      </div>
    </>
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
