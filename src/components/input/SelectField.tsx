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
  [key: string]: any;
}

const SelectField: React.FC<Props> = ({ isRequired = true, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <label
      htmlFor={props.id}
      className={cn(
        "flex border border-strokedark rounded-xl w-full",
        props.classNames?.base,
        props.className,
        meta.touched && meta.error && "border-red-500 text-red-500"
      )}
    >
      <div className="flex justify-center items-center p-4 text-primary">
        {props.icon}
      </div>
      <div className="flex items-center space-x-2 p-2 w-full">
        <div className="flex flex-col space-y-1 w-full">
          <div className="flex items-center space-x-2 text-xs">
            <span>{props.label}</span>
            {props.isRequired && <span className="text-red-500">*</span>}
            {meta.touched && meta.error && <span>: {meta.error}</span>}
          </div>
          <select
            {...field}
            {...props}
            disabled={props.isDisabled}
            className={cn(
              "flex items-center space-x-2 p-2 outline-none w-full",
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

export default React.memo(SelectField);
