import { Button } from '@nextui-org/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import React from 'react'
import { createPortal } from 'react-dom'
import { useSwiper } from 'swiper/react'

const NavigationSwiper = () => {
  const swiper = useSwiper()
  const sliderCards =
    document.querySelector('.slider-cards') || document.createElement('div')
  return createPortal(
    <>
      <Button
        onClick={() => swiper.slidePrev()}
        isIconOnly
        className="rounded-full absolute top-2/4 -translate-y-2/4 -translate-x-2/4 left-0 z-10"
        color="primary"
        // disabled={!swiper.allowSlidePrev}
      >
        <ArrowLeft />
      </Button>
      <Button
        onClick={() => swiper.slideNext()}
        isIconOnly
        className="rounded-full absolute top-2/4 -translate-y-2/4 translate-x-2/4 right-0 z-10"
        color="primary"
        // disabled={!swiper.allowSlideNext}
      >
        <ArrowRight />
      </Button>
    </>,
    sliderCards
  )
}

export default NavigationSwiper
