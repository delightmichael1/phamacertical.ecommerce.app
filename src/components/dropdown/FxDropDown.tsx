"use client";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useOutsideClick";
import cn from "@/utils/cn";
import React from "react";

interface Props {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right"; // Alignment option
  classnames?: {
    trigger?: string;
    dropdown?: string;
  };
}

export default function Dropdown(props: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useClickOutside(divRef, () => {
    setShowDropdown(false);
  });

  useEffect(() => {
    if (showDropdown && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const alignment = props.align || "left";

      setPosition({
        top: rect.bottom + window.scrollY,
        left:
          alignment === "right"
            ? rect.right + window.scrollX
            : rect.left + window.scrollX,
      });
    }
  }, [showDropdown, props.align]);

  return (
    <div className={cn("inline-block relative", props.className)}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={() => setShowDropdown(!showDropdown)}
        className={cn("cursor-pointer", props.classnames?.trigger)}
      >
        {props.trigger}
      </div>

      {/* Dropdown menu */}
      {showDropdown &&
        createPortal(
          <div
            style={{
              top: position.top,
              [props.align === "right" ? "right" : "left"]:
                props.align === "right"
                  ? `calc(100vw - ${position.left}px)`
                  : position.left,
              zIndex: 9999,
            }}
            ref={divRef}
            className={cn(
              "absolute bg-white shadow-lg mt-2 p-3 border border-border rounded-lg w-full max-w-64",
              props.classnames?.dropdown
            )}
          >
            <div className="-mx-3 max-h-60 overflow-y-auto">
              {React.Children.map(props.children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child as React.ReactElement<any>, {
                    onClick: () => {
                      if ((child.props as any).onClick) {
                        (child.props as any).onClick();
                      }
                      setShowDropdown(false);
                    },
                  });
                }
                return child;
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

// Helper component for dropdown items
export function DropdownItem({
  children,
  icon,
  onClick,
  className,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 hover:bg-blue-100 px-4 py-2.5 text-gray-700 text-sm transition-all duration-150 cursor-pointer",
        className
      )}
    >
      {icon && <span className="text-gray-500">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

// Helper component for dividers
export function DropdownDivider() {
  return <div className="my-1 border-border border-t" />;
}

// Helper component for headers
export function DropdownHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-4 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wide",
        className
      )}
    >
      {children}
    </div>
  );
}
