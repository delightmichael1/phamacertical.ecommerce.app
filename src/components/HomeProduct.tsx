import cn from "@/utils/cn";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

interface Props {
  image: string;
  name: string;
  description?: string;
  className?: string;
}

function HomeProduct(props: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 1, type: "spring" }}
      className={cn(
        "flex items-center space-x-6 shadow-md shadow-black/10 rounded-xl p-6 w-full aspect-video max-h-60",
        props.className
      )}
    >
      <div className="w-2/5 flex flex-col space-y-4">
        <span className="text-3xl">{props.name}</span>
        <span className="text-xl">{props.description}</span>
        <button className="flex items-center space-x-4 duration-300 transition-all cursor-pointer hover:bg-white rounded-full pr-4 w-fit text-white hover:text-black">
          <FaArrowRight className="w-12 h-12 p-3 rounded-full bg-white text-black" />
          <span>Shop Now</span>
        </button>
      </div>
      <div className="w-3/5">
        <Image
          src={props.image}
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full object-contain"
        />
      </div>
    </motion.div>
  );
}

export default HomeProduct;
