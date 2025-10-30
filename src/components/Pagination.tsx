import cn from "@/utils/cn";
import React from "react";
import { FaCaretLeft } from "react-icons/fa6";

type Props = {
  pageNumber: number;
  className?: string;
  contentsLength: number;
  setPageNumber: (value: number) => void;
};

const Pagination: React.FC<Props> = (props) => {
  const pages = new Array(props.pageNumber).fill(0);
  const pageRef = React.useRef<HTMLDivElement>(null);
  const [startX, setStartX] = React.useState<number>(0);
  const [scrollX, setScrollX] = React.useState<number>(0);
  const horizontalRef = React.useRef<HTMLDivElement>(null);
  const [isDownX, setIsDownX] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (pageRef.current) {
      pageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.pageNumber]);

  const mouseIsDownX = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDownX(true);
    if (horizontalRef.current) {
      setStartX(e.pageX - horizontalRef.current.offsetLeft);
      setScrollX(horizontalRef.current.scrollLeft);
    }
  };

  const mouseUpX = () => {
    setIsDownX(false);
  };

  const mouseLeaveX = () => {
    setIsDownX(false);
  };

  const mouseMoveX = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDownX) {
      e.preventDefault();
      const x = e.pageX - (horizontalRef.current?.offsetLeft || 0);
      const walkX = (x - startX) * 3;
      if (horizontalRef.current) {
        horizontalRef.current.scrollLeft = scrollX - walkX;
      }
    }
  };
  4567;
  return (
    <div
      className={cn(
        "group flex space-x-0.5 max-w-full md:max-w-96 overflow-hidden text-xs transition-all duration-500",
        props.className
      )}
    >
      <div
        className={`${
          props.pageNumber === 1
            ? "bg-gray-900/20 text-muted-foreground"
            : "cursor-pointer bg-gray-900/50 text-white"
        } flex h-10 w-10 items-center justify-center rounded-l-md p-4`}
        onClick={() => {
          props.pageNumber !== 1 && props.setPageNumber(props.pageNumber - 1);
        }}
        aria-hidden="true"
      >
        <FaCaretLeft className="w-5 h-5" />
      </div>
      <div
        className="flex overflow-x-auto no-scrollbar"
        ref={horizontalRef}
        onMouseDown={mouseIsDownX}
        onMouseLeave={mouseLeaveX}
        onMouseUp={mouseUpX}
        onMouseMove={mouseMoveX}
      >
        <div className="flex">
          {pages.map((page, index) => (
            <div
              className={`${
                props.pageNumber === index + 1
                  ? "flex bg-gray-900/50"
                  : "hidden bg-gray-900/20 text-muted-foreground group-hover:flex"
              } h-10 w-10 cursor-pointer flex-col items-center justify-center duration-500`}
              key={index}
              onClick={() => props.setPageNumber(index + 1)}
              aria-hidden="true"
              ref={pageRef}
            >
              <span className="text-muted-foreground text-xxs">Page</span>
              <span>{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`${
          props.contentsLength < 5
            ? "bg-gray-900/20 text-muted-foreground"
            : "cursor-pointer bg-gray-900/50 text-white"
        } flex h-10 w-10 items-center justify-center rounded-r-md p-4`}
        onClick={() => {
          props.contentsLength > 5 && props.setPageNumber(props.pageNumber + 1);
        }}
        aria-hidden="true"
      >
        <FaCaretLeft className="w-5 h-5 rotate-180" />
      </div>
    </div>
  );
};

export default Pagination;
