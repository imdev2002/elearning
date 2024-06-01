import React, { useMemo, useState } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
// @ts-ignore
import ImageUploader from 'quill-image-uploader'
import { fileApiRequest } from '@/services/file.service'
import { generateMediaLink } from '@/lib/utils'

Quill.register('modules/imageUploader', ImageUploader)

type Props = {
  data?: any
  content?: string
  setContent?: any
  disabled?: boolean
}

const QuillEditor = ({ content, setContent, disabled = false }: Props) => {
  const modules = useMemo(
    () => ({
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['link', 'image'],
      ],
      imageUploader: {
        // imgbbAPI
        upload: async (file: any) => {
          const bodyFormData = new FormData()
          bodyFormData.append('image', file)
          const response = await fileApiRequest.upload(bodyFormData)
          return generateMediaLink(response.payload.path)
        },
      },
    }),
    []
  )
  return (
    <ReactQuill
      className={disabled ? 'opacity-75 pointer-events-none' : ''}
      modules={modules}
      theme="snow"
      value={content}
      // @ts-ignore
      onChange={setContent}
    />
  )
}

export default QuillEditor
