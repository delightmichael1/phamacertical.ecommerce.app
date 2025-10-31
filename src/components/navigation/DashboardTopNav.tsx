import React from "react";
import Link from "next/link";
import Button from "../buttons/Button";
import { FaUser } from "react-icons/fa6";
import { useModal } from "../modals/Modal";
import useAppStore from "@/stores/AppStore";
import AddProduct from "../modals/AddProduct";
import SearchInput from "../input/SearchInput";
import { RiAddLargeLine } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import useUserStore from "@/stores/useUserStore";

type Props = {
  isSupplier?: boolean;
};

function DashboardTopNav(props: Props) {
  const { openModal } = useModal();
  const { notications } = useAppStore();
  const { fullname, email } = useUserStore();

  return (
    <div className="top-0 sticky justify-center items-center backdrop-blur-lg p-4 w-full">
      <div className="flex justify-between items-center space-x-4 mx-auto w-full container">
        <SearchInput />
        <div className="flex items-center space-x-4">
          {props.isSupplier && (
            <Button
              onClick={() => openModal(<AddProduct />)}
              className="bg-primary h-10 text-sm"
            >
              <RiAddLargeLine className="w-4 h-4" />
              <span>Create</span>
            </Button>
          )}
          {!props.isSupplier && (
            <Link
              href="/shop/notifications"
              className="relative p-0.5"
              title="Notifications"
            >
              {notications.length > 0 && (
                <div className="-top-1 -right-1 absolute flex justify-center items-center bg-white/70 rounded-full w-5 h-5 text-primary text-xs">
                  <span>{notications.length}</span>
                </div>
              )}
              <IoNotificationsOutline className="p-2 w-10 h-10 hover:text-accent hover:scale-105 duration-300" />
            </Link>
          )}
          <div className="flex items-center space-x-2 p-1 pr-4 border border-gray-400 rounded-full">
            <FaUser className="bg-strokedark/40 p-1 rounded-full w-8 h-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-sm">{fullname}</span>
              <span className="text-xxs">{email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTopNav;
