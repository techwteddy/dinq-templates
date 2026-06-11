import Hero from "@/components/Hero";
import InfoComp from "@/components/InfoComp";
import person from "../assets/about picture (1) (2).webp";
import Offers from "@/components/Offers";
import CardSection from "@/components/cardsSection/CardSection";
import Bike from "@/components/Bike";
import MostPopular from "@/components/mostPopular/MostPopular";
import FirstSlider from "@/components/firstSlider/FirstSlider";
import SecondSlider from "@/components/secondSlider/SecondSlider";

const Home = () => {
  return (
    <>
      <Hero />
      <FirstSlider />
      <InfoComp
        img={person}
        title="WELCOME TO OUR SITE!"
        mainTitle="We are the best company for your visit"
        desc="After decades of experience, and a whole life in Lucca, we offer you the most complete tourism service in the city. In addition to having bikes and rickshaws to have as much fun as you want, you have the choice of tour guides with whom to tour and drivers for your every need! We offer packages in the way that you get the most at the lowest price. Book with us and we will always be available for you!"
        num1={"20+"}
        desc1={"YearsExperience"}
        num2={"100+"}
        desc2={"HappyCustomer"}
        num3={"15+"}
        desc3={"Choice of Services"}
        num4={"10+"}
        desc4={"Professional Guides"}
        style="contain"
      />

      <Offers />
      <CardSection />
      <Bike />
      <MostPopular />
      <SecondSlider />
    </>
  );
};

export default Home;
