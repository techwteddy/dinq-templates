'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useRef, useEffect, useState } from 'react'
import SliderCard from './SliderCard';
import { CardsData } from '@/localData/data';
import { RiArrowLeftSLine , RiArrowRightSLine } from "react-icons/ri";
const FirstSlider = () => {
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)
  const [navigationReady, setNavigationReady] = useState(false)

  useEffect(() => {
    setNavigationReady(true)
  }, [])

  return (
    <section className="px-5 md:px-[10%] py-10">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-darker">
          Explore Our Popular Destinations
        </h2>
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
          spaceBetween={20}
          slidesPerGroup={1}
          loop={true}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1536: {
              slidesPerView: 4,
            },
          }}
          className="w-full"
        >
          {CardsData.map((card, index) => (
            <SwiperSlide key={index}>
              <SliderCard
                img={card.img}
                title={card.title}
                price={card.price}
                day={card.day}
                date={card.date}
                desc={card.desc}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  )
}

export default FirstSlider
