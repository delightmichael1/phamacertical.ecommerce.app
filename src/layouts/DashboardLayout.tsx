import useAuth from "@/hooks/useAuth";
import useAppStore from "@/stores/AppStore";
import Preloader from "@/components/Preloader";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardTopNav from "@/components/navigation/DashboardTopNav";
import DashboardSideBar from "@/components/navigation/DashboardSideBar";
import { motion } from "framer-motion";

interface Props {
  title: string;
  description: string;
  isSupplier?: boolean;
  children: React.ReactNode;
}

function DashboardLayout(props: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { getAuthStatus, fetchUser } = useAuth();
  const [pageHeight, setPageHeight] = useState(0);
  const pageRef = React.useRef<HTMLDivElement>(null);
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  const deviceId = useAppStore((state) => state.device?.id);

  useEffect(() => {
    (async () => {
      const isAuthenticated = await getAuthStatus();
      if (!pathname.includes("/auth/") && !isAuthenticated) {
        router.replace("/auth/signin");
      }
      if (isAuthenticated && deviceId) {
        await fetchUser(setIsFetchingUser);
      }
    })();
    setIsFetchingUser(false);
  }, [deviceId]);

  if (isFetchingUser) return <Preloader />;

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
      ref={pageRef}
      className="flex flex-col w-full h-full overflow-hidden"
      style={{ height: `${pageHeight}px` }}
    >
      <DashboardTopNav isSupplier={props.isSupplier} />
      <div className="flex w-full h-full overflow-hidden">
        <DashboardSideBar isSupplier={props.isSupplier} />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="flex flex-col p-4 pb-24 w-full h-full overflow-y-auto"
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
