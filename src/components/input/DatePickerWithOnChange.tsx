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
  onChange?: (value: string) => void;
  minDate?: string | Date;
  maxDate?: string | Date;
  classnames?: {
    base?: string;
    input?: string;
  };
  [key: string]: any;
}

export default function DateFieldWithOnChange(props: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useClickOutside(divRef, () => {
    setShowCalendar(false);
    setShowYearPicker(false);
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const minDateObj = props.minDate ? new Date(props.minDate) : null;
  const maxDateObj = props.maxDate ? new Date(props.maxDate) : null;

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

  const isDateDisabled = (date: Date) => {
    if (minDateObj && date < minDateObj) return true;
    if (maxDateObj && date > maxDateObj) return true;
    return false;
  };

  const prevMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    if (minDateObj && newMonth < minDateObj) {
      return;
    }
    setCurrentMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    if (maxDateObj && newMonth > maxDateObj) {
      return;
    }
    setCurrentMonth(newMonth);
  };

  const handleSelectDate = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (isDateDisabled(newDate)) return;

    setSelectedDate(newDate);
    setShowCalendar(false);
  };

  const handleSelectYear = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearPicker(false);
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

  const getYearRange = () => {
    const currentYear = currentMonth.getFullYear();
    const minYear = minDateObj?.getFullYear() || currentYear - 100;
    const maxYear = maxDateObj?.getFullYear() || currentYear + 100;

    const years: number[] = [];
    for (let year = minYear; year <= maxYear; year++) {
      years.push(year);
    }
    return years;
  };

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      props.onChange?.(formattedDate);
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

  const isPrevMonthDisabled = minDateObj
    ? new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1) <
      new Date(minDateObj.getFullYear(), minDateObj.getMonth(), 1)
    : false;

  const isNextMonthDisabled = maxDateObj
    ? new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1) >
      new Date(maxDateObj.getFullYear(), maxDateObj.getMonth(), 1)
    : false;

  return (
    <div
      className={cn("relative w-full", props.classNames?.base, props.className)}
    >
      <div
        className={
          "flex border border-strokedark hover:border-primary rounded-xl w-full duration-300"
        }
      >
        <div className="flex justify-center items-center p-4 text-primary">
          {props.icon}
        </div>
        <div ref={inputRef} className="flex flex-col space-y-1 p-2 w-full">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-500">{props.label}</span>
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
            {!showYearPicker ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={prevMonth}
                    disabled={isPrevMonthDisabled}
                    className={`p-1 rounded-full ${
                      isPrevMonthDisabled
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <FaChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowYearPicker(true)}
                    className="hover:bg-gray-100 px-3 py-1 rounded-md font-semibold transition-colors"
                  >
                    {format(currentMonth, "MMMM yyyy")}
                  </button>
                  <button
                    onClick={nextMonth}
                    disabled={isNextMonthDisabled}
                    className={`p-1 rounded-full ${
                      isNextMonthDisabled
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <FaChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 mb-1 font-medium text-gray-600 text-sm text-center">
                  {daysOfWeek.map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 text-center">
                  {getDaysArray().map((day, index) => {
                    if (!day) {
                      return (
                        <div key={index} className="p-2 cursor-default"></div>
                      );
                    }

                    const dateObj = new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      day
                    );

                    const isToday =
                      new Date().toDateString() === dateObj.toDateString();

                    const isSelected =
                      selectedDate &&
                      selectedDate.toDateString() === dateObj.toDateString();

                    const isDisabled = isDateDisabled(dateObj);

                    return (
                      <div
                        key={index}
                        className={`p-2 text-sm rounded-lg transition-all duration-150 ${
                          isDisabled
                            ? "text-gray-300 cursor-not-allowed"
                            : "cursor-pointer hover:bg-blue-100"
                        } ${isToday ? "border border-blue-400" : ""} ${
                          isSelected
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : ""
                        }`}
                        onClick={() => !isDisabled && handleSelectDate(day)}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => setShowYearPicker(false)}
                    className="hover:bg-gray-100 px-3 py-1 rounded-md text-gray-600 text-sm"
                  >
                    <FaChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <span className="font-semibold">Select Year</span>
                  <div className="w-16"></div>
                </div>

                <div className="gap-2 grid grid-cols-3 max-h-64 overflow-y-auto">
                  {getYearRange().map((year) => {
                    const isCurrentYear = year === currentMonth.getFullYear();

                    return (
                      <button
                        key={year}
                        onClick={() => handleSelectYear(year)}
                        className={`p-2 text-sm rounded-lg transition-all duration-150 hover:bg-blue-100 ${
                          isCurrentYear
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : ""
                        }`}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
