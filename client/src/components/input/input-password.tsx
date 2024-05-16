'use client'

import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/icons/EyeIcon'
import { Input } from '@nextui-org/react'
import React, { useState } from 'react'

type InputPasswordType = {
  label?: string
  field: any
  errorMsg?: string
}

const InputPassword = ({
  label = 'Password',
  field,
  errorMsg,
  ...props
}: InputPasswordType) => {
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  return (
    <Input
      label={label}
      variant="bordered"
      errorMessage={errorMsg}
      labelPlacement="outside"
      isRequired
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? 'text' : 'password'}
      placeholder="Enter your password"
      {...field}
      {...props}
    />
  )
}

export default InputPassword
