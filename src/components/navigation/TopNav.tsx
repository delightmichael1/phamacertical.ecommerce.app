import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineShoppingBag, HiShoppingBag } from "react-icons/hi";

import Button from "../buttons/Button";
import { IconType } from "react-icons";
import { useRouter } from "next/navigation";
import useAppStore from "@/stores/AppStore";
import { usePathname } from "next/navigation";
import SearchInput from "../input/SearchInput";
import { BiMenuAltRight } from "react-icons/bi";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import cn from "@/utils/cn";

type ILink = {
  name: string;
  href: string;
  value: number;
  icon: IconType;
  active: IconType;
};

function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const { cart, wishList, notications } = useAppStore();

  const links: ILink[] = [
    {
      name: "Notifications",
      href: "/notifications",
      value: notications.length,
      icon: IoNotificationsOutline,
      active: IoNotifications,
    },
    {
      name: "Wish List",
      href: "/wish-list",
      value: wishList.reduce((acc, item) => acc + (item.quantity ?? 0), 0),
      icon: FaRegHeart,
      active: FaHeart,
    },
    {
      name: "Cart",
      href: "/cart",
      value: cart.reduce((acc, item) => acc + (item.quantity ?? 0), 0),
      icon: HiOutlineShoppingBag,
      active: HiShoppingBag,
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
                {links.map((item) => {
                  const Icon = pathname === item.href ? item.active : item.icon;
                  return (
                    <Link
                      href={item.href}
                      className={cn(
                        "relative p-0.5",
                        pathname === item.href && "bg-white/20 rounded-full"
                      )}
                      title={item.name}
                    >
                      {item.value > 0 && (
                        <div className="absolute -top-1 -right-1 bg-white/70 text-primary w-5 h-5 flex items-center justify-center rounded-full text-xs">
                          <span>{item.value}</span>
                        </div>
                      )}
                      <Icon className="p-2 w-10 h-10 hover:scale-105 hover:text-accent duration-300" />
                    </Link>
                  );
                })}
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="text-sm font-semibold rounded-full px-6"
                >
                  My Account
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
