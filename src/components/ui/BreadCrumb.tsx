"use client";
import cn from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronRight, FaHome } from "react-icons/fa";

interface BreadcrumbProps {
  className?: string;
  homeIcon?: React.ReactNode;
  separator?: React.ReactNode;
  maxItems?: number;
  itemClasses?: string;
  activeItemClasses?: string;
  separatorClasses?: string;
  labels?: Record<string, string>;
}

export default function Breadcrumb({
  className,
  homeIcon = <FaHome className="w-4 h-4" />,
  separator = <FaChevronRight className="w-3 h-3" />,
  maxItems,
  itemClasses,
  activeItemClasses,
  separatorClasses,
  labels = {},
}: BreadcrumbProps) {
  const pathname = usePathname();

  // Split pathname and filter empty strings
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // If we're on the home page, don't show breadcrumb
  if (pathSegments.length === 0) {
    return null;
  }

  // Function to format segment text
  const formatSegment = (segment: string) => {
    // Check if there's a custom label
    if (labels[segment]) {
      return labels[segment];
    }

    return segment
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbItems = [
    {
      label: homeIcon,
      href: "/",
      isHome: true,
      isEllipsis: false,
    },
    ...pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      return {
        label: formatSegment(segment),
        href,
        isHome: false,
      };
    }),
  ];

  // Handle maxItems with ellipsis
  let displayItems = breadcrumbItems;
  if (maxItems && breadcrumbItems.length > maxItems) {
    const firstItem = breadcrumbItems[0];
    const lastItems = breadcrumbItems.slice(-(maxItems - 2));
    displayItems = [
      firstItem,
      {
        label: "...",
        href: "#",
        isHome: false,
        isEllipsis: true,
      },
      ...lastItems,
    ];
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-2 text-sm", className)}
    >
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = "isEllipsis" in item && item.isEllipsis;

          return (
            <li key={item.href} className="flex items-center space-x-2">
              {isEllipsis ? (
                <span className={cn("text-gray-500", itemClasses)}>
                  {item.label}
                </span>
              ) : isLast ? (
                <span
                  className={cn(
                    "font-medium text-primary",
                    activeItemClasses || itemClasses
                  )}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "text-gray-600 hover:text-primary transition-colors duration-200",
                    itemClasses
                  )}
                >
                  {item.label}
                </Link>
              )}

              {!isLast && (
                <span
                  className={cn("text-gray-400", separatorClasses)}
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Alternative version with dropdown for overflow items
export function BreadcrumbWithDropdown({
  className,
  homeIcon = <FaHome className="w-4 h-4" />,
  separator = <FaChevronRight className="w-3 h-3" />,
  maxItems = 3,
  labels = {},
}: BreadcrumbProps) {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const pathSegments = pathname.split("/").filter((segment) => segment);

  if (pathSegments.length === 0) {
    return null;
  }

  const formatSegment = (segment: string) => {
    if (labels[segment]) {
      return labels[segment];
    }
    return segment
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbItems = [
    {
      label: homeIcon,
      href: "/",
      isHome: true,
    },
    ...pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      return {
        label: formatSegment(segment),
        href,
        isHome: false,
      };
    }),
  ];

  const shouldCollapse = breadcrumbItems.length > maxItems;
  let displayItems = breadcrumbItems;
  let hiddenItems: typeof breadcrumbItems = [];

  if (shouldCollapse) {
    const firstItem = breadcrumbItems[0];
    const lastItems = breadcrumbItems.slice(-(maxItems - 2));
    hiddenItems = breadcrumbItems.slice(
      1,
      breadcrumbItems.length - (maxItems - 2)
    );
    displayItems = [firstItem, ...lastItems];
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-2 text-sm", className)}
    >
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const shouldShowDropdown = index === 0 && shouldCollapse;

          return (
            <li key={item.href} className="flex items-center space-x-2">
              {isLast ? (
                <span className="font-medium text-primary" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </Link>
              )}

              {shouldShowDropdown && (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="px-2 text-gray-600 hover:text-primary"
                  >
                    ...
                  </button>
                  {showDropdown && (
                    <div className="top-full left-0 z-50 absolute bg-white shadow-lg mt-1 border border-gray-200 rounded-md min-w-[150px]">
                      {hiddenItems.map((hiddenItem) => (
                        <Link
                          key={hiddenItem.href}
                          href={hiddenItem.href}
                          className="block hover:bg-gray-100 px-4 py-2 text-gray-700 text-sm"
                          onClick={() => setShowDropdown(false)}
                        >
                          {hiddenItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!isLast && (
                <span className="text-gray-400" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Import React for the dropdown version
import React from "react";
