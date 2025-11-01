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
