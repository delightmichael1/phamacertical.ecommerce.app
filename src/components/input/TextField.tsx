import React from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useField } from "formik";
import cn from "@/utils/cn";

interface Props {
  className?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  endContent?: React.ReactNode;
  startContent?: React.ReactNode;
  classnames?: {
    base?: string;
    input?: string;
  };
  [key: string]: any;
}

const TextField: React.FC<Props> = ({ isRequired = true, ...props }) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <label
      htmlFor={props.id}
      className={cn(
        "flex border border-strokedark rounded-lg w-full",
        props.classNames?.base,
        props.className,
        meta.touched && meta.error && "border-red-500 text-red-500"
      )}
    >
      <div className="p-4 flex border-r border-strokedark items-center justify-center">
        {props.icon}
      </div>
      <div className="flex items-center space-x-2 p-2 w-full">
        <div className="flex flex-col space-y-1 w-full">
          <div className="flex items-center space-x-2 text-xs">
            <span>{props.label}</span>
            {props.isRequired && <span className="text-red-500">*</span>}
            {meta.touched && meta.error && <span>: {meta.error}</span>}
          </div>
          <input
            {...field}
            {...props}
            disabled={props.isDisabled}
            type={
              props.type === "password"
                ? showPassword
                  ? "text"
                  : props.type
                : props.type
            }
            className={cn(
              "flex-1 outline-none bg-transparent",
              props.classNames?.input
            )}
          />
        </div>
        {props.type === "password" && (
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <LuEyeOff className="text-default-500" size={20} />
            ) : (
              <LuEye className="text-default-500" size={20} />
            )}
          </button>
        )}
      </div>
    </label>
  );
};

export default React.memo(TextField);
