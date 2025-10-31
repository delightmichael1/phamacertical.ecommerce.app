import React from "react";
import { motion } from "framer-motion";
import DashboardTopNav from "@/components/navigation/DashboardTopNav";
import DashboardSideBar from "@/components/navigation/DashboardSideBar";

interface Props {
  title: string;
  description: string;
  isSupplier?: boolean;
  children: React.ReactNode;
}

function DashboardLayout(props: Props) {
  return (
    <div className="flex w-full h-full overflow-hidden">
      <DashboardSideBar isSupplier={props.isSupplier} />
      <div className="flex flex-col space-y-4 w-full h-full overflow-y-auto">
        <DashboardTopNav isSupplier={props.isSupplier} />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="flex flex-col p-4 w-full h-full"
        >
          <div className="flex flex-col mx-auto mb-4 container">
            <h1 className="text-2xl">{props.title}</h1>
            <span className="text-gray-500">{props.description}</span>
          </div>
          {props.children}
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardLayout;
