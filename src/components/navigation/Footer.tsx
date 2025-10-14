import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const Footer: React.FC = () => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showFooter, setShowFooter] = useState(true);

  const controlFooter = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setShowFooter(false);
      } else {
        setShowFooter(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlFooter);
    return () => {
      window.removeEventListener("scroll", controlFooter);
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
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-strokedark"
        >
          <div className="bg-card py-6">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
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
