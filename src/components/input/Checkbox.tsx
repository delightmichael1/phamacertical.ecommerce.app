import React from "react";

interface Props {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function Checkbox(props: Props) {
  return (
    <label className="flex items-center cursor-pointer group">
      <input
        type="checkbox"
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`relative w-7 h-7 rounded-lg transition-all duration-300 flex items-center justify-center ${
          props.checked
            ? "bg-primary shadow-lg shadow-primary/50"
            : "bg-strokedark/70 border-2 border-strokedark group-hover:border-white/60 group-hover:bg-strokedark/50"
        }`}
      >
        {props.checked && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span className="ml-4 text-sm font-medium group-hover:text-primary transition-colors">
        {props.label}
      </span>
    </label>
  );
}

export default Checkbox;
