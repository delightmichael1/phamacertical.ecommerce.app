import { motion } from "framer-motion";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";

type Props = {
  itemsLength: number;
  isAutoSlide?: boolean;
  children: React.ReactNode;
  autoSlideInterval?: number;
  setCurrentIndex?: React.Dispatch<React.SetStateAction<number>>;
  setListContainerWidth: React.Dispatch<React.SetStateAction<number>>;
};

export type CarouselRef = {
  next: () => void;
  prev: () => void;
};

const Carousel = forwardRef<CarouselRef, Props>(
  (
    {
      children,
      itemsLength,
      setListContainerWidth,
      autoSlideInterval = 5000,
      isAutoSlide = true,
      setCurrentIndex,
    },
    ref
  ) => {
    const touchStartX = useRef(0);
    const currentIndexRef = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      const updateContainerWidth = () => {
        if (containerRef.current) {
          setListContainerWidth(containerRef.current.offsetWidth);
        }
      };

      updateContainerWidth();
      window.addEventListener("resize", updateContainerWidth);
      return () => window.removeEventListener("resize", updateContainerWidth);
    }, [setListContainerWidth]);

    const scrollToIndex = useCallback((index: number, smooth = true) => {
      if (scrollContainerRef.current) {
        const children = scrollContainerRef.current.children;
        if (children[index]) {
          const child = children[index] as HTMLElement;
          const childWidth = child.offsetWidth;
          const containerWidth = scrollContainerRef.current.offsetWidth;

          let targetScroll =
            child.offsetLeft - containerWidth / 2 + childWidth / 2;

          if (smooth) {
            scrollContainerRef.current.scrollTo({
              left: targetScroll,
              behavior: "smooth",
            });
          } else {
            scrollContainerRef.current.scrollLeft = targetScroll;
          }

          currentIndexRef.current = index;

          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }

          scrollTimeoutRef.current = setTimeout(() => {
            currentIndexRef.current = index;
            setCurrentIndex && setCurrentIndex(index);
          }, 5000);
        }
      }
    }, []);

    const handleNext = useCallback(() => {
      const nextIndex =
        currentIndexRef.current + 1 >= itemsLength
          ? 0
          : currentIndexRef.current + 1;

      scrollToIndex(nextIndex, true);
      setCurrentIndex && setCurrentIndex(nextIndex);

      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
      if (isAutoSlide && !isHovered) {
        autoSlideRef.current = setInterval(() => {
          handleNext();
        }, autoSlideInterval);
      }
    }, [itemsLength, scrollToIndex, isAutoSlide, isHovered, autoSlideInterval]);

    const handlePrev = useCallback(() => {
      const prevIndex =
        currentIndexRef.current - 1 < 0
          ? itemsLength - 1
          : currentIndexRef.current - 1;

      scrollToIndex(prevIndex, true);
      setCurrentIndex && setCurrentIndex(prevIndex);

      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
      if (isAutoSlide && !isHovered) {
        autoSlideRef.current = setInterval(() => {
          handleNext();
        }, autoSlideInterval);
      }
    }, [
      itemsLength,
      scrollToIndex,
      isAutoSlide,
      isHovered,
      autoSlideInterval,
      handleNext,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        next: () => handleNext(),
        prev: () => handlePrev(),
      }),
      [handleNext, handlePrev]
    );

    useEffect(() => {
      if (!isAutoSlide) return;

      const startAutoSlide = () => {
        if (autoSlideRef.current) clearInterval(autoSlideRef.current);
        autoSlideRef.current = setInterval(() => {
          handleNext();
        }, autoSlideInterval);
      };

      const handleVisibilityChange = () => {
        if (document.hidden && autoSlideRef.current) {
          clearInterval(autoSlideRef.current);
        } else if (!document.hidden && !isHovered) {
          startAutoSlide();
        }
      };

      if (!isHovered && !document.hidden) {
        startAutoSlide();
      } else if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        if (autoSlideRef.current) clearInterval(autoSlideRef.current);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }, [autoSlideInterval, isHovered, handleNext, isAutoSlide]);

    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;

      if (diff > 50) handleNext();
      else if (diff < -50) handlePrev();
    };

    return (
      <div
        className="relative rounded-lg w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div ref={containerRef} className="relative w-full overflow-hidden">
          <motion.div
            ref={scrollContainerRef}
            className="flex gap-6 pb-4 overflow-x-auto scroll-smooth no-scrollbar"
            initial={{ x: 0 }}
            animate={{ x: 0 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    );
  }
);

Carousel.displayName = "Carousel";
export default Carousel;
