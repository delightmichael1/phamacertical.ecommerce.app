"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsTwitterX } from "react-icons/bs";
import { RiInstagramFill } from "react-icons/ri";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FaFacebook, FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import cn from "@/utils/cn";
import { menu } from "@/utils/menu";
import Button from "../buttons/Button";
import Dropdown from "../dropdown/Dropdown";
import { usePathname } from "next/navigation";
import SearchInput from "../input/SearchInput";

function TopNav() {
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const social = [
    {
      name: "Facebook",
      icon: FaFacebook,
      link: "https://www.facebook.com/",
    },
    {
      name: "Instagram",
      icon: RiInstagramFill,
      link: "https://www.instagram.com/",
    },
    {
      name: "Twitter",
      icon: BsTwitterX,
      link: "https://twitter.com/",
    },
  ];

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
          {/* Top Strip */}
          <div className="border-b border-strokedark/20">
            <div className="container mx-auto flex items-center justify-between text-sm">
              <span className="p-4">Free Shipping for all orders over $50</span>
              <div className="flex items-center space-x-4 h-full">
                <div className="p-4 border-r border-strokedark/20">
                  <Dropdown
                    options={["English", "Spanish", "French", "German"]}
                  />
                </div>
                <div className="p-4 border-r border-strokedark/20">
                  <Dropdown options={["USD", "EUR", "GBP"]} />
                </div>
                {social.map((item) => (
                  <Link
                    href={item.link}
                    key={item.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="p-2">
                      <item.icon className="w-4 h-4 hover:scale-105 duration-200 hover:text-accent" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Nav */}
          <div className="p-4 bg-primary">
            <div className="container mx-auto flex items-center justify-between text-sm space-x-8">
              <Link href="/">
                <Image
                  src={"/logo/logo.png"}
                  alt="logo"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-auto h-full max-h-16"
                />
              </Link>

              <div className="flex flex-col space-y-2 flex-1 items-center justify-center">
                <SearchInput className="text-black" />
                <div className="flex items-center space-x-6">
                  {menu.map((item) => (
                    <Link
                      href={item.path}
                      key={item.title}
                      className={cn(
                        "px-4 py-2 font-semibold hover:text-accent duration-300",
                        pathname === item.path &&
                          "text-accent bg-background/30 rounded-xl border-b-2 border-accent"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Link href={"#"}>
                  <FaRegHeart className="p-2 w-10 h-10 hover:scale-105 hover:text-accent duration-300" />
                </Link>
                <Link href={"#"}>
                  <HiOutlineShoppingBag className="p-2 w-10 h-10 hover:scale-105 hover:text-accent duration-300" />
                </Link>
                <Button className="text-sm font-semibold rounded-full px-6">
                  My Medilazar
                </Button>
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export default TopNav;
