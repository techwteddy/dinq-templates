import Image from "next/image";

interface CardPopProps {
    cardImg: any;
    title: string;
    price: string;
    info1: string;
    icon1: string;
    info2: string;
    icon2: string;
    info3: string;
    icon3: string;
    info4: string;
    icon4: string;
    aos: string;
}

const MostPopCard = ({cardImg , title , price , info1 , icon1 , info2 , icon2 , info3 , icon3 , info4 , icon4 ,aos} : CardPopProps) => {
  return (
    <div className="w-[100%] md:w-[48%] lg:w-[23%] bg-white rounded-3xl shadow-md overflow-hidden" data-aos= "flip-right" data-aos-delay = {`${aos}`}>
      <Image
        src={cardImg}
        alt="toktok"
        className="w-full h-[340px] object-cover rounded-t-lg"
      />

      <div className="p-4 space-y-3">
        <h2 className="text-[20px] font-[800] text-darker">{title}</h2>

<div className="relative inline-block">
  <span className="absolute -top-2 -left-3 text-gray-500 text-sm">€</span>
  <span className="text-orange text-[48px] font-bold leading-none">{price}</span>
  <small className="text-gray-500 text-sm ml-1">/ day</small>
</div>


        <ul className="space-y-2 text-gray-600 text-sm">
          <li className="flex items-center gap-5">
            <Image src={icon1} alt= {title} />
            {info1}
          </li>
          <li className="flex items-start gap-5">
            <Image src={icon2} alt= {title} />
            {info2}
          </li>
          <li className="flex items-start gap-5">
            <Image src={icon3} alt= {title} />
            {info3}
          </li>
          <li className="flex items-start gap-5">
            <Image src={icon4} alt= {title} />
            {info4}
          </li>
        </ul>
        <button className="mt-4 w-full text-orange border-orange border-[1px] py-3 px-6 rounded-full transition cursor-pointer">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default MostPopCard;
