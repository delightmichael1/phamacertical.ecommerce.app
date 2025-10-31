import React from "react";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

function AuthLayout(props: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full overflow-hidden">
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
