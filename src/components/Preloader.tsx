import Loader from "./Loader";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Props = {
  isFullHeight?: boolean;
};

function Preloader(props: Props) {
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
      className="relative flex flex-col justify-center items-center w-full h-full"
      style={props.isFullHeight ? { height: `${pageHeight}px` } : {}}
    >
      <Image
        src={"/favicon.png"}
        alt="logo"
        width={0}
        height={0}
        sizes="100vw"
        className="top-1/2 right-1/2 z-50 absolute rounded-full w-24 h-24 -translate-y-1/2 translate-x-1/2"
      />
      <Loader />
    </div>
  );
}

export default Preloader;
