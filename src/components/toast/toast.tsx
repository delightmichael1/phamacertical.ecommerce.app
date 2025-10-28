import { create } from "zustand";
import { motion } from "framer-motion";
import { HiXMark } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { immer } from "zustand/middleware/immer";
import { VscVerifiedFilled } from "react-icons/vsc";
import { BiSolidErrorCircle } from "react-icons/bi";

const Toast = () => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const translateX = isSwiping ? currentX - startX : 0;

  const show = useToastState((state) => state.show);
  const content = useToastState((state) => state.content);

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        useToastState.setState((state) => {
          state.show = false;
          state.content = undefined;
        });
      }, 10000);
    }
  }, [show]);

  const handleTouchStart = (e: any) => {
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: any) => {
    if (isSwiping) {
      setCurrentX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: any) => {
    const endX = e.changedTouches[0].clientX;
    const difference = endX - startX;

    setIsSwiping(false);

    if (Math.abs(difference) > 50) {
      useToastState.setState((state) => {
        state.show = false;
        state.content = undefined;
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, type: "spring" }}
      className={`${
        show ? "block" : "hidden"
      } absolute left-1/2 translate-x-[-50%] w-fit top-8 z-[1000000] flex h-fit items-center justify-center break-normal bg-transparent px-4 text-xs text-white`}
    >
      <div
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        className={`${
          content?.variant === "success" ? "bg-green-600" : "bg-red-500"
        } relative flex min-w-[20rem] flex-col space-y-1 rounded-2xl bg-gray-800 p-2 px-6 shadow`}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? "none" : "transform 0.3s ease",
        }}
      >
        <div
          className={`${
            content?.variant === "success" ? "bg-green-800" : "bg-red-700"
          } absolute -left-4 -top-4 rounded-full bg-gray-800 p-2`}
        >
          {content?.variant === "success" ? (
            <VscVerifiedFilled className="w-6 h-6" />
          ) : (
            <BiSolidErrorCircle className="w-6 h-6" />
          )}
        </div>
        <span className="w-full text-lg text-center capitalize">
          {content?.title ? content.title : content?.variant}
        </span>
        <span className="w-full text-center">{content?.description}</span>
        <HiXMark
          className="top-0 right-0 absolute p-2 w-8 h-8 cursor-pointer"
          onClick={() =>
            useToastState.setState((state) => {
              state.show = false;
              state.content = undefined;
            })
          }
        />
      </div>
    </motion.div>
  );
};

type ToastContent = {
  title?: string;
  description: string;
  variant: "success" | "error";
};

interface ToastState {
  show: boolean;
  content: ToastContent | undefined;
  toast: (content: ToastContent) => void;
}

const useToastState = create<ToastState>()(
  immer((set) => ({
    show: false,
    content: undefined,
    toast: (content) => set({ content, show: true }),
  }))
);

export default Toast;

export function toast(content: ToastContent) {
  return useToastState.getState().toast(content);
}

export function closeToast() {
  useToastState.setState((state) => {
    state.show = false;
    state.content = undefined;
  });
}
