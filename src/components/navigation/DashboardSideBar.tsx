import cn from "@/utils/cn";
import Link from "next/link";
import Image from "next/image";
import Logout from "../modals/Logout";
import { IconType } from "react-icons";
import { BiHome } from "react-icons/bi";
import { useRouter } from "next/router";
import { HiHome } from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";
import { useModal } from "../modals/Modal";
import { usePathname } from "next/navigation";
import { AiFillProduct } from "react-icons/ai";
import useUserStore from "@/stores/useUserStore";
import React, { useEffect, useState } from "react";
import { RiShoppingBagFill } from "react-icons/ri";
import { FaShoppingBasket, FaUserCog } from "react-icons/fa";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { FaCartArrowDown, FaHeart, FaUser, FaUsers } from "react-icons/fa6";

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
    icon: HiHome,
    href: "/shop/dashboard",
    role: "retailer",
  },
  {
    name: "Shop",
    icon: FaShoppingBasket,
    href: "/shop",
    role: "retailer",
  },
  {
    name: "My Cart",
    icon: RiShoppingBagFill,
    href: "/shop/dashboard/cart",
    role: "retailer",
  },
  {
    name: "My Wish List",
    icon: FaHeart,
    href: "/shop/dashboard/wish-list",
    role: "retailer",
  },
  {
    name: "My Orders",
    icon: FaCartArrowDown,
    href: "/shop/dashboard/orders",
    role: "retailer",
  },
  {
    name: "Users",
    icon: FaUsers,
    href: "/shop/dashboard/users",
    role: "admin",
  },
  {
    name: "Account Management",
    icon: FaUserCog,
    href: "/shop/dashboard/account",
    role: "retailer",
  },
];

const supplierPages = [
  {
    name: "Dashboard",
    icon: HiHome,
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
    icon: FaCartArrowDown,
    href: "/supplier/orders",
    role: "supplier",
  },
  {
    name: "Ads",
    icon: AiFillProduct,
    href: "/supplier/ads",
    role: "supplier",
  },
  {
    name: "Account Management",
    icon: FaUserCog,
    href: "/supplier/account",
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
    <div className="flex flex-col justify-between bg-primary backdrop-blur-md p-4 w-80 h-full text-white">
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
              "flex items-center space-x-4 hover:bg-primary-light/20 p-4 rounded-xl w-full font-semibold text-white/80 text-sm duration-300 cursor-pointer",
              pathname === page.href &&
                "bg-primary-light/20 border-l-3 border-primary-light text-white",
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
