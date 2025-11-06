import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/ui/BreadCrumb";
import DashboardTopNav from "@/components/navigation/DashboardTopNav";
import DashboardSideBar from "@/components/navigation/DashboardSideBar";

interface Props {
  title: string;
  isAdmin?: boolean;
  description: string;
  isSupplier?: boolean;
  children: React.ReactNode;
}

function DashboardLayout(props: Props) {
  const [pageHeight, setPageHeight] = useState(0);

  useEffect(() => {
    const handleSetHeight = () => {
      setPageHeight(window.innerHeight);
    };
    handleSetHeight();

    window.addEventListener("resize", handleSetHeight);
    return () => {
      window.removeEventListener("resize", handleSetHeight);
    };
  }, []);
  return (
    <div
      className="flex w-full h-full overflow-hidden"
      style={{ height: `${pageHeight}px` }}
    >
      <DashboardSideBar isSupplier={props.isSupplier} isAdmin={props.isAdmin} />
      <div className="flex flex-col space-y-4 w-full h-full overflow-y-auto">
        <DashboardTopNav
          title={props.title}
          description={props.description}
          isSupplier={props.isSupplier}
          isAdmin={props.isAdmin}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="flex flex-col p-4 pt-0 w-full h-full"
        >
          <div className="flex flex-col mx-auto mb-10 container">
            <Breadcrumb />
          </div>
          {props.children}
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardLayout;
