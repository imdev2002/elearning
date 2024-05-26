'use client'

import CourseCard from '@/components/course/course-card'
import NavigationSwiper from '@/components/navigation-swiper'
import { CourseResType } from '@/schemaValidations/course.schema'
import { Navigation, Pagination, A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

type Props = {
  data: any
}

const ListCardSlider = ({ data }: Props) => {
  return (
    <>
      <div className="slider-cards relative">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          grabCursor={true}
          spaceBetween={16}
          slidesPerView="auto"
          // navigation
        >
          {data.map((course: any) => (
            <SwiperSlide key={course.id}>
              <CourseCard data={course} />
            </SwiperSlide>
          ))}
          <NavigationSwiper />
        </Swiper>
      </div>
    </>
  )
}

export default ListCardSlider
