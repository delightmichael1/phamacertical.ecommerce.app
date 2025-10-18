import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Preloader from "@/components/Preloader";
import React, { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

function AuthLayout(props: Props) {
  const router = useRouter();
  const [height, setHeight] = useState(0);
  const { getAuthStatus, getDeviceInfo } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const handleSetHeight = () => {
      setHeight(window.innerHeight);
    };
    fetchAuthStatus();
    handleSetHeight();

    window.addEventListener("resize", handleSetHeight);
    return () => {
      window.removeEventListener("resize", handleSetHeight);
    };
  }, []);

  const fetchAuthStatus = async () => {
    await getDeviceInfo();
    const isAuthenticated = await getAuthStatus();
    if (isAuthenticated) router.replace("/");
    setIsPageLoading(false);
  };

  if (isPageLoading) return <Preloader />;

  return (
    <div
      className="w-full h-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <div className="w-full h-full items-center justify-center flex bg-[url('/images/bluebg.jpg')] bg-center bg-cover bg-no-repeat">
        <Image
          src={"/logo/logo.svg"}
          alt="logo"
          width={0}
          height={0}
          sizes="100vw"
          className="w-60 h-fit"
        />
      </div>
      {props.children}
    </div>
  );
}

export default AuthLayout;
