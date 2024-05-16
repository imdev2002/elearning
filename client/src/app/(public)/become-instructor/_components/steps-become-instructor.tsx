'use client'

import IdentificationCardIcon from '@/components/icons/identification-card-icon'
import NewspaperClippingIcon from '@/components/icons/newspaper-clipping-icon'
import { CirclePlay, Handshake } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const steps = [
  {
    title: '1. Apply to become instructor.',
    description: 'Fill out the application form to become an instructor.',
    icon: <NewspaperClippingIcon />,
    color: 'rgba(86, 79 , 253, 0.1)',
  },
  {
    title: '2. Setup & edit your profile.',
    description: 'Fill out the application form to become an instructor.',
    icon: <IdentificationCardIcon />,
    color: 'rgba(227, 68 , 68, 0.1)',
  },
  {
    title: '3. Create your new course.',
    description: 'Fill out the application form to become an instructor.',
    icon: <CirclePlay size={32} stroke="#FF6636" />,
    color: 'rgba(255, 102 , 54, 0.1)',
  },
  {
    title: '4. Start teaching & earning',
    description: 'Fill out the application form to become an instructor.',
    icon: <Handshake size={32} stroke="#23BD33" />,
    color: 'rgba(35, 189 , 51, 0.1)',
  },
]

const StepsBecomeInstructor = () => {
  const ref = useRef<any>(null)
  const [height, setHeight] = useState(0)
  const [offsetTop, setOffsetTop] = useState(0)
  console.log(offsetTop)

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight)
      setOffsetTop(ref.current.offsetTop)
    }
  }, [])

  return (
    <>
      <div
        className="absolute inset-x-0 bg-[#dddddd2d] dark:bg-slate-800/40"
        style={{
          height: ref.current?.clientHeight + 'px',
          top: ref.current?.offsetTop + 'px',
        }}
      ></div>
      <div className="text-center relative space-y-8 py-6" ref={ref}>
        <h3 className="font-bold text-4xl w-96 mx-auto">{`How you'll become successful instructor`}</h3>
        <div className="flex gap-4 justify-between">
          {steps.map((step, index) => (
            <div key={index} className=" space-y-2">
              <span
                className="mx-auto w-fit block p-4 rounded-md bg-opacity-10"
                style={{ background: step.color }}
              >
                {step.icon}
              </span>
              <p className="font-semibold">{step.title}</p>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default StepsBecomeInstructor
