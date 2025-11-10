"use client";
import cn from "@/utils/cn";
import { useField } from "formik";
import { createPortal } from "react-dom";
import { useClickOutside } from "@/hooks/useOutsideClick";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronRight, FaSearch } from "react-icons/fa";

interface Option {
  label: string;
  value: string;
  subOptions?: Option[];
}

interface Props {
  label: string;
  name: string;
  options: Option[];
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  icon?: React.ReactNode;
  classNames?: {
    base?: string;
    input?: string;
  };
}

export default function SelectField(props: Props) {
  const [search, setSearch] = useState("");
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [field, meta, helpers] = useField(props);
  const [showDropdown, setShowDropdown] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const selectedOption = props.options
    .flatMap((opt) => (opt.subOptions ? opt.subOptions : [opt]))
    .find((opt) => opt.value === field.value);

  useClickOutside(divRef, () => setShowDropdown(false));

  useEffect(() => {
    if (showDropdown && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [showDropdown]);

  const handleSelect = (value: string) => {
    helpers.setValue(value);
    setShowDropdown(false);
  };

  const filteredOptions = props.options.filter((opt) => {
    if (opt.label.toLowerCase().includes(search.toLowerCase())) return true;
    if (
      opt.subOptions?.some((sub) =>
        sub.label.toLowerCase().includes(search.toLowerCase())
      )
    )
      return true;
    return false;
  });

  return (
    <div
      className={cn(
        "relative rounded-xl w-full",
        props.classNames?.base,
        props.className
      )}
    >
      <div
        className={cn(
          "flex border border-strokedark hover:border-primary rounded-xl w-full duration-300",
          meta.touched && meta.error && "border-red-500 text-red-500"
        )}
      >
        <div className="flex justify-center items-center p-4 text-primary">
          {props.icon}
        </div>
        <div ref={inputRef} className="flex flex-col space-y-1 p-2 w-full">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-500">{props.label}</span>
            {props.isRequired && <span className="text-red-500">*</span>}
            {meta.touched && meta.error && (
              <span className="text-red-500">: {meta.error}</span>
            )}
          </div>

          <div
            onClick={() => !props.isDisabled && setShowDropdown(!showDropdown)}
            className={cn(
              "flex justify-between items-center rounded-md cursor-pointer",
              props.isDisabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <span className="text-gray-700 truncate">
              {selectedOption
                ? selectedOption.label
                : props.placeholder || "Select option"}
            </span>
            <FaChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {showDropdown &&
        createPortal(
          <div
            style={{
              top: position.top,
              left: position.left,
              zIndex: 9999,
            }}
            ref={divRef}
            className="absolute bg-white shadow-lg mt-2 p-3 border border-border rounded-lg w-full max-w-64"
          >
            {/* Search Bar */}
            <div className="flex items-center bg-gray-50 mb-2 px-2 py-1 border rounded-md">
              <FaSearch className="mr-2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none w-full text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="max-h-64 overflow-y-auto text-sm">
              {filteredOptions.length === 0 && (
                <div className="py-2 text-gray-400 text-center">No results</div>
              )}
              {filteredOptions.map((opt) => (
                <div key={opt.value} className="mb-1">
                  {/* Parent Option */}
                  {opt.subOptions ? (
                    <>
                      <div
                        onClick={() =>
                          setExpanded(expanded === opt.value ? null : opt.value)
                        }
                        className="flex justify-between items-center hover:bg-gray-100 px-2 py-1 rounded-md font-medium text-gray-700 cursor-pointer"
                      >
                        <span>{opt.label}</span>
                        <FaChevronRight
                          className={cn(
                            "w-3 h-3 transition-transform",
                            expanded === opt.value && "rotate-90"
                          )}
                        />
                      </div>

                      {expanded === opt.value && (
                        <div className="space-y-1 mt-1 ml-3 pl-2 border-gray-200 border-l">
                          {opt.subOptions.map((sub) => (
                            <div
                              key={sub.value}
                              onClick={() => handleSelect(sub.value)}
                              className={cn(
                                "hover:bg-blue-100 px-2 py-1 rounded-md cursor-pointer",
                                field.value === sub.value &&
                                  "bg-blue-500 text-white hover:bg-blue-600"
                              )}
                            >
                              {sub.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      onClick={() => handleSelect(opt.value)}
                      className={cn(
                        "hover:bg-blue-100 px-2 py-1 rounded-md cursor-pointer",
                        field.value === opt.value &&
                          "bg-blue-500 text-white hover:bg-blue-600"
                      )}
                    >
                      {opt.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
