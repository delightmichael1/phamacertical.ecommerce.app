import cn from "@/utils/cn";
import { motion } from "framer-motion";
import React from "react";
import { FiSearch } from "react-icons/fi";
import Button from "../buttons/Button";

interface Props {
  className?: string;
  placeholder?: string;
  classNames?: {
    container?: string;
    input?: string;
    button?: string;
  };
}

function SearchInput(props: Props) {
  return (
    <div
      className={cn(
        "bg-background rounded-full flex items-center space-x-2 group text-sm  w-full max-w-[40rem] p-1 relative overflow-hidden",
        props.className,
        props.classNames?.container
      )}
    >
      <label htmlFor="search" className="w-full">
        <input
          id="search"
          name="search"
          className={cn(
            "bg-transparent outline-none w-full px-6 placeholder:text-gray-500",
            props.classNames?.input
          )}
          placeholder={
            props.placeholder ? props.placeholder : "Search product here..."
          }
        />
        <motion.div
          initial={{ x: 0, rotate: 180 }}
          animate={{ x: [300, 0, 300], rotate: 180 }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-1 left-1 bottom-1 w-56 bg-background rounded-l-full group-focus-within:hidden cursor-text"
        />
      </label>
      <Button
        type="button"
        className={cn(
          "rounded-full bg-primary text-white  px-6 cursor-pointer z-50",
          props.classNames?.button
        )}
      >
        <FiSearch className="w-5 h-5" />
      </Button>
    </div>
  );
}

export default SearchInput;
