import cn from "@/utils/cn";
import { createPortal } from "react-dom";
import { FaXmark } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  isOpen: boolean;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);

  const openModal = (content: ReactNode) => {
    setModalContent(content);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
    document.body.style.overflow = "unset";
  };

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      {isOpen && <Modal onClose={closeModal}>{modalContent}</Modal>}
    </ModalContext.Provider>
  );
};

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  const [windowHeight, setWindowHeight] = useState(0);
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("resize", handleResize);
    };
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, type: "spring" }}
        className={cn(
          "top-0 left-0 z-[100] fixed flex justify-center items-center bg-black/50 backdrop-blur-lg w-full h-full"
        )}
        onClick={handleBackdropClick}
      >
        <div
          className="relative bg-card shadow-black/10 shadow-md p-4 rounded-xl min-w-xl overflow-y-auto"
          style={{ maxHeight: `${0.9 * windowHeight}px` }}
        >
          <button
            onClick={onClose}
            className="top-4 right-4 absolute flex justify-center items-center hover:bg-red-500/10 px-2 py-2 rounded-full w-10 max-w-10 h-10 hover:text-red-500 duration-300 cursor-pointer"
          >
            <FaXmark className="min-w-4 h-4" />
          </button>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
