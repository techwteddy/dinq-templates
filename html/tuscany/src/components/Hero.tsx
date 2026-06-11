"use client";

import Image from "next/image";
import { useState } from "react";
import heroImage from "../assets/7a5d7b403a3df37fe37290185b54200d1e561297.webp";
import { GoPeople } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { CgCalendarDates } from "react-icons/cg";
import { IoTimeOutline, IoCarSportOutline } from "react-icons/io5";
import { BsFlag } from "react-icons/bs";
import { FaEarthAmericas } from "react-icons/fa6";
import { Dropdown } from "./Dropdown";

const Hero = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="relative h-screen w-full mb-[120px]">
      <Image
        src={heroImage}
        alt="hero"
        className="h-full w-full object-cover"
        priority
        fill
      />

      <div className="absolute z-40 inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-5xl md:text-6xl font-medium font-podcast drop-shadow-lg text-[48px] xl:text-[72px]" data-aos = "fade-down" data-aos-delay = "200">
          Enjoy in the best way!
        </h1>
        <p className="md:text-xl mt-4 drop-shadow-md font-bold text-2xl" data-aos = "fade-down" data-aos-delay = "300">
          Enjoy our services for your trip anytime
        </p>

        <button
          className="mt-6 px-4 py-2 bg-orange text-white rounded-md md:hidden cursor-pointer"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Hide Options" : "Show Options"}
        </button>

        <div
          className={`transition-all duration-500 ease-in-out relative
            ${showForm ? "opacity-100 scale-100 max-h-[1000px]" : "opacity-0 scale-95 max-h-0"}
            bg-[#FFFFFF33] px-4 py-14 sm:p-5 mt-8 rounded-[12px]
            md:opacity-100 md:scale-100 md:max-h-full md:block`}
        >
          <div className="absolute top-[8px] left-1/2 -translate-x-1/2 flex md:left-[20px] md:translate-x-0">
            <button className="w-[137px] h-[42px] text-orange bg-white text-sm rounded-tl-[12px] flex items-center justify-center gap-1.5">
             <span><FaEarthAmericas color="#FA8B02"/></span> Public Tours
            </button>
            <button className="w-[137px] h-[42px] text-white bg-[#FFFFFF33]  text-sm border-white flex items-center justify-center gap-1.5">
            <span><GoPeople color="#fff"/></span>  Private Tours
            </button>
          </div>

          <div className="bg-white rounded-tl-none rounded-[12px] text-black p-5 flex justify-between items-center gap-2 sm:gap-6 flex-wrap lg:flex-nowrap mt-6">
            <div className="border-r border-[#1111110f] px-3 sm:px-5">
              <Dropdown icon={<GoPeople />} label="Number of people" options={["1", "2", "3", "4+"]} />
            </div>

            <div className="border-r border-[#1111110f] px-5">
              <Dropdown icon={<CgCalendarDates />} label="Date" options={["Today", "Tomorrow", "Next Week"]} />
            </div>

            <div className="border-r border-[#1111110f] px-5">
              <Dropdown icon={<IoTimeOutline />} label="Time" options={["Morning", "Afternoon", "Evening"]} />
            </div>

            <div className="border-r border-[#1111110f] px-5">
              <Dropdown icon={<BsFlag />} label="Tour" options={["City Tour", "Mountain Tour", "Desert Safari"]} />
            </div>

            <div className="px-5">
              <Dropdown icon={<IoCarSportOutline />} label="Transportation" options={["Car", "Bus", "Bike"]} />
            </div>

            <button className="bg-orange text-white p-3 sm:p-6 rounded-[12px] cursor-pointer">
              <FiSearch size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
