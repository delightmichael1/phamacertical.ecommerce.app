import React from "react";
import cn from "@/utils/cn";
import { motion } from "framer-motion";
import Button from "../buttons/Button";
import { FiSearch } from "react-icons/fi";

interface Props {
  className?: string;
  placeholder?: string;
  classNames?: {
    container?: string;
    input?: string;
    button?: string;
  };
  onClick?: () => void;
  onChange?: (value: string) => void;
}

function SearchInput(props: Props) {
  return (
    <div
      className={cn(
        "group relative flex items-center space-x-2 bg-background p-1 rounded-full w-full max-w-[40rem] overflow-hidden text-sm",
        props.className,
        props.classNames?.container
      )}
    >
      <label htmlFor="search" className="w-full">
        <input
          id="search"
          name="search"
          className={cn(
            "bg-transparent px-6 outline-none w-full placeholder:text-gray-500",
            props.classNames?.input
          )}
          placeholder={
            props.placeholder ? props.placeholder : "Search product here..."
          }
          onChange={(e) => props.onChange && props.onChange(e.target.value)}
        />
        <motion.div
          initial={{ x: 0, rotate: 180 }}
          animate={{ x: [300, 0, 300], rotate: 180 }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="group-focus-within:hidden top-1 bottom-1 left-1 absolute bg-background rounded-l-full w-56 cursor-text"
        />
      </label>
      <Button
        type="button"
        className={cn(
          "z-50 bg-primary px-6 rounded-full text-white cursor-pointer",
          props.classNames?.button
        )}
        onClick={props.onClick}
      >
        <FiSearch className="w-5 h-5" />
      </Button>
    </div>
  );
}

export default SearchInput;
