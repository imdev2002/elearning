import { Button } from '@nextui-org/react'
import React from 'react'

const LearningControl = () => {
  return (
    <div className="flex justify-between h-full sticky bottom-0 bg-primary">
      <Button className="w-2/4 rounded-none border-r" color="primary">
        Prev
      </Button>
      <Button className="flex-1 rounded-none border-l" color="primary">
        Next
      </Button>
    </div>
  )
}

export default LearningControl
