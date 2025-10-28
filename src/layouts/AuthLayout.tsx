import React from "react";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

function AuthLayout(props: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full overflow-hidden">
      <div className="flex justify-center items-center bg-[url('/images/image.webp')] bg-cover bg-no-repeat bg-center w-full h-full">
        <Image
          src={"/logo/logo.svg"}
          alt="logo"
          width={0}
          height={0}
          sizes="100vw"
          className="w-60 h-fit"
        />
      </div>
      <div className="w-full h-full overflow-y-auto">{props.children}</div>
    </div>
  );
}

export default AuthLayout;
