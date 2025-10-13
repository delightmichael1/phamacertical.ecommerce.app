import cn from "@/utils/cn";
import React from "react";

interface Props {
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

function Button(props: Props) {
  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={cn(
        // Glassy iOS button look
        "relative flex items-center justify-center space-x-2 px-6 py-2 rounded-2xl font-medium text-white backdrop-blur-xl cursor-pointer bg-gradient-to-b from-white/30 to-white/10 border border-white/40 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),_0_4px_20px_rgba(0,0,0,0.2)] hover:from-white/40 hover:to-white/20 hover:shadow-[inset_1px_1px_0px_rgba(255,255,255,0.6),_0_6px_24px_rgba(0,0,0,0.25)] active:scale-[0.97] transition-all duration-300 ease-out select-none",
        props.className,
        props.disabled && "opacity-50 pointer-events-none"
      )}
    >
      {props.children}
      {/* Optional soft reflection effect */}
      <span className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-2xl pointer-events-none" />
    </button>
  );
}

export default Button;
