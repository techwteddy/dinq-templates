import AboutHero from "@/components/AboutHero"
import InfoComp from "@/components/InfoComp"
import city from '../../assets/village.webp'
import InfoSection from "@/components/info/InfoSection"
import SecondSlider from "@/components/secondSlider/SecondSlider"
const page = () => {
  return (
    <>
      <AboutHero />
            <InfoComp
        img={city}
        title="WELCOME TO OUR SITE!"
        mainTitle="We Are The Center Of Lucca To Offer You The Best"
        desc="We are right in the center of Lucca to offer you the real city life! With years of experience in practically every tourism sector, with us you can find complete packages at the lowest price, to travel and learn and have fun all without worries and without stress. What are you waiting for, book a bright evening, a trip to beautiful Tuscany or a personal tour for you!"
        num1={"20+"}
        desc1={"YearsExperience"}
        num2={"100+"}
        desc2={"HappyCustomer"}
        num3={"15+"}
        desc3={"Choice of Services"}
        num4={"10+"}
        desc4={"Professional Guides"}
        style="cover"
      />
      <InfoSection />
      <SecondSlider />
    </>
  )
}

export default page
