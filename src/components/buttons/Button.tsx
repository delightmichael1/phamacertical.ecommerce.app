import cn from "@/utils/cn";
import React from "react";

interface Props {
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

function Button(props: Props) {
  return (
    <button
      className={cn(
        "bg-primary px-4 rounded-lg py-2 shadow-md cursor-pointer shadow-black/30 hover:scale-105 hover:shadow-lg duration-300 transition-all",
        props.className
      )}
    >
      {props.children}
    </button>
  );
}

export default Button;
