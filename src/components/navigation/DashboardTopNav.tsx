import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "../buttons/Button";
import { FaUser } from "react-icons/fa6";
import useAppStore from "@/stores/AppStore";
import { RiAddLargeLine } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";

type Props = {
  isSupplier?: boolean;
};

function DashboardTopNav(props: Props) {
  const { notications } = useAppStore();
  return (
    <div className="flex justify-between items-center space-x-4 bg-primary p-2 w-full text-white">
      <Link href={props.isSupplier ? "/supplier" : "/dashboard"}>
        <Image
          src={"/logo/logo.svg"}
          alt="logo"
          width={0}
          height={0}
          sizes="100vw"
          className="w-auto h-full max-h-10 md:max-h-16"
        />
      </Link>
      <div className="flex items-center space-x-4">
        {props.isSupplier && (
          <Button>
            <RiAddLargeLine className="w-4 h-4" />
            <span>Create</span>
          </Button>
        )}
        {!props.isSupplier && (
          <Link
            href="/notifications"
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
        <div className="flex items-center space-x-2 p-1 pr-4 border border-strokedark rounded-full">
          <FaUser className="bg-strokedark/40 p-1 rounded-full w-8 h-8 text-white" />
          <div className="flex flex-col">
            <span className="text-sm">John Chimuti</span>
            <span className="text-xs">chimuti@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTopNav;
