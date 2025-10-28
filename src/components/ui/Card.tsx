import cn from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface Props {
  children: React.ReactNode;
  variants?: any;
  className?: string;
}

function Card(props: Props) {
  return (
    <AnimatePresence>
      <motion.div
        {...props.variants}
        className={cn(
          "bg-card shadow-black/10 shadow-none p-4 rounded-xl text-card-foreground",
          props.className
        )}
      >
        {props.children}
      </motion.div>
    </AnimatePresence>
  );
}

export default Card;
