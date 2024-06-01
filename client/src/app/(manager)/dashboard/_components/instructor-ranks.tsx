'use client'

import { displayFullname, generateMediaLink } from '@/lib/utils'
import { Avatar, Card, CardBody, Tab, Tabs } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const items = [
  {
    name: 'Jose Perez',
    picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    amount: '4500 USD',
    date: '9/20/2021',
  },
  {
    name: 'Jose Perez',
    picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    amount: '4500 USD',
    date: '9/20/2021',
  },
  {
    name: 'Jose Perez',
    picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    amount: '4500 USD',
    date: '9/20/2021',
  },
  {
    name: 'Jose Perez',
    picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    amount: '4500 USD',
    date: '9/20/2021',
  },
  {
    name: 'Jose Perez',
    picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    amount: '4500 USD',
    date: '9/20/2021',
  },
]

type Props = {
  data: any
}

const currentMonth =
  String(new Date().getMonth() + 1).length === 1
    ? '0' + (new Date().getMonth() + 1)
    : new Date().getMonth() + 1

export const InstructorRanks = ({ data }: Props) => {
  const [selected, setSelected] = React.useState('month')
  const { replace } = useRouter()
  // const [currentTime, setCurrentTime] = React.useState<any>()
  const currentTime =
    new Date().getFullYear() + (selected === 'month' ? '-' + currentMonth : '')
  const instructorsRank = data[currentTime]
  React.useEffect(() => {
    replace(`?topInstructorsBy=${selected}`)
    // setCurrentTime(
    //   new Date().getFullYear() +
    //     (selected === 'month' ? '-' + currentMonth : '')
    // )
  }, [selected])
  return (
    <Card className=" bg-default-50 rounded-xl shadow-md px-3">
      <CardBody className="py-5 gap-4">
        <div className="flex gap-2.5 justify-center">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">
              Top Instructors
            </span>
          </div>
        </div>

        <Tabs
          aria-label="Options"
          className="w-full"
          classNames={{
            base: 'w-full',
            tabList: 'w-full max-w-full',
          }}
          selectedKey={selected}
          //@ts-ignore
          onSelectionChange={setSelected}
        >
          <Tab key="month" title="Month"></Tab>
          <Tab key="year" title="Year"></Tab>
        </Tabs>
        <div className="flex flex-col gap-6 w-full">
          {data[currentTime]?.map((item: any) => (
            <div key={item.name} className="flex justify-between">
              <div className="flex gap-2 items-center">
                <div className="">
                  <Avatar
                    isBordered
                    color="secondary"
                    size="sm"
                    src={
                      generateMediaLink(item?.author?.avatar) ??
                      'https://i.pravatar.cc/150?u=a042581f4e29026024d'
                    }
                  />
                </div>

                <span className="text-default-900 text-sm font-semibold">
                  {displayFullname(
                    item.author?.firstName,
                    item.author?.lastName
                  )}
                </span>
              </div>
              <div>
                <span className="text-success text-sm">
                  {item.revenue + 'USD'}
                </span>
                <span className="text-default-500 text-xs">({item.total})</span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
