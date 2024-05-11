'use client'

import { generateMediaLink } from '@/lib/utils'
import { Button } from '@nextui-org/react'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { Controller } from 'react-hook-form'

type ImageUploadPropsType = {
  name: string
  form?: any
  type?: 'video' | 'image'
}

const FileUpload = ({ name, form, type = 'image' }: ImageUploadPropsType) => {
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const data = form.watch(name)
  return (
    <div>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <input
            id={name}
            className="hidden"
            type="file"
            accept={type === 'video' ? 'video/*' : 'image/*'}
            ref={inputRef}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setFile(file)
                field.onChange(file)
              }
            }}
          />
        )}
      />
      {file || data ? (
        <div>
          {type === 'image' ? (
            <Image
              src={file ? URL.createObjectURL(file) : generateMediaLink(data)}
              width={128}
              height={128}
              alt="preview"
              className="w-32 h-32 object-cover"
            />
          ) : (
            <video
              className="VideoInput_video"
              width="100%"
              height={400}
              controls
              src={file ? URL.createObjectURL(file) : generateMediaLink(data)}
            />
          )}
        </div>
      ) : (
        <Image
          src="/images/upload-image-default.png"
          width={128}
          height={128}
          alt="preview"
          className="w-32 h-32 object-cover"
        />
      )}
      <label htmlFor={name} className="cursor-pointer">
        <Button
          color="primary"
          variant="solid"
          className="pointer-events-none mt-2"
        >
          {type === 'image' ? 'Upload Image' : 'Upload Video'}
        </Button>
      </label>
    </div>
  )
}

export default FileUpload
