import cn from "@/utils/cn";
import { FaCaretLeft } from "react-icons/fa6";
import React, { useRef, useState, useEffect, MouseEvent } from "react";

type Props = {
  limit?: number;
  pageNumber: number;
  className?: string;
  contentsLength: number;
  variant?: "default" | "primary";
  setPageNumber: (value: number) => void;
};

const Pagination: React.FC<Props> = ({
  limit = 5,
  pageNumber,
  className,
  contentsLength,
  variant = "default",
  setPageNumber,
}) => {
  const pages = Array.from({ length: pageNumber }, (_, i) => i + 1);

  const [startX, setStartX] = useState<number>(0);
  const [scrollX, setScrollX] = useState<number>(0);
  const [isDownX, setIsDownX] = useState<boolean>(false);

  const activePageRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  const isFirstPage = pageNumber === 1;
  const isLastPage = contentsLength < limit;
  const isPrimary = variant === "primary";

  useEffect(() => {
    if (activePageRef.current && horizontalRef.current) {
      const container = horizontalRef.current;
      const activeElement = activePageRef.current;

      const scrollLeft =
        activeElement.offsetLeft -
        container.offsetWidth / 2 +
        activeElement.offsetWidth / 2;

      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [pageNumber]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDownX(true);
    if (horizontalRef.current) {
      setStartX(e.pageX - horizontalRef.current.offsetLeft);
      setScrollX(horizontalRef.current.scrollLeft);
    }
  };

  const handleMouseUp = () => {
    setIsDownX(false);
  };

  const handleMouseLeave = () => {
    setIsDownX(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDownX || !horizontalRef.current) return;

    e.preventDefault();
    const x = e.pageX - horizontalRef.current.offsetLeft;
    const walkX = (x - startX) * 3;
    horizontalRef.current.scrollLeft = scrollX - walkX;
  };

  const goToPreviousPage = () => {
    if (!isFirstPage) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (!isLastPage) {
      setPageNumber(pageNumber + 1);
    }
  };

  const goToPage = (page: number) => {
    setPageNumber(page);
  };

  const getButtonBaseClasses = (isActive: boolean, isDisabled: boolean) => {
    if (isDisabled) {
      return `${
        isPrimary ? "bg-primary/50" : "bg-gray-900/20"
      } text-muted-foreground`;
    }

    if (isActive) {
      return `cursor-pointer ${
        isPrimary ? "bg-primary/70" : "bg-gray-900/50"
      } text-white`;
    }

    return `cursor-pointer ${
      isPrimary ? "bg-primary/70" : "bg-gray-900/50"
    } text-white`;
  };

  const getPageButtonClasses = (page: number) => {
    const isActive = pageNumber === page;

    if (isActive) {
      return `flex ${isPrimary ? "bg-primary/70" : "bg-gray-900/50"}`;
    }

    return `hidden ${
      isPrimary ? "bg-primary/20" : "bg-gray-900/20"
    } text-muted-foreground group-hover:flex`;
  };

  return (
    <div
      className={cn(
        "group flex space-x-0.5 max-w-full md:max-w-96 overflow-hidden text-xs transition-all duration-500",
        className
      )}
    >
      <div
        className={`${getButtonBaseClasses(
          false,
          isFirstPage
        )} flex h-10 w-10 items-center justify-center rounded-l-md p-4`}
        onClick={goToPreviousPage}
        aria-label="Previous page"
        role="button"
        tabIndex={isFirstPage ? -1 : 0}
      >
        <FaCaretLeft className="w-5 h-5 text-white" />
      </div>

      <div
        className="flex overflow-x-auto no-scrollbar"
        ref={horizontalRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex">
          {pages.map((page) => {
            const isActive = pageNumber === page;

            return (
              <div
                className={`${getPageButtonClasses(
                  page
                )} h-10 w-10 cursor-pointer flex-col items-center justify-center duration-500 text-white`}
                key={page}
                onClick={() => goToPage(page)}
                role="button"
                tabIndex={0}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? "page" : undefined}
                ref={isActive ? activePageRef : null}
              >
                <span className="text-xxs">Page</span>
                <span>{page}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`${getButtonBaseClasses(
          false,
          isLastPage
        )} flex h-10 w-10 items-center justify-center rounded-r-md p-4`}
        onClick={goToNextPage}
        aria-label="Next page"
        role="button"
        tabIndex={isLastPage ? -1 : 0}
      >
        <FaCaretLeft className="w-5 h-5 text-white rotate-180" />
      </div>
    </div>
  );
};

export default Pagination;
