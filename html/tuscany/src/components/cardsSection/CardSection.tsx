import { CardData } from "@/localData/data"
import Card from "./Card"
const CardSection = () => {
  return (
    <section>
      <div className="container m-auto px-5 flex justify-between flex-wrap mt-[120px] mb-[60px]">
        {
            CardData.map((card , index) => {
                return(
                    <Card 
                    key={index}
                    img= {card?.img}
                    title= {card?.title}
                    desc= {card?.desc}
                    aos= {card?.aos}
                    />
                )
            })
        }
      </div>
    </section>
  )
}

export default CardSection
