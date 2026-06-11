import cotation from "../../assets/cotation.svg"
import Image from "next/image"

interface SecondSliderCardProps {
    img: any;
    name: string;
    desc: string;
}

const SecondSliderCard = ({ img, name, desc }: SecondSliderCardProps) => {
  return (
    <div className="bg-white rounded-[24px] shadow-gray-300/20  mx-auto  min-h-[406px] border border-gray-300 p-[30px] shadow-lg" data-aos = "fade-right">
      <div className="flex flex-col items-center mb-6">
        <Image
          src={img}
          alt={name}
          className="rounded-full w-24 h-24 object-cover"
          width={96}
          height={96}
        />
        <h3 className="mt-4 text-xl font-semibold text-darker">{name}</h3>
      </div>
      <div className="relative">
        <Image
          src={cotation}
          alt="cotation"
          className="absolute top-[-12px] left-[-12px] w-8 h-8 opacity-30"
          width={32}
          height={32}
        />
        <p className="pt-12 text-darker text-[18px] leading-relaxed">
          {desc}
        </p>
        <Image
          src={cotation}
          alt="cotation"
          className="absolute bottom-[-12px] right-[-12px] w-8 h-8 opacity-30 rotate-180"
          width={32}
          height={32}
        />
      </div>
    </div>
  )
}

export default SecondSliderCard
