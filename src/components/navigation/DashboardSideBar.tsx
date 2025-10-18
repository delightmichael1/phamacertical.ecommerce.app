import {
  MdAddShoppingCart,
  MdOutlineShoppingCartCheckout,
} from "react-icons/md";
import React, { useEffect, useState } from "react";
import cn from "@/utils/cn";
import Logout from "../modals/Logout";
import { IconType } from "react-icons";
import { BiHome } from "react-icons/bi";
import { useRouter } from "next/router";
import { LuLogOut } from "react-icons/lu";
import { useModal } from "../modals/Modal";
import { FaRegHeart } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import SearchInput from "../input/SearchInput";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { AiFillProduct } from "react-icons/ai";

type Props = {
  isSupplier?: boolean;
};

type Page = {
  name: string;
  icon: IconType;
  href: string;
};

const retailerPages = [
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

const supplierPages = [
  {
    name: "Dashboard",
    icon: BiHome,
    href: "/supplier",
  },
  {
    name: "Orders",
    icon: MdOutlineShoppingCartCheckout,
    href: "/supplier/orders",
  },
  {
    name: "Products",
    icon: AiFillProduct,
    href: "/supplier/products",
  },
];

function DashboardSideBar(props: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { openModal, closeModal } = useModal();
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    if (props.isSupplier) {
      setPages(supplierPages);
    } else {
      setPages(retailerPages);
    }
  }, [props.isSupplier]);

  return (
    <div className="flex flex-col justify-between bg-card p-4 w-80 h-full">
      <div className="flex flex-col space-y-2 w-full">
        <SearchInput
          placeholder="Search here..."
          className="mb-8 h-12 text-sm"
          classNames={{ button: "hidden" }}
        />
        {pages.map((page, index) => (
          <button
            key={index}
            className={cn(
              "flex items-center space-x-2 hover:bg-primary/20 p-4 rounded-xl w-full hover:text-black text-sm duration-300 cursor-pointer",
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
        className="flex items-center space-x-2 hover:bg-primary/20 p-4 rounded-xl w-full text-sm duration-300 cursor-pointer"
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
