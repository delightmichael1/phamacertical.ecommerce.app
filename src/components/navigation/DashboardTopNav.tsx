import useAppStore from "@/stores/AppStore";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaUser } from "react-icons/fa6";
import { IoNotificationsOutline } from "react-icons/io5";

function DashboardTopNav() {
  const { notications } = useAppStore();
  return (
    <div className="w-full p-2 bg-primary flex items-center justify-between space-x-4 text-white">
      <Link href="/dashboard">
        <Image
          src={"/logo/logo.svg"}
          alt="logo"
          width={0}
          height={0}
          sizes="100vw"
          className="w-auto h-full md:max-h-16 max-h-10"
        />
      </Link>
      <div className="flex items-center space-x-4">
        <Link
          href="/notifications"
          className="relative p-0.5"
          title="Notifications"
        >
          {notications.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-white/70 text-primary w-5 h-5 flex items-center justify-center rounded-full text-xs">
              <span>{notications.length}</span>
            </div>
          )}
          <IoNotificationsOutline className="p-2 w-10 h-10 hover:scale-105 hover:text-accent duration-300" />
        </Link>
        <div className="flex items-center space-x-2 p-1 pr-4 rounded-full border border-strokedark">
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
