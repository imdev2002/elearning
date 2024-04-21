'use client'
import { Button } from '@nextui-org/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type ImageUploadPropsType = {
  name: string
  setValue?: any
}

export const ImageUpload = ({ name, setValue }: ImageUploadPropsType) => {
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState<any>()

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
    setValue(name, e.target.files[0])
  }

  return (
    <div className="flex gap-4 w-[600px] max-h-[240px]">
      <Image
        alt=""
        src={preview || '/images/upload-image-default.png'}
        width={0}
        height={0}
        sizes="1000px"
        className="w-1/3 object-cover h-full"
      />
      <div className="flex flex-col justify-between">
        <p className="text-sm">
          Upload your course Thumbnail here. <b>Important guidelines:</b>{' '}
          1200x800 pixels or 12:8 Ratio. Supported format:{' '}
          <b>.jpg, .jpeg, or .png</b>
        </p>
        <label htmlFor="upload-img" className="cursor-pointer">
          <Button
            color="primary"
            variant="solid"
            className="pointer-events-none"
          >
            Upload image
          </Button>
        </label>
        <input
          id="upload-img"
          type="file"
          className="hidden"
          onChange={onSelectFile}
        />
      </div>
    </div>
  )
}
