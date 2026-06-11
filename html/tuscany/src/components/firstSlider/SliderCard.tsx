import Image from "next/image"
import nature from "../../assets/nature.webp"
import { GoPeople } from "react-icons/go"
import { CgCalendarDates } from "react-icons/cg"

interface SliderCardProps {
    img: any;
    title: string;
    price: string;
    day: string;
    date: string;
    desc: string;
    aos?: string
}

const SliderCard = ({img , title , price , day , date , desc , aos}: SliderCardProps) => {
  return (
    <div className="max-w-sm w-full" data-aos = "fade-right" data-aos-delay ={`${aos}`}>
      <Image
        src={img}
        alt="testing"
        className="w-full h-[404px] object-cover rounded-[24px]"
      />
      <div className="mt-4 space-y-3">
        <h2 className="text-xl font-bold text-darker">
          {title}
        </h2>
        <div className="text-base text-darker">
          from <h3 className="inline font-semibold text-orange text-2xl">{price}</h3>
        </div>
        <div className="flex justify-between text-sm text-darker">
          <div className="flex items-center gap-2 font-normal text-orange">
            <CgCalendarDates size={18} />
            <span>{day}</span>
          </div>
          <div className="flex items-center gap-2 font-normal text-orange">
            <GoPeople size={18} />
            <span>{date}</span>
          </div>
        </div>
        <p className="text-darker">
          {desc}
        </p>
      </div>
    </div>
  )
}

export default SliderCard

