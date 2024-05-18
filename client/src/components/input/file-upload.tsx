'use client'

import { clientTokens } from '@/lib/http'
import { cn, generateMediaLink } from '@/lib/utils'
import { Button } from '@nextui-org/react'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'

type ImageUploadPropsType = {
  name: string
  form?: any
  type?: 'video' | 'image'
  placeholder?: string
  label?: string
  disabled?: boolean
}

const FileUpload = ({
  name,
  form,
  type = 'image',
  placeholder,
  label,
  disabled,
}: ImageUploadPropsType) => {
  const [file, setFile] = useState<File | null>(null)
  const [videoURL, setVideoURL] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const data = form.watch(name)
  useEffect(() => {
    const getVideo = async () => {
      const url = generateMediaLink(data)
      const videoRes = await fetch(url, {
        headers: {
          Authorization: `Bearer ${clientTokens.value.accessToken}`,
        },
      })
      if (videoRes.status === 200) {
        const blob = await videoRes.blob()
        const videoURL = URL.createObjectURL(blob)
        setVideoURL(videoURL)
      }
    }
    if (type === 'video' && data) getVideo()
  }, [])
  return (
    <div className={placeholder ? 'flex-1' : ''}>
      {label && (
        <label
          htmlFor=""
          className=" pointer-events-none origin-top-left subpixel-antialiased block text-foreground-500 after:content-['*'] after:text-danger after:ml-0.5 will-change-auto !duration-200 !ease-out motion-reduce:transition-none transition-[transform,color,left,opacity] group-data-[filled-within=true]:text-foreground group-data-[filled-within=true]:pointer-events-auto pb-0 z-20 top-1/2 -translate-y-1/2 group-data-[filled-within=true]:left-0 left-3 text-small group-data-[filled-within=true]:-translate-y-[calc(100%_+_theme(fontSize.small)/2_+_20px)] pe-2 max-w-full text-ellipsis overflow-hidden"
        >
          {label}
        </label>
      )}
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
      <div className={cn('h-fit', placeholder && 'flex gap-4 items-center')}>
        {file || data ? (
          <>
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
                className="aspect-video w-52"
                width="100%"
                height={400}
                controls
                src={file ? URL.createObjectURL(file) : videoURL}
              />
            )}
          </>
        ) : (
          <Image
            src={
              type === 'image'
                ? '/images/upload-image-default.png'
                : '/images/upload-video-default.png'
            }
            width={128}
            height={128}
            alt="preview"
            className={cn(
              'object-cover',
              type === 'image' ? 'w-32 h-32' : 'w-52 h-32'
            )}
          />
        )}
        <div className="">
          <p
            className="text-default-400 text-sm"
            dangerouslySetInnerHTML={{
              __html: placeholder
                ? placeholder +
                  '<b>Important guidelines:</b> 400x400 pixels or 1:1 Ratio. Supported format: <b>.jpg, .jpeg, or .png</b>'
                : '',
            }}
          ></p>
          <label
            htmlFor={name}
            className={
              disabled ? 'pointer-events-none opacity-95' : 'cursor-pointer'
            }
          >
            <Button
              color="success"
              variant="solid"
              className="pointer-events-none mt-2 flex gap-2 items-center rounded-md"
              disabled={disabled}
            >
              {type === 'image' ? 'Upload Image' : 'Upload Video'}
              <Upload />
            </Button>
          </label>
        </div>
      </div>
    </div>
  )
}

export default FileUpload
