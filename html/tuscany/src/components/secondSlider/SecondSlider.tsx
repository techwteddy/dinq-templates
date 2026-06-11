'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useRef, useEffect, useState } from 'react'
import SecondSliderCard from './SecondSliderCard'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import { ReviewsData } from '@/localData/data'



const SecondSlider = () => {
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)
  const [navigationReady, setNavigationReady] = useState(false)

  useEffect(() => {
    setNavigationReady(true)
  }, [])

  return (
    <section className="px-5 md:px-[10%] py-10 mt-[120px] mb-[160px]">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-darker">Customer Reviews</h2>
        <div className="flex gap-4">
          <button
            ref={prevRef}
            className="w-12 h-12 rounded-full  bg-[#EFEFEF]  hover:bg-orange  flex items-center justify-center cursor-pointer"
          >
            <RiArrowLeftSLine color='#333'/>
          </button>
          <button
            ref={nextRef}
            className="w-12 h-12 rounded-full bg-[#EFEFEF]  hover:bg-orange   flex items-center justify-center cursor-pointer"
          >
            <RiArrowRightSLine color='#333'/>
          </button>
        </div>
      </div>

      {navigationReady && (
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          spaceBetween={30}
          slidesPerGroup={1}
          loop={true}
          slidesPerView={2}
          className="w-full"
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
          }}
        >
          {ReviewsData?.map((review, index) => (
            <SwiperSlide key={index}>
              <SecondSliderCard
                img={review?.img}
                name={review?.name}
                desc={review?.desc}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  )
}

export default SecondSlider
