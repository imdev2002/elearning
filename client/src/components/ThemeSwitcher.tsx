'use client'

import { DesktopIcon, MoonIcon, SunIcon } from '@/components/icons'
import { Select, SelectItem, SelectedItems } from '@nextui-org/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

type Mode = {
  id: number
  icon: JSX.Element
  name: string
}

const modes = [
  {
    id: 1,
    icon: <SunIcon />,
    name: 'light',
  },
  {
    id: 2,
    icon: <MoonIcon />,
    name: 'dark',
  },
  {
    id: 3,
    icon: <DesktopIcon />,
    name: 'system',
  },
]

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Select
      items={modes}
      placeholder="Select a user"
      labelPlacement="outside"
      className="text-base w-36"
      disallowEmptySelection
      classNames={
        {
          // base: 'max-w-xs',
          // trigger: 'h-12',
        }
      }
      defaultSelectedKeys={[
        modes.find((mode) => mode.name === theme)?.id?.toString() || '2',
      ]}
      renderValue={(items: SelectedItems<Mode>) => {
        return items.map((item) => (
          <div key={item.key} className="flex gap-2 items-center capitalize">
            {item.data?.icon}
            <div className="flex flex-col">
              <span className="text-small">{item.data?.name}</span>
            </div>
          </div>
        ))
      }}
    >
      {(mode) => (
        <SelectItem
          key={mode.id}
          textValue={mode.name}
          // className={
          //   mode.name === theme ? 'pointer-events-none opacity-50' : ''
          // }
          onClick={() => setTheme(mode.name)}
        >
          <div className="flex gap-2 items-center capitalize">
            {mode.icon}
            <div className="flex flex-col">
              <span className="text-small">{mode.name}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  )
}
