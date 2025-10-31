import { create } from "zustand";
import { useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { immer } from "zustand/middleware/immer";
import { VscVerifiedFilled } from "react-icons/vsc";
import { BiSolidErrorCircle } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";

type ToastContent = {
  id: string;
  title?: string;
  description: string;
  variant: "success" | "error";
};

interface ToastState {
  toasts: ToastContent[];
  addToast: (content: Omit<ToastContent, "id">) => void;
  removeToast: (id: string) => void;
}

const useToastState = create<ToastState>()(
  immer((set) => ({
    toasts: [],
    addToast: (content) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      set((state) => {
        state.toasts.push({ ...content, id });
      });

      // Auto remove after 5 seconds
      setTimeout(() => {
        set((state) => {
          state.toasts = state.toasts.filter((toast) => toast.id !== id);
        });
      }, 5000);
    },
    removeToast: (id) =>
      set((state) => {
        state.toasts = state.toasts.filter((toast) => toast.id !== id);
      }),
  }))
);

const ToastItem = ({
  content,
  index,
}: {
  content: ToastContent;
  index: number;
}) => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const translateX = isSwiping ? currentX - startX : 0;
  const removeToast = useToastState((state) => state.removeToast);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isSwiping) {
      setCurrentX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const difference = endX - startX;

    setIsSwiping(false);

    if (Math.abs(difference) > 50) {
      removeToast(content.id);
    } else {
      setCurrentX(startX);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.5, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, x: 100 }}
      transition={{ duration: 0.3, type: "spring" }}
      className={` left-0 absolute flex justify-center items-center px-4 w-full`}
    >
      <div
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        className={`${
          content.variant === "success" ? "bg-green-600" : "bg-red-500"
        } relative flex min-w-[20rem] max-w-md w-full flex-col space-y-1 rounded-2xl p-2 px-6 shadow-lg`}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? "none" : "transform 0.3s ease",
        }}
      >
        <div
          className={`${
            content.variant === "success" ? "bg-green-800" : "bg-red-700"
          } absolute -left-4 -top-4 rounded-full p-2`}
        >
          {content.variant === "success" ? (
            <VscVerifiedFilled className="w-6 h-6 text-white" />
          ) : (
            <BiSolidErrorCircle className="w-6 h-6 text-white" />
          )}
        </div>
        <span className="w-full text-white text-lg text-center capitalize">
          {content.title || content.variant}
        </span>
        <span className="w-full text-white text-sm text-center">
          {content.description}
        </span>
        <HiXMark
          className="top-0 right-0 absolute hover:bg-white/10 p-2 rounded-full w-8 h-8 text-white transition-colors cursor-pointer"
          onClick={() => removeToast(content.id)}
        />
      </div>
    </motion.div>
  );
};

const Toast = () => {
  const toasts = useToastState((state) => state.toasts);

  return (
    <div className="top-8 left-1/2 z-[1000000] fixed w-full max-w-md -translate-x-1/2 pointer-events-none">
      <div className="relative flex flex-col gap-3 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index) => (
            <ToastItem key={toast.id} content={toast} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Toast;

export function toast(content: Omit<ToastContent, "id">) {
  return useToastState.getState().addToast(content);
}

export function closeToast(id: string) {
  useToastState.getState().removeToast(id);
}

export function closeAllToasts() {
  useToastState.setState({ toasts: [] });
}

// Demo component to test the toast system
export function ToastDemo() {
  return (
    <div className="flex justify-center items-center bg-gray-900 min-h-screen">
      <Toast />
      <div className="flex flex-col gap-4">
        <button
          onClick={() =>
            toast({
              variant: "success",
              title: "Success!",
              description: "Your action was completed successfully.",
            })
          }
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white transition-colors"
        >
          Show Success Toast
        </button>
        <button
          onClick={() =>
            toast({
              variant: "error",
              title: "Error!",
              description: "Something went wrong. Please try again.",
            })
          }
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white transition-colors"
        >
          Show Error Toast
        </button>
        <button
          onClick={() => {
            toast({
              variant: "success",
              description: "First toast",
            });
            setTimeout(() => {
              toast({
                variant: "error",
                description: "Second toast",
              });
            }, 500);
            setTimeout(() => {
              toast({
                variant: "success",
                description: "Third toast",
              });
            }, 1000);
          }}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition-colors"
        >
          Show Multiple Toasts
        </button>
        <button
          onClick={() => closeAllToasts()}
          className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg text-white transition-colors"
        >
          Close All Toasts
        </button>
      </div>
    </div>
  );
}
