import Image from "next/image";

interface CardProps {
    icon: any;
    desc: string;
    aos: string;
}

const InfoCard = ({icon , desc , aos} : CardProps) => {
  return (
    <div className="bg-white/30 p-8 my-3 rounded-3xl flex flex-col items-center text-center gap-4 w-full sm:w-[46%] lg:w-[20%] h-[189px]" data-aos= "fade-up-right" data-aos-delay = {`${aos}`}>
      <Image src={icon} alt={desc} className="w-[60px] h-[60px]" />
      <div className="text-[20px] font-semibold">
        {desc}
      </div>
    </div>
  );
};

export default InfoCard;
