import cn from "@/utils/cn";
import React, { useRef } from "react";
import { LuChevronUp } from "react-icons/lu";

interface Props {
  options: string[];
  onClick?: (e: string) => void;
  className?: string;
  classNames?: {
    base?: string;
    container?: string;
    trigger?: string;
  };
}

function Dropdown(props: Props) {
  const dropref = useRef<HTMLDivElement>(null);
  const [selectedValue, setSelectedValue] = React.useState(props.options[0]);

  return (
    <div
      ref={dropref}
      className={cn(
        "group inline-block relative",
        props.className,
        props.classNames?.base
      )}
    >
      <div
        className={cn(
          "flex items-center space-x-2 cursor-pointer",
          props.classNames?.trigger
        )}
      >
        <span>{selectedValue}</span>
        <LuChevronUp className="w-4 h-4 rotate-180" />
      </div>
      <div
        className={cn(
          "hidden group-hover:block top-full right-0 z-10 absolute bg-background shadow border border-strokedark rounded-lg divide-y divide-strokedark/40 w-44 transition-all duration-300",
          props.classNames?.container
        )}
      >
        {props.options.map((option) => (
          <div
            className="hover:bg-primary/10 px-4 py-2 text-gray-500 text-sm cursor-pointer"
            key={option}
            onClick={() => {
              setSelectedValue(option);
              props.onClick && props.onClick(option);
            }}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dropdown;
