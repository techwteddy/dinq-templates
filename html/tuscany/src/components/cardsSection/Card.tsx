import Image from "next/image";

interface CardProps {
    img: any;
    title: string;
    desc: string;
    aos: string
}



const Card = ({ img, title, desc , aos }: CardProps) => {
  return (
    <div className="w-[100%] md:w-[48%] lg:w-[23%] my-3" data-aos= "fade-up" data-aos-delay= {`${aos}`}>
      <Image src={img} alt={title} className="rounded-3xl h-[302px] object-cover" />
      <div className="w-full">
        <h2 className="font-bold text-2xl text-darker mt-5 mb-3">{title}</h2>
        <p className="text-darker break-words mt-3">{desc}</p>
      </div>
    </div>
    
  );
};

export default Card;
