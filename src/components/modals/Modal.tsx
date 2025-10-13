import cn from "@/utils/cn";
import Button from "../buttons/Button";
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
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, type: "spring" }}
        className={cn(
          "fixed top-0 left-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-[100] w-full h-full"
        )}
        onClick={handleBackdropClick}
      >
        <div className="bg-card rounded-xl p-4 shadow-md shadow-black/10 relative min-w-xl">
          <Button
            onClick={onClose}
            className="absolute top-4 right-4 w-fit rounded-ful text-red-500 bg-red-500/10 px-2"
          >
            <FaXmark />
          </Button>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
