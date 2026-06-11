import React from 'react'
import { CardPopData } from '@/localData/data'
import MostPopCard from './MostPopCard'

const MostPopular = () => {
  return (
    <section className='mt-[120px] mb-[224px]'>
      <div className="container m-auto px-5">
        <h2 className="text-3xl md:text-4xl font-bold mb-12" data-aos = "fade">
          The Most Popular Packages
        </h2>

        <div className="flex justify-between flex-wrap gap-3">
          {
            CardPopData.map((card, index) => (
              <MostPopCard
                key={index}
                cardImg={card.cardImg}
                title={card.title}
                price={card.price}
                icon1={card.icon1}
                info1={card.info1}
                icon2={card.icon2}
                info2={card.info2}
                icon3={card.icon3}
                info3={card.info3}
                icon4={card.icon4}
                info4={card.info4}
                aos= {card.aos}
              />
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default MostPopular
