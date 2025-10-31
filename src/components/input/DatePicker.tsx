"use client";
import {
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarAlt,
} from "react-icons/fa";
import cn from "@/utils/cn";
import { useField } from "formik";
import { format } from "date-fns";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useOutsideClick";

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

export default function DateField(props: Props) {
  const [field, meta] = useField(props);
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useClickOutside(divRef, () => {
    setShowCalendar(false);
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleSelectDate = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(newDate);
    setShowCalendar(false);
  };

  const getDaysArray = () => {
    const days: (number | null)[] = [];
    const startDay = startOfMonth.getDay();

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let d = 1; d <= endOfMonth.getDate(); d++) {
      days.push(d);
    }

    return days;
  };

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      field.onChange({
        target: {
          name: field.name,
          value: formattedDate,
        },
      });
    }
  }, [selectedDate]);

  useEffect(() => {
    if (showCalendar && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [showCalendar]);

  return (
    <div
      className={cn("relative w-full", props.classNames?.base, props.className)}
    >
      {/* Input field */}
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
            {meta.touched && meta.error && <span>: {meta.error}</span>}
          </div>
          <div
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex justify-between items-center bg-white cursor-pointer"
          >
            <span>
              {selectedDate
                ? format(selectedDate, "yyyy-MM-dd")
                : "Select date"}
            </span>
            <FaRegCalendarAlt className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Calendar popup */}
      {showCalendar &&
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
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={prevMonth}
                className="hover:bg-gray-100 p-1 rounded-full"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <button
                onClick={nextMonth}
                className="hover:bg-gray-100 p-1 rounded-full"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 mb-1 font-medium text-gray-600 text-sm text-center">
              {daysOfWeek.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Dates grid */}
            <div className="grid grid-cols-7 text-center">
              {getDaysArray().map((day, index) => {
                const isToday =
                  day &&
                  new Date().toDateString() ===
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      day
                    ).toDateString();

                const isSelected =
                  day &&
                  selectedDate &&
                  selectedDate.toDateString() ===
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      day
                    ).toDateString();

                return (
                  <div
                    key={index}
                    className={`p-2 text-sm rounded-lg cursor-pointer transition-all duration-150 ${
                      day
                        ? "hover:bg-blue-100"
                        : "cursor-default bg-transparent"
                    } ${isToday ? "border border-blue-400" : ""} ${
                      isSelected
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : ""
                    }`}
                    onClick={() => day && handleSelectDate(day)}
                  >
                    {day ?? ""}
                  </div>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
