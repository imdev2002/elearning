'use client'

import FileUpload from '@/components/input/file-upload'
import { convertObjectToFormData } from '@/lib/utils'
import { EmojiBody, EmojiBodyType } from '@/schemaValidations/emoji.schema'
import { emojiApiRequest } from '@/services/emoji.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type Props = {
  closeModal: () => void
}

const EmojiForm = ({ closeModal }: Props) => {
  const { refresh } = useRouter()
  const form = useForm<EmojiBodyType>({
    resolver: zodResolver(EmojiBody),
    defaultValues: {
      image: '',
      name: '',
    },
  })
  const submitEmojiForm = async (values: EmojiBodyType) => {
    const formData = convertObjectToFormData(values)
    try {
      const res = await emojiApiRequest.create(formData)
      if (res.status === 200) {
        toast.success(`Created ${form.watch('name')} emoji successfuly!`)
        refresh()
        closeModal()
      }
    } catch (error) {
      toast.error(`Could not create ${form.watch('name')} emoji`)
    }
  }
  return (
    <form onSubmit={form.handleSubmit(submitEmojiForm)}>
      <FileUpload name="image" form={form} />
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => (
          <Input
            isRequired
            label="Name"
            variant="bordered"
            labelPlacement="outside"
            placeholder="eg, 189"
            {...field}
          />
        )}
      />
      <Button type="submit">Create</Button>
    </form>
  )
}

export default EmojiForm
