'use client'

import { Part } from '@/app/globals'
import ListPartsAccordion from '@/components/course/list-parts-accordion'
import { cn } from '@/lib/utils'
import { Accordion, AccordionItem, Button } from '@nextui-org/react'
import { File, Lock, Play } from 'lucide-react'
import React from 'react'

type Props = {
  data: Part[]
  isAuth?: boolean
}

const LearningSidebar = ({ data, isAuth = false }: Props) => {
  return (
    <div className="flex-1">
      <ListPartsAccordion data={data} />
    </div>
  )
}

export default LearningSidebar
