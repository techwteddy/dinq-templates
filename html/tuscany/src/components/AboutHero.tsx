'use client'
import hero from "../assets/hero2.webp";
import Image from "next/image";
import { useRouter } from "next/navigation";
const AboutHero = () => {
  const router = useRouter();
  const handleGoHome = () => {
    router.push('/');
  }
  return (
    <section className="relative h-screen w-full">
      <Image
        src={hero}
        alt="hero photo"
        className="object-cover"
        fill
        priority
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="font-podcast text-[48px] sm:text-[56px] lg:text-[72px] font-normal leading-tight"  data-aos = "fade-down" data-aos-delay = "200">
          Our team cares about your full relax
        </h1>
        <p className="text-[14px] md:text-[24px] font-bold max-w-3xl mt-4" data-aos = "fade-down" data-aos-delay = "300">
          But I must explain to you how all this mistaken idea of denouncing
          pleasure and praising pain was born and I will give you a complete
          account of the system, and expound the actual teachings of the great
          explorer of the truth, the master-builder of human happiness.
        </p>
        <button
          className="mt-6 w-[278px] h-[55px] text-[20px] rounded-full border border-white text-white text-lg font-semibold px-6 py-3 hover:bg-white hover:text-black transition cursor-pointer"
          data-aos = "fade-down" data-aos-delay = "400"
          onClick={() => handleGoHome()}
        >
          View our Tour Packages
        </button>
      </div>
    </section>
  );
};

export default AboutHero;
