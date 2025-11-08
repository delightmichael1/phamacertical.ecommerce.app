import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineShoppingBag, HiShoppingBag } from "react-icons/hi";

import cn from "@/utils/cn";
import Button from "../buttons/Button";
import { IconType } from "react-icons";
import { useRouter } from "next/navigation";
import useAppStore from "@/stores/AppStore";
import { usePathname } from "next/navigation";
import SearchInput from "../input/SearchInput";
import { BiMenuAltRight } from "react-icons/bi";
import usePersistedStore from "@/stores/PersistedStored";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { useModal } from "../modals/Modal";
import ProductListing from "../ProductListing";

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
  const { notications } = useAppStore();
  const { openModal, closeModal } = useModal();
  const { cart, wishList } = usePersistedStore();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const products = useAppStore((state) => state.products);

  const links: ILink[] = [
    {
      name: "Notifications",
      href: "notifications",
      value: notications.length,
      icon: IoNotificationsOutline,
      active: IoNotifications,
    },
    {
      name: "Wish List",
      href: "wish-list",
      value: wishList.reduce((acc, item) => acc + (item.quantity ?? 0), 0),
      icon: FaRegHeart,
      active: FaHeart,
    },
    {
      name: "Cart",
      href: "cart",
      value: cart.reduce((acc, item) => acc + (item.quantity ?? 0), 0),
      icon: HiOutlineShoppingBag,
      active: HiShoppingBag,
    },
  ];

  const controlHeader = () => {
    if (typeof window !== "undefined") {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScrollY) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScroll);
    }
  };

  useEffect(() => {
    window?.addEventListener("scroll", () => controlHeader());
    return () => {
      window?.addEventListener("scroll", () => controlHeader());
    };
  }, [lastScrollY]);

  const onSearch = () => {
    const foundProducts = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        product.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
        product.supplier.name.toLowerCase().includes(searchFilter.toLowerCase())
    );
    openModal(
      <ProductListing
        products={foundProducts}
        isLoading={false}
        searchQuery={searchFilter}
      />
    );
  };

  return (
    <AnimatePresence>
      {showHeader && (
        <motion.nav
          id="header"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="top-0 z-50 fixed backdrop-blur-lg w-full text-white"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mx-auto text-sm container">
              <Link href="/shop">
                <Image
                  src={"/logo/logo-dark.svg"}
                  alt="logo"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-auto h-full max-h-10 md:max-h-16"
                />
              </Link>

              <div className="hidden md:flex flex-col flex-1 justify-center items-center space-y-2 mx-8">
                <SearchInput
                  onClick={onSearch}
                  className="text-black"
                  onChange={setSearchFilter}
                />
              </div>
              <div className="hidden md:flex items-center space-x-3">
                {links.map((item) => {
                  const Icon = pathname === item.href ? item.active : item.icon;
                  return (
                    <button
                      onClick={() => {
                        useAppStore.setState((state) => {
                          state.showSideBar = {
                            open: true,
                            value: item.href,
                          };
                        });
                      }}
                      key={item.name}
                      className={cn(
                        "relative p-0.5 tooltip",
                        pathname === item.href &&
                          "bg-primary-light/12 rounded-full"
                      )}
                    >
                      {item.value > 0 && (
                        <div className="-top-1 -right-1 absolute flex justify-center items-center bg-primary/70 rounded-full w-5 h-5 text-white text-xs">
                          <span>{item.value}</span>
                        </div>
                      )}
                      <Icon className="p-2 w-10 h-10 text-primary hover:text-accent hover:scale-105 duration-300" />
                      <span className="tooltiptext">{item.name}</span>
                    </button>
                  );
                })}
                <Button
                  onClick={() => router.push("/shop/dashboard")}
                  className="bg-primary px-6 rounded-full font-semibold text-sm"
                >
                  My Account
                </Button>
              </div>
              <BiMenuAltRight className="md:hidden w-7 md:w-0 h-7" />
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export default TopNav;
