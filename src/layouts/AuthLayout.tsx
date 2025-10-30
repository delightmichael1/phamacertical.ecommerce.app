import React from "react";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

function AuthLayout(props: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full overflow-hidden">
      <div className="p-2 w-full h-full">
        <div className="flex justify-center items-center bg-[url('/images/bluebg.jpg')] bg-cover bg-no-repeat bg-center rounded-4xl w-full h-full">
          <Image
            src={"/logo/logo.svg"}
            alt="logo"
            width={0}
            height={0}
            sizes="100vw"
            className="w-60 h-fit"
          />
        </div>
      </div>
      <div className="w-full h-full overflow-y-auto">{props.children}</div>
    </div>
  );
}

export default AuthLayout;
