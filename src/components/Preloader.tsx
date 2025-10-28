import React from "react";
import Loader from "./Loader";
import Image from "next/image";

function Preloader() {
  return (
    <div className="relative flex flex-col justify-center items-center w-full h-full">
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
