import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

function AuthLayout(props: Props) {
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
      className="grid grid-cols-1 lg:grid-cols-2 w-full h-full overflow-hidden"
      style={{ height: `${pageHeight}px` }}
    >
      <div className="p-2 w-full h-full">
        <div className="relative flex justify-start items-start bg-[url('/images/bluebg.jpg')] bg-cover bg-no-repeat bg-center p-6 rounded-4xl w-full h-full overflow-hidden">
          <Image
            src={"/logo/logo.svg"}
            alt="logo"
            width={0}
            height={0}
            sizes="100vw"
            className="z-10 w-40 h-fit"
          />
        </div>
      </div>
      <div className="p-2 w-full h-full overflow-y-auto">{props.children}</div>
    </div>
  );
}

export default AuthLayout;
