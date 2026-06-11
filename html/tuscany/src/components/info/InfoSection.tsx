import background from "../../assets/background.webp";
import InfoCard from "./InfoCard";
import { CardPropsInfoData } from "@/localData/data";
const InfoSection = () => {
  return (
    <section
      className="w-full min-h-[500px] bg-cover bg-center bg-no-repeat flex items-center justify-center my-[120px]"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className="container mx-auto px-5">



                <div className="flex justify-between items-center flex-wrap">
            {
                CardPropsInfoData?.map((card , index) => {
                    return(
                        <InfoCard
                        key={index}
                        icon={card?.icon}
                        desc={card?.desc}
                        aos= {card?.aos}
                         />
                    )
                })
            }
        </div>
      </div>

    </section>
  );
};

export default InfoSection;
