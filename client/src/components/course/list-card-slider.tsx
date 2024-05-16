'use client'

import CourseCard from '@/components/course/course-card'
import { CourseResType } from '@/schemaValidations/course.schema'
import { Swiper, SwiperSlide } from 'swiper/react'

type Props = {
  data: CourseResType[]
}

const ListCardSlider = ({ data }: Props) => {
  return (
    <div className="slider-cards">
      <Swiper grabCursor={true} spaceBetween={16} slidesPerView="auto">
        {data.map((course) => (
          <SwiperSlide key={course.id}>
            <CourseCard data={course} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ListCardSlider
