import {
  MdAddShoppingCart,
  MdOutlineShoppingCartCheckout,
} from "react-icons/md";
import cn from "@/utils/cn";
import Link from "next/link";
import Image from "next/image";
import Logout from "../modals/Logout";
import { IconType } from "react-icons";
import { BiHome } from "react-icons/bi";
import { useRouter } from "next/router";
import { LuLogOut } from "react-icons/lu";
import { useModal } from "../modals/Modal";
import { usePathname } from "next/navigation";
import { AiFillProduct } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FaRegHeart, FaUsers } from "react-icons/fa6";
import useUserStore from "@/stores/useUserStore";

type Props = {
  isSupplier?: boolean;
};

type Page = {
  name: string;
  icon: IconType;
  href: string;
  role: string;
};

const retailerPages = [
  {
    name: "Home",
    icon: BiHome,
    href: "/shop/dashboard",
    role: "retailer",
  },
  {
    name: "Shop",
    icon: MdAddShoppingCart,
    href: "/shop",
    role: "retailer",
  },
  {
    name: "My Cart",
    icon: HiOutlineShoppingBag,
    href: "/shop/dashboard/cart",
    role: "retailer",
  },
  {
    name: "My Wish List",
    icon: FaRegHeart,
    href: "/shop/dashboard/wish-list",
    role: "retailer",
  },
  {
    name: "My Orders",
    icon: MdOutlineShoppingCartCheckout,
    href: "/shop/dashboard/orders",
    role: "retailer",
  },
  {
    name: "Users",
    icon: FaUsers,
    href: "/shop/dashboard/users",
    role: "admin",
  },
];

const supplierPages = [
  {
    name: "Dashboard",
    icon: BiHome,
    href: "/supplier",
    role: "supplier",
  },
  {
    name: "Users",
    icon: FaUsers,
    href: "/supplier/users",
    role: "admin",
  },
  {
    name: "Products",
    icon: AiFillProduct,
    href: "/supplier/products",
    role: "supplier",
  },
  {
    name: "Orders",
    icon: MdOutlineShoppingCartCheckout,
    href: "/supplier/orders",
    role: "supplier",
  },
  {
    name: "Ads",
    icon: AiFillProduct,
    href: "/supplier/ads",
    role: "supplier",
  },
];

function DashboardSideBar(props: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { openModal, closeModal } = useModal();
  const [pages, setPages] = useState<Page[]>([]);
  const role = useUserStore((state) => state.role);

  useEffect(() => {
    if (props.isSupplier) {
      setPages(supplierPages);
    } else {
      setPages(retailerPages);
    }
  }, [props.isSupplier]);

  return (
    <div className="flex flex-col justify-between bg-primary/70 backdrop-blur-md p-4 w-80 h-full text-white">
      <div className="flex flex-col space-y-2 w-full">
        <Link href={props.isSupplier ? "/supplier" : "/dashboard"}>
          <Image
            src={"/logo/logo.svg"}
            alt="logo"
            width={0}
            height={0}
            sizes="100vw"
            className="mb-10 w-auto h-full max-h-10 md:max-h-12"
          />
        </Link>
        {pages.map((page, index) => (
          <button
            key={index}
            className={cn(
              "flex items-center space-x-2 hover:bg-primary/20 p-4 rounded-xl w-full font-semibold text-sm duration-300 cursor-pointer",
              pathname === page.href &&
                "bg-primary/20 border-l-3 border-primary",
              !role.includes(page.role) && "hidden"
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
