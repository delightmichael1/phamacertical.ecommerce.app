import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const Footer: React.FC = () => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showFooter, setShowFooter] = useState(true);

  const controlHeader = (mainContainer: HTMLElement | null) => {
    if (mainContainer) {
      const currentScroll = mainContainer.scrollTop;
      if (currentScroll > lastScrollY) {
        setShowFooter(false);
      } else {
        setShowFooter(true);
      }
      setLastScrollY(currentScroll);
    }
  };

  useEffect(() => {
    const mainContainer = document.getElementById("main");
    mainContainer?.addEventListener("scroll", () =>
      controlHeader(mainContainer)
    );
    return () => {
      mainContainer?.addEventListener("scroll", () =>
        controlHeader(mainContainer)
      );
    };
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {showFooter && (
        <motion.footer
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="right-0 bottom-0 left-0 fixed backdrop-blur-lg"
        >
          <div className="py-6">
            <div className="mx-auto px-4 container">
              <div className="flex md:flex-row flex-col justify-center items-center gap-4">
                <p className="text-gray-600 text-sm">
                  Copyright &copy; 2025 PharmNex. All Rights Reserved.
                </p>
              </div>
            </div>
          </div>
        </motion.footer>
      )}
    </AnimatePresence>
  );
};

export default Footer;
