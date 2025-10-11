import cn from "@/utils/cn";
import React, { useRef } from "react";
import { LuChevronUp } from "react-icons/lu";

interface Props {
  options: string[];
  onClick?: () => void;
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
        "relative inline-block group",
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
          "absolute top-full right-0 z-10 bg-background border border-strokedark divide-y divide-strokedark rounded-lg shadow w-44 hidden group-hover:block duration-300 transition-all",
          props.classNames?.container
        )}
      >
        {props.options.map((option) => (
          <div
            className="px-4 py-2 text-sm text-gray-500 cursor-pointer hover:bg-primary/10"
            key={option}
            onClick={() => {
              setSelectedValue(option);
              props.onClick && props.onClick();
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
