import Link from "next/link";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

import Button from "../buttons/Button";
import SearchInput from "../input/SearchInput";
import { BiMenuAltLeft, BiMenuAltRight } from "react-icons/bi";

function TopNav() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlHeader = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlHeader);
    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {showHeader && (
        <motion.nav
          id="header"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-primary w-full text-white top-0 fixed z-50 shadow-md"
        >
          <div className="p-4 bg-primary">
            <div className="container mx-auto flex items-center justify-between text-sm">
              <Link href="/">
                <Image
                  src={"/logo/logo.svg"}
                  alt="logo"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-auto h-full md:max-h-16 max-h-10"
                />
              </Link>

              <div className="flex-col space-y-2 flex-1 items-center justify-center hidden md:flex mx-8">
                <SearchInput className="text-black" />
              </div>
              <div className="md:flex items-center space-x-3 hidden">
                <Link href={"#"}>
                  <FaRegHeart className="p-2 w-10 h-10 hover:scale-105 hover:text-accent duration-300" />
                </Link>
                <Link href={"/cart"}>
                  <HiOutlineShoppingBag className="p-2 w-10 h-10 hover:scale-105 hover:text-accent duration-300" />
                </Link>
                <Button className="text-sm font-semibold rounded-full px-6">
                  My Medilazar
                </Button>
              </div>
              <BiMenuAltRight className="w-7 h-7 md:hidden md:w-0" />
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export default TopNav;
