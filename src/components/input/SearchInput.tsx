import cn from "@/utils/cn";
import React from "react";
import { FiSearch } from "react-icons/fi";

interface Props {
  className?: string;
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
        "bg-background rounded-full flex items-center space-x-2  w-full max-w-[40rem] p-1",
        props.className,
        props.classNames?.container
      )}
    >
      <input
        className={cn(
          "bg-transparent outline-none w-full px-6 placeholder:text-gray-500",
          props.classNames?.input
        )}
        placeholder="Search..."
      />
      <button
        type="button"
        className={cn(
          "rounded-full bg-primary text-white p-3 px-6 cursor-pointer",
          props.classNames?.button
        )}
      >
        <FiSearch className="w-5 h-5" />
      </button>
    </div>
  );
}

export default SearchInput;
