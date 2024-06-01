'use client'

import { coursePublicApiRequests } from '@/services/course.service'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { Star } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

type Props = {
  data?: any
}

const RatingModal = ({ data }: Props) => {
  const { courseId } = useParams()
  const { refresh } = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [rating, setRating] = useState<any>()
  const [hover, setHover] = useState<any>()
  const [totalStars, setTotalStars] = useState(5)
  const handleRatingCourse = async () => {
    try {
      const body = {
        courseId,
        star: rating,
      }
      const res = await coursePublicApiRequests.rating(body)
      if (res.status === 200) {
        toast.success('Rating course successfully')
        refresh()
        onClose()
      }
    } catch (error) {}
  }
  return (
    <>
      <Button
        content="Edit user"
        onClick={onOpen}
        color="warning"
        className="w-full mt-2 text-white"
      >
        Rating Course
      </Button>

      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">Rating course</ModalHeader>
              <ModalBody>
                <div className="flex gap-1 mx-auto my-4">
                  {[...Array(totalStars)].map((star, index) => {
                    const currentRating = index + 1

                    return (
                      <label key={index}>
                        <input
                          type="radio"
                          name="rating"
                          value={currentRating}
                          onChange={() => setRating(currentRating)}
                          className="hidden"
                        />
                        <span
                          className="star cursor-pointer"
                          style={{
                            color:
                              currentRating <= (hover || rating)
                                ? '#ffc107'
                                : '#e4e5e9',
                          }}
                          onMouseEnter={() => setHover(currentRating)}
                          onMouseLeave={() => setHover(null)}
                        >
                          {/* &#9733; */}
                          <Star
                            size={48}
                            fill={
                              currentRating <= (hover || rating)
                                ? '#ffc107'
                                : '#e4e5e9'
                            }
                          />
                        </span>
                      </label>
                    )
                  })}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="primary" onClick={handleRatingCourse}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default RatingModal
