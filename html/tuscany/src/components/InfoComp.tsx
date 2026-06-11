"use client";

import Image from "next/image";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const CountUpWrapper = ({
  end,
  suffix,
}: {
  end: number;
  suffix?: string;
}) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <span ref={ref}>
      {inView ? <CountUp end={end} duration={2} suffix={suffix} /> : 0}
    </span>
  );
};

interface SectionProps<T> {
  img: any;
  desc: T;
  title: T;
  mainTitle: T;
  num1: T;
  desc1: T;
  num2: T;
  desc2: T;
  num3: T;
  desc3: T;
  num4: T;
  desc4: T;
  style?: T;
}

const InfoComp = ({
  img,
  title,
  mainTitle,
  desc,
  num1,
  desc1,
  num2,
  desc2,
  num3,
  desc3,
  num4,
  desc4,
  style,
}: SectionProps<string>) => {
  return (
    <section className="my-[120px] overflow-auto">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-3">
        <div className="lg:w-1/2 w-full" data-aos="fade-right">
          <Image
            src={img}
            alt="someone"
            className={`rounded-3xl object-${style} m-auto lg:m-0  h-[420px]  2xl:h-[580px]`}
            width={450}
            height={650}
          />
        </div>

        <div
          className="lg:w-1/2 w-full space-y-6 mt-6"
          data-aos="fade"
          data-aos-delay="300"
        >
          <span className="text-gray-400 font-bold uppercase tracking-wide block text-sm">
            {title}
          </span>
          <h1 className=" font-extrabold text-[32px] text-darker">
            {mainTitle}
          </h1>
          <p className="text-darker  text-base leading-relaxed">{desc}</p>

          <ul className="flex flex-wrap gap-4 text-center mt-6">
            <li>
              <p className="text-[32px] font-bold text-orange">
                <CountUpWrapper end={parseInt(num1)} />+
              </p>
              <span className="text-sm text-gray-400">{desc1}</span>
            </li>
            <li>
              <p className="text-[32px] font-bold text-orange">
                <CountUpWrapper end={parseInt(num2)} />+
              </p>
              <span className="text-sm text-gray-400">{desc2}</span>
            </li>
            <li>
              <p className="text-[32px] font-bold text-orange">
                <CountUpWrapper end={parseInt(num3)} />+
              </p>
              <span className="text-sm text-gray-400">{desc3}</span>
            </li>
            <li>
              <p className="text-[32px] font-bold text-orange">
                <CountUpWrapper end={parseInt(num4)} />+
              </p>
              <span className="text-sm text-gray-400">{desc4}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default InfoComp;
