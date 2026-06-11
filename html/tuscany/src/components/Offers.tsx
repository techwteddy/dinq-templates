import background from "../assets/background.webp";
import Image from "next/image";
import person from "../assets/girlpng.png";

const Offers = () => {
  return (
    <section className="mt-[218px] mb-[120px] relative overflow-hidden sm:overflow-visible">
      <Image
        src={background}
        alt="background"
        className="w-full h-[450px] object-cover"
      />

      <div className="container mx-auto px-x">
        <div className="absolute top-[50%] left-0 translate-y-[-50%] w-full flex flex-col md:flex-row justify-center items-center md:gap-0 px-6">
          
          <div className="flex justify-center items-center flex-col bg-[#FFFFFF33] backdrop-blur-sm p-6 w-full md:w-[569px] h-[300px] text-white rounded-xl text-center md:text-left mt-[60px] sm:mt-[0px]" data-aos = "fade-right" data-aos-delay = "200">
            <h2 className="text-2xl font-bold mb-2 sm:mb-4 text-darker">
              Get Special Offers for Organizations
            </h2>
            <p className="mb-2 sm:mb-6 text-[#000000] text-center">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </p>
            <button className="bg-orange text-white font-semibold py-2 px-6 cursor-pointer rounded-full">
              Contact Us
            </button>
          </div>

          <div className="hidden md:flex w-full md:w-auto justify-center md:justify-end md:-ml-4" data-aos = "fade" data-aos-delay = "300">
            <Image
              src={person}
              alt="girl"
              className="h-[268px] md:h-[552px] w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offers;
