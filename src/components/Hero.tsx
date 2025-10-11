import React, { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { RiDiscountPercentLine, RiEBike2Line } from "react-icons/ri";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

function Hero() {
  const [currentHero, setCurrentHero] = useState(0);
  const heroComponents = [Hero1, Hero2];
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentHero((prev) => (prev + 1) % heroComponents.length);
  }, [heroComponents.length]);

  const handlePrev = useCallback(() => {
    setCurrentHero(
      (prev) => (prev - 1 + heroComponents.length) % heroComponents.length
    );
  }, [heroComponents.length]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 200 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ duration: 1, type: "spring" }}
      className="w-full aspect-video rounded-xl overflow-hidden relative group"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentHero}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          {React.createElement(heroComponents[currentHero])}
        </motion.div>
      </AnimatePresence>

      <BsChevronLeft
        onClick={handlePrev}
        className="absolute top-1/2 left-4 text-4xl cursor-pointer translate-y-1/2 translate-x-[-200%] group-hover:translate-x-0 duration-300 transition-all w-14 h-14 p-3 rounded-full bg-white text-black"
      />
      <BsChevronRight
        onClick={handleNext}
        className="absolute top-1/2 right-4 text-4xl cursor-pointer translate-y-1/2 translate-x-[200%] group-hover:translate-x-0 duration-300 transition-all w-14 h-14 p-3 rounded-full bg-white text-black"
      />
    </motion.div>
  );
}

const Hero1 = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 200, y: 200 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 1, type: "spring" }}
      className="w-full h-full rounded-xl bg-[url('/hero/hero2.webp')] bg-cover bg-no-repeat"
    >
      <div className="w-full h-full bg-white/50 flex relative items-center">
        <Image
          src={"/hero/image1.png"}
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          className="h-4/6 w-fit"
        />
        <div className="absolute right-0 bottom-0 h-4/6 w-1/2 flex flex-col space-y-2">
          <span className="text-white font-bold text-5xl">Flat 25% off</span>
          <span className="text-white font-bold text-5xl">Medicine order</span>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex space-x-1 items-center text-white">
              <RiDiscountPercentLine className="w-14 h-14 p-3 rounded-full bg-white text-primary" />
              <span>Win Big Offers Everyday</span>
            </div>
            <div className="flex space-x-1 items-center text-white">
              <RiEBike2Line className="w-14 h-14 p-3 rounded-full bg-white text-primary" />
              <span>Free Delivery</span>
            </div>
          </div>
          <button className="flex items-center space-x-4 mt-20 duration-300 transition-all cursor-pointer hover:bg-white rounded-full pr-4 w-fit text-white hover:text-black">
            <FaArrowRight className="w-12 h-12 p-3 rounded-full bg-white text-black" />
            <span>Shop Now</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Hero2 = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -200, y: -200 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 1, type: "spring" }}
      className="w-full h-full rounded-xl bg-[url('/hero/hero3.webp')] bg-cover bg-no-repeat"
    >
      <div className="w-full h-full bg-white/50 flex relative items-center">
        <Image
          src={"/hero/image1.png"}
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          className="h-4/6 w-fit"
        />
        <div className="absolute right-0 bottom-0 h-4/6 w-1/2 flex flex-col space-y-2">
          <span className="text-white font-bold text-5xl">Flat 25% off</span>
          <span className="text-white font-bold text-5xl">Medicine order</span>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex space-x-1 items-center text-white">
              <RiDiscountPercentLine className="w-14 h-14 p-3 rounded-full bg-white text-primary" />
              <span>Win Big Offers Everyday</span>
            </div>
            <div className="flex space-x-1 items-center text-white">
              <RiEBike2Line className="w-14 h-14 p-3 rounded-full bg-white text-primary" />
              <span>Free Delivery</span>
            </div>
          </div>
          <button className="flex items-center space-x-4 mt-20 duration-300 transition-all cursor-pointer hover:bg-white rounded-full pr-4 w-fit text-white hover:text-black">
            <FaArrowRight className="w-12 h-12 p-3 rounded-full bg-white text-black" />
            <span>Shop Now</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
