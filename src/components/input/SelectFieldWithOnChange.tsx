import React from "react";
import cn from "@/utils/cn";
import { useField } from "formik";

interface Props {
  className?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  startContent?: React.ReactNode;
  classnames?: {
    base?: string;
    input?: string;
  };
  onChange?: (value: string) => void;
  [key: string]: any;
}

const SelectFieldWithOnChange: React.FC<Props> = ({
  isRequired = true,
  ...props
}) => {
  return (
    <label
      htmlFor={props.id}
      className={cn(
        "flex border border-strokedark rounded-xl w-full",
        props.classNames?.base,
        props.className
      )}
    >
      <div className="flex justify-center items-center p-4 text-primary">
        {props.icon}
      </div>
      <div className="flex items-center space-x-2 p-2 w-full">
        <div className="flex flex-col space-y-1 w-full">
          <div className="flex items-center space-x-2 text-xs">
            <span>{props.label}</span>
          </div>
          <select
            {...props}
            onChange={(e) => props.onChange && props.onChange(e.target.value)}
            disabled={props.isDisabled}
            className={cn(
              "flex items-center space-x-2 py-2 outline-none w-full",
              props.classNames?.input
            )}
          >
            <option value="" disabled>
              {props.placeholder}
            </option>
            {props.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </label>
  );
};

export default React.memo(SelectFieldWithOnChange);
