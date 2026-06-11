import biks from "../assets/biks.webp";
import persons from "../assets/persons.webp";
import car from "../assets/car.webp";
import bus from "../assets/bus.webp";
import toktok from "../assets/toktok.webp";
import trace from "../assets/trace.webp";
import park from "../assets/park.webp";
import icon1 from "../assets/Layer 1 (2).svg";
import icon2 from "../assets/Vector (3).svg";
import icon3 from "../assets/Vector (4).svg";
import icon4 from "../assets/Vector (5).svg";
import map from "../assets/Layer 2.svg";
import flag from "../assets/Layer 1 (3).svg";
import exp from "../assets/Layer 2 (1).svg";
import coins from "../assets/Layer 2 (2).svg";
import image1 from "../assets/bikeTour.webp"
import image2 from "../assets/sun.webp"
import image3 from "../assets/city.webp"
import image4 from "../assets/car.webp"
import img4 from "../assets/bus.webp"
import man from "../assets/man.webp"

interface NavProps {
  link: string;
  label: string;
}

export const NavData: Array<NavProps> = [
  {
    link: "/",
    label: "Home",
  },
  {
    link: "/about",
    label: "About Us",
  },
  {
    link: "/packages",
    label: "Tour Packages",
  },
  {
    link: "/contact",
    label: "Contact Us",
  },
];

interface CardProps {
  img: any;
  title: string;
  desc: string;
  aos: string
}

export const CardData: Array<CardProps> = [
  {
    img: biks,
    title: "Bike and rickshaw rental",
    desc: "Book your quality vehicle quickly for an hour or all day!",
    aos: "200"

  },
  {
    img: persons,
    title: "Guided tour of the countryside",
    desc: "Live the real Lucchese experience by visiting the suburbs by bike!",
    aos: "400"
  },
  {
    img: car,
    title: "Taxi and NCC service",
    desc: "Do you need not only a bike but also a driver? Then you have found the right place!",
    aos: "600"
  },

  {
    img: bus,
    title: "Bus Package",
    desc: "Do you need not only a bike but also a driver? Then you have found the right place!",
    aos: "800"
  },
];

interface CardPopProps {
  aos: string;
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
}

export const CardPopData: Array<CardPopProps> = [
  {
    cardImg: toktok,
    title: "BIKE / RICKSHAW",
    price: "10",
    icon1: icon1,
    info1: "Your bike for a day",
    info2: "City App",
    icon2: icon2,
    info3: "Discount on Rickshaw",
    icon3: icon3,
    info4: "Guaranteed Support",
    icon4: icon4,
    aos: "200"
  },
  {
    cardImg: trace,
    title: "BIKE TOURS",
    price: "30",
    icon1: icon1,
    info1: "A Mountain Bike Included",
    info2: "City App",
    icon2: icon2,
    info3: "A Guide For You",
    icon3: icon3,
    info4: "Bottle of water",
    icon4: icon4,
    aos: "400"
  },
  {
    cardImg: park,
    title: "BUS TRIPS",
    price: "45",
    icon1: icon1,
    info1: "Your bike for a day",
    info2: "City App",
    icon2: icon2,
    info3: "Discount on Rickshaw",
    icon3: icon3,
    info4: "Guaranteed Support",
    icon4: icon4,
    aos: "600"
  },
  {
    cardImg: car,
    title: "TRANSFER",
    price: "10",
    icon1: icon1,
    info1: "Your bike for a day",
    info2: "City App",
    icon2: icon2,
    info3: "Discount on Rickshaw",
    icon3: icon3,
    info4: "Guaranteed Support",
    icon4: icon4,
    aos: "800"
  },
];

interface CardPropsInfo {
    icon: any;
    desc: string;
    aos: string;
}

export const CardPropsInfoData : Array<CardPropsInfo> = [
  {
    icon: map,
    desc: "Complete Packages For All Your Wishes",
    aos: "200"
  },
    {
    icon: exp,
    desc: "Over 30 Years Of Experience",
    aos: "400"
  },
      {
    icon: flag,
    desc: "Expert Guides For You",
    aos: "600"
  },
        {
    icon: coins,
    desc: "Guaranteed fun at the best price!",
    aos: "800"
  },
]

interface SliderCardData {
  img: any;
  title: string;
  price: string;
  day: string;
  date: string;
  desc: string;
  aos?: string;
}


export const CardsData : Array<SliderCardData> = [
  {
    img: image1,
    title: 'Lucca Bike Tour',
    price: '34 €',
    day: 'EVERY DAY',
    date: '3-10 PP',
    desc: 'A tour of the city and its surroundings led by a professional guide ...',
    aos: "200"
  },
  {
    img: image2,
    title: 'Wine tasting In Tuscany',
    price: '34 €',
    day: 'MONDAY',
    date: '10-30 PP',
    desc: 'The real magic is here where you can enjoy the best Tuscan wine and eat ...',
    aos: "300"
  },
  {
    img: image3,
    title: 'Cinque Terre Tour',
    price: '34 €',
    day: 'TO BE DECIDED',
    date: '10-50 PP',
    desc: 'Visiting the 5 Terre is a must, and you can never go there enough ...',
    aos: "400"
  },
  {
    img: img4,
    title: 'Siena and Surroundings',
    price: '34 €',
    day: 'TO BE DECIDED',
    date: '5-10 PP',
    desc: 'Taste the best of Florence on this food journey...',
    aos: "500"
  },
  {
    img: image4,
    title: 'Florence Food Tour',
    price: '39 €',
    day: 'EVERY DAY',
    date: '3-10 PP',
    desc: 'Visit the beautiful Siena and the cities that surround it to experience ...',
    aos: "600"
  }
]

interface ReviewsProps {
  img: any;
  name: string;
  desc: string
}


export const ReviewsData : Array<ReviewsProps> = [
  {
    img: man, 
    name: 'Lyod Gomez',
    desc: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure'
  },
  {
    img: man,
    name: 'Jane Smith',
    desc: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure'
  },
  {
    img: man,
    name: 'Ahmed Ali',
    desc: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure'
  },
  {
    img: man,
    name: 'Lyod Gomez',
    desc: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure'
  }
]


