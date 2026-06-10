import React, { useRef } from "react";
import { StaticImageData } from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Star, StarHalf } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";

type ReviewProps = {
  name: string;
  organization: string;
  comment: string;
  rating: number;
  date: string;
  avatarUrl: string | StaticImageData;
  index: number;
};

export default function Review({
  name,
  organization,
  comment,
  rating,
  date,
  avatarUrl,
  index,
}: ReviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });

  const springConfig = { stiffness: 300, damping: 30, mass: 1 };
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [100, 0]),
    springConfig
  );
  const rotate = useSpring(
    useTransform(scrollYProgress, [0, 1], [-10, 0]),
    springConfig
  );
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 1], [0.8, 1]),
    springConfig
  );

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 text-yellow-400"
            fill="currentColor"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className="w-4 h-4 text-yellow-400"
            fill="currentColor"
          />
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }

    return stars;
  };

  return (
    <motion.div
      ref={ref}
      style={{ y, rotate, scale }}
      className="group h-full"
    >
      <div className="relative h-full p-6 rounded-lg bg-stone-100/95 border border-black/5 hover:bg-stone-200/95 transition dark:bg-white/10 dark:hover:bg-white/20 flex flex-col backdrop-blur-sm shadow-sm">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-blue-600/20 dark:ring-blue-400/20 group-hover:ring-blue-600/50 dark:group-hover:ring-blue-400/50 transition-all">
            <OptimizedImage
              src={avatarUrl}
              alt={`Avatar of ${name}`}
              width={56}
              height={56}
              className="w-full h-full object-cover"
              belowFold={true}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              {name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {organization}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">{renderStars(rating)}</div>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {date}
              </span>
            </div>
          </div>
        </div>

        {/* Comment */}
        <div className="flex-1 relative">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            "{comment}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}
