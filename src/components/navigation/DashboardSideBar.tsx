import {
  MdAddShoppingCart,
  MdOutlineShoppingCartCheckout,
} from "react-icons/md";
import React from "react";
import cn from "@/utils/cn";
import Logout from "../modals/Logout";
import { BiHome } from "react-icons/bi";
import { useRouter } from "next/router";
import { LuLogOut } from "react-icons/lu";
import { useModal } from "../modals/Modal";
import { FaRegHeart } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import SearchInput from "../input/SearchInput";
import { HiOutlineShoppingBag } from "react-icons/hi";

const pages = [
  {
    name: "Home",
    icon: BiHome,
    href: "/dashboard",
  },
  {
    name: "Shop",
    icon: MdAddShoppingCart,
    href: "/",
  },
  {
    name: "My Cart",
    icon: HiOutlineShoppingBag,
    href: "/dashboard/cart",
  },
  {
    name: "My Wish List",
    icon: FaRegHeart,
    href: "/dashboard/wish-list",
  },
  {
    name: "My Orders",
    icon: MdOutlineShoppingCartCheckout,
    href: "/dashboard/orders",
  },
];

function DashboardSideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { openModal, closeModal } = useModal();

  return (
    <div className="w-80 bg-card h-full flex flex-col justify-between p-4">
      <div className="flex flex-col w-full space-y-2">
        <SearchInput
          placeholder="Search here..."
          className="h-12 text-sm mb-8"
          classNames={{ button: "hidden" }}
        />
        {pages.map((page, index) => (
          <button
            key={index}
            className={cn(
              "flex items-center space-x-2 w-full hover:bg-primary/20 hover:text-black rounded-xl p-4 duration-300 cursor-pointer text-sm",
              pathname === page.href &&
                "bg-primary/20 border-l-3 border-primary"
            )}
            onClick={() => router.push(page.href)}
          >
            <page.icon className="w-5 h-5" />
            <span>{page.name}</span>
          </button>
        ))}
      </div>
      <button
        className="flex items-center space-x-2 w-full hover:bg-primary/20 rounded-xl text-sm p-4 duration-300 cursor-pointer"
        onClick={() => {
          openModal(<Logout closeModal={closeModal} />);
        }}
      >
        <LuLogOut className="w-5 h-5" />
        <span>Log Out</span>
      </button>
    </div>
  );
}

export default DashboardSideBar;
